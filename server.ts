import 'dotenv/config';
import crypto from 'crypto';
import express, { type NextFunction, type Request, type Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Content, GenerateContentResponse } from '@google/genai';
import {
  generateAudioBrief,
  getCatalogStats,
  getPersonaConfig,
  retrieveGroundedContext,
  runRoleFitAnalysis,
  sanitizeAudioMime,
  sanitizeLanguage,
  sanitizeVoiceName,
  synthesizeSpeech,
  transcribeAudio,
  type ChatPersonaId,
} from './server/aiPipeline.ts';
import {
  getGeminiClient,
  normalizeGeminiError,
  withExponentialBackoff,
} from './server/gemini.ts';

interface IncomingMessage {
  role: 'user' | 'model';
  text: string;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT) || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

const MAX_TURNS = 24;
const MAX_MESSAGE_CHARS = 2500;
const MAX_AUDIO_BASE64_CHARS = 7_500_000; // ~5.5MB raw audio cap

// Bounded in-memory sliding-window rate limiter & audio cache to protect API quota
interface RateBucket {
  timestamps: number[];
}

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

function createRateLimiter(maxRequests: number, windowMs: number) {
  const buckets = new Map<string, RateBucket>();
  const MAX_TRACKED_KEYS = 2000;

  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    const key = req.ip || req.socket.remoteAddress || 'unknown';
    const existing = buckets.get(key);
    const recent = existing
      ? existing.timestamps.filter((ts) => now - ts < windowMs)
      : [];

    if (recent.length >= maxRequests) {
      const retryAfterSec = Math.max(1, Math.ceil((windowMs - (now - recent[0])) / 1000));
      res.setHeader('Retry-After', String(retryAfterSec));
      res.status(429).json({
        error: `Too many requests right now. Please try again in ${retryAfterSec}s.`,
      });
      return;
    }

    recent.push(now);
    buckets.set(key, { timestamps: recent });

    // Prevent unbounded memory growth under churn
    if (buckets.size > MAX_TRACKED_KEYS) {
      for (const [bucketKey, bucket] of buckets) {
        if (bucket.timestamps.every((ts) => now - ts >= windowMs)) {
          buckets.delete(bucketKey);
        }
      }
      if (buckets.size > MAX_TRACKED_KEYS) {
        const oldestKey = buckets.keys().next().value;
        if (oldestKey) buckets.delete(oldestKey);
      }
    }

    next();
  };
}

function createTtlCache<T>(maxEntries: number, ttlMs: number) {
  const store = new Map<string, CacheEntry<T>>();

  return {
    get(key: string): T | null {
      const entry = store.get(key);
      if (!entry) return null;
      if (Date.now() > entry.expiresAt) {
        store.delete(key);
        return null;
      }
      // Refresh recency
      store.delete(key);
      store.set(key, entry);
      return entry.value;
    },
    set(key: string, value: T) {
      if (store.size >= maxEntries) {
        const oldestKey = store.keys().next().value;
        if (oldestKey) store.delete(oldestKey);
      }
      store.set(key, { value, expiresAt: Date.now() + ttlMs });
    },
  };
}

const chatLimiter = createRateLimiter(30, 60_000);
const heavyAiLimiter = createRateLimiter(12, 60_000);
const speakCache = createTtlCache<Awaited<ReturnType<typeof synthesizeSpeech>>>(36, 20 * 60_000);
const audioBriefCache = createTtlCache<Awaited<ReturnType<typeof generateAudioBrief>>>(24, 30 * 60_000);

// Crash-proof process guards
process.on('unhandledRejection', (reason) => {
  console.error('[server] Unhandled promise rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('[server] Uncaught exception:', err);
});

function isValidPersona(value: unknown): value is ChatPersonaId {
  return value === 'guide' || value === 'recruiter' || value === 'quick';
}

function parseMessages(raw: unknown): IncomingMessage[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;

  const cleaned: IncomingMessage[] = [];
  for (const item of raw.slice(-MAX_TURNS)) {
    if (typeof item !== 'object' || item === null) return null;
    const role = (item as { role?: unknown }).role;
    const text = (item as { text?: unknown }).text;
    if ((role !== 'user' && role !== 'model') || typeof text !== 'string') {
      return null;
    }
    const trimmed = text.trim();
    if (!trimmed) continue;
    cleaned.push({
      role,
      text: trimmed.slice(0, MAX_MESSAGE_CHARS),
    });
  }

  if (cleaned.length === 0 || cleaned[cleaned.length - 1].role !== 'user') {
    return null;
  }

  return cleaned;
}

async function startServer() {
  const app = express();
  app.set('trust proxy', 1);

  // Allow up to 8mb JSON body for base64 voice clips while keeping API safe
  app.use(express.json({ limit: '8mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({
      ok: true,
      aiConfigured: Boolean(process.env.GEMINI_API_KEY?.trim()),
      catalog: getCatalogStats(),
      capabilities: ['chat-stream', 'role-fit-json', 'voice-transcribe', 'voice-tts', 'audio-brief'],
    });
  });

  // 1. Multi-Turn Streaming Chat with Portfolio Data Retrieval & Citations
  app.post('/api/ai/chat', chatLimiter, async (req, res) => {
    const personaId: ChatPersonaId = isValidPersona(req.body?.persona)
      ? req.body.persona
      : 'guide';
    const language = sanitizeLanguage(req.body?.language);
    const messages = parseMessages(req.body?.messages);

    if (!messages) {
      res.status(400).json({
        error: 'Please provide a valid conversation ending with a user message.',
      });
      return;
    }

    const persona = getPersonaConfig(personaId, language);
    const latestMessage = messages[messages.length - 1].text;
    const historyTurns = messages.slice(0, -1);
    const retrieval = retrieveGroundedContext(latestMessage);

    const firstUserIdx = historyTurns.findIndex((m) => m.role === 'user');
    const normalizedHistory: Content[] =
      firstUserIdx === -1
        ? []
        : historyTurns.slice(firstUserIdx).map((m) => ({
            role: m.role,
            parts: [{ text: m.text }],
          }));

    const effectiveSystemInstruction = retrieval.focusedSnippet
      ? `${persona.systemInstruction}\n\nHIGHEST-RELEVANCE WEBSITE MATCHES FOR THIS QUERY:\n${retrieval.focusedSnippet}`
      : persona.systemInstruction;

    let clientClosed = false;
    req.on('close', () => {
      clientClosed = true;
    });

    try {
      const ai = getGeminiClient();

      const streamResponse = await withExponentialBackoff(async () => {
        const chat = ai.chats.create({
          model: persona.model,
          history: normalizedHistory,
          config: {
            systemInstruction: effectiveSystemInstruction,
          },
        });
        return chat.sendMessageStream({ message: latestMessage });
      });

      res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache, no-transform');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Accel-Buffering', 'no');
      res.flushHeaders?.();

      res.write(
        `data: ${JSON.stringify({
          meta: { model: persona.model, persona: persona.id },
          citations: retrieval.citations,
        })}\n\n`
      );

      for await (const chunk of streamResponse) {
        if (clientClosed) break;
        const c = chunk as GenerateContentResponse;
        const delta = c.text;
        if (delta) {
          res.write(`data: ${JSON.stringify({ delta })}\n\n`);
        }
      }

      if (!clientClosed) {
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        res.end();
      }
    } catch (err) {
      const { status, message } = normalizeGeminiError(err);
      if (!res.headersSent) {
        res.status(status).json({ error: message });
      } else if (!clientClosed) {
        res.write(`data: ${JSON.stringify({ error: message })}\n\n`);
        res.end();
      }
    }
  });

  // 2. Structured Role-Fit & Lab Alignment Analyzer (JSON Schema grounded in portfolioData.ts)
  app.post('/api/ai/role-fit', heavyAiLimiter, async (req, res) => {
    const roleDescription =
      typeof req.body?.roleDescription === 'string'
        ? req.body.roleDescription.trim().slice(0, 3000)
        : '';

    if (roleDescription.length < 6) {
      res.status(400).json({
        error: 'Please enter a role title, research focus, or brief description (at least 6 characters).',
      });
      return;
    }

    const language = sanitizeLanguage(req.body?.language);

    try {
      const ai = getGeminiClient();
      const result = await runRoleFitAnalysis(ai, roleDescription, language);
      res.json(result);
    } catch (err) {
      const { status, message } = normalizeGeminiError(err);
      res.status(status).json({ error: message });
    }
  });

  // 3. Voice Input: Speech-to-Text Transcription (gemini-3.5-transcribe)
  app.post('/api/ai/transcribe', heavyAiLimiter, async (req, res) => {
    const audioBase64 =
      typeof req.body?.audioBase64 === 'string' ? req.body.audioBase64 : '';
    const mimeType = sanitizeAudioMime(req.body?.mimeType);

    if (!audioBase64 || audioBase64.length > MAX_AUDIO_BASE64_CHARS) {
      res.status(400).json({
        error: 'Please record a short voice question (under 5 MB).',
      });
      return;
    }

    try {
      const ai = getGeminiClient();
      const transcript = await transcribeAudio(ai, audioBase64, mimeType);
      res.json({ transcript });
    } catch (err) {
      const { status, message } = normalizeGeminiError(err);
      res.status(status).json({ error: message });
    }
  });

  // 4. Voice Output: Text-to-Speech Synthesis (gemini-3.8-flash-lite-tts, unary WAV)
  app.post('/api/ai/speak', heavyAiLimiter, async (req, res) => {
    const text = typeof req.body?.text === 'string' ? req.body.text.trim() : '';
    const voiceName = sanitizeVoiceName(req.body?.voiceName);

    if (!text) {
      res.status(400).json({ error: 'Please provide text to speak.' });
      return;
    }

    const cacheKey = `${voiceName}:${crypto.createHash('sha256').update(text.slice(0, 1200)).digest('hex')}`;
    const cached = speakCache.get(cacheKey);
    if (cached) {
      res.json(cached);
      return;
    }

    try {
      const ai = getGeminiClient();
      const audio = await synthesizeSpeech(ai, text, voiceName);
      speakCache.set(cacheKey, audio);
      res.json(audio);
    } catch (err) {
      const { status, message } = normalizeGeminiError(err);
      res.status(status).json({ error: message });
    }
  });

  // 5. Two-Stage AI Pipeline: Portfolio / Paper / Project Audio Brief
  app.post('/api/ai/audio-brief', heavyAiLimiter, async (req, res) => {
    const rawKind = req.body?.kind;
    const kind: 'overview' | 'project' | 'paper' =
      rawKind === 'project' || rawKind === 'paper' ? rawKind : 'overview';
    const id = typeof req.body?.id === 'string' ? req.body.id.trim().slice(0, 80) : undefined;
    const voiceName = sanitizeVoiceName(req.body?.voiceName);
    const language = sanitizeLanguage(req.body?.language);

    const cacheKey = `${kind}:${id ?? 'all'}:${voiceName}:${language}`;
    const cached = audioBriefCache.get(cacheKey);
    if (cached) {
      res.json(cached);
      return;
    }

    try {
      const ai = getGeminiClient();
      const brief = await generateAudioBrief(ai, { kind, id }, voiceName, language);
      audioBriefCache.set(cacheKey, brief);
      res.json(brief);
    } catch (err) {
      const { status, message } = normalizeGeminiError(err);
      res.status(status).json({ error: message });
    }
  });

  // Defensive JSON error handler (catches malformed JSON bodies without crashing Express)
  app.use((err: unknown, _req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
      next(err);
      return;
    }
    const status =
      typeof err === 'object' && err !== null && 'status' in err
        ? Number((err as { status?: unknown }).status) || 400
        : 500;
    res.status(status).json({
      error: status === 413 ? 'Request payload too large.' : 'Invalid request payload.',
    });
  });

  if (!IS_PROD) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir, { index: false }));
    app.get('*', (_req, res) => {
      const indexHtml = path.join(distDir, 'index.html');
      if (fs.existsSync(indexHtml)) {
        res.sendFile(indexHtml);
      } else {
        res.status(404).send('Build output not found. Run npm run build first.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
