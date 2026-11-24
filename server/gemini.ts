import { GoogleGenAI } from '@google/genai';

let cachedClient: GoogleGenAI | null = null;
let cachedKey: string | undefined;

export function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new GeminiApiError(
      'The AI assistant is not connected yet because GEMINI_API_KEY is not configured. Please check your API key in Settings > Secrets.',
      503
    );
  }

  if (!cachedClient || cachedKey !== apiKey) {
    cachedClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    cachedKey = apiKey;
  }

  return cachedClient;
}

export class GeminiApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'GeminiApiError';
    this.status = status;
  }
}

export function normalizeGeminiError(err: unknown): { status: number; message: string } {
  if (err instanceof GeminiApiError) {
    return { status: err.status, message: err.message };
  }

  const rawStatus =
    typeof err === 'object' && err !== null && 'status' in err
      ? Number((err as { status?: unknown }).status)
      : NaN;
  const rawMessage = err instanceof Error ? err.message : String(err ?? '');
  const upper = rawMessage.toUpperCase();

  if (
    rawStatus === 403 ||
    upper.includes('PERMISSION_DENIED') ||
    upper.includes('API_KEY_INVALID') ||
    upper.includes('API KEY NOT VALID')
  ) {
    return {
      status: rawStatus === 403 ? 403 : 400,
      message:
        'The Gemini API key appears invalid or lacks permission. Please verify your key in Settings > Secrets.',
    };
  }

  if (rawStatus === 429 || upper.includes('RESOURCE_EXHAUSTED') || upper.includes('QUOTA')) {
    return {
      status: 429,
      message:
        'The AI assistant is temporarily rate-limited. Please wait a moment and try again, or check your Gemini quota in Settings > Secrets.',
    };
  }

  if (rawStatus === 404 || upper.includes('NOT_FOUND')) {
    return {
      status: 404,
      message: 'The requested Gemini model was not found. Please try again shortly.',
    };
  }

  return {
    status: Number.isFinite(rawStatus) && rawStatus >= 400 && rawStatus < 600 ? rawStatus : 502,
    message:
      'Unable to reach the AI assistant right now. Please try again in a few seconds.',
  };
}

export async function withExponentialBackoff<T>(
  fn: () => Promise<T>,
  maxAttempts = 3
): Promise<T> {
  let attempt = 0;
  let lastError: unknown;

  while (attempt < maxAttempts) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      const status =
        typeof err === 'object' && err !== null && 'status' in err
          ? Number((err as { status?: unknown }).status)
          : NaN;

      // Only retry transient 5xx or network failures; never retry 4xx client/auth errors
      const retryable = !Number.isFinite(status) || status >= 500;
      attempt += 1;
      if (!retryable || attempt >= maxAttempts) {
        throw err;
      }
      const delayMs = 300 * Math.pow(2, attempt - 1);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw lastError;
}
