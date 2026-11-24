import { Type, type GoogleGenAI } from '@google/genai';
import {
  CV_PDF_URL,
  EXPERIENCES,
  FOCUS_AREAS,
  GLOBAL_COUNTRIES,
  LEARNING_RESOURCES,
  PROFILE_LINKS,
  PROJECTS,
  PROOF_METRICS,
  RECOGNITIONS,
  RESEARCH_INTERESTS,
  RESEARCH_PUBLICATIONS,
  SKILL_GROUPS,
  WRITING_ITEMS,
} from '../src/data/portfolioData.ts';
import { GeminiApiError, withExponentialBackoff } from './gemini.ts';

export type ChatPersonaId = 'guide' | 'recruiter' | 'quick';
export type VoiceName = 'Kore' | 'Zephyr' | 'Fenrir' | 'Puck' | 'Charon';
export type SupportedLanguage = 'en' | 'en-US' | 'es' | 'de' | 'fr' | 'ja' | 'pt';

const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  en: 'British English (UK)',
  'en-US': 'American English (US)',
  es: 'Spanish (Español)',
  de: 'German (Deutsch)',
  fr: 'French (Français)',
  ja: 'Japanese (日本語)',
  pt: 'Portuguese (Português)',
};

export function sanitizeLanguage(raw: unknown): SupportedLanguage {
  if (
    raw === 'en' ||
    raw === 'en-US' ||
    raw === 'es' ||
    raw === 'de' ||
    raw === 'fr' ||
    raw === 'ja' ||
    raw === 'pt'
  ) {
    return raw;
  }
  return 'en';
}

function languageDirective(lang: SupportedLanguage): string {
  if (lang === 'en') return '';
  if (lang === 'en-US') {
    return `\nRESPONSE LANGUAGE REQUIREMENT: Reply in natural American English (US spelling and phrasing, e.g. program, neighborhood, optimize, analyze, resume). Keep proper nouns (project titles like MedCareSnap, RoboXR AI, FraudLens, conference venues like ESA XR 2026 / AIVR 2026, and institution names like IIT Jodhpur / DAAD) accurate.`;
  }
  return `\nRESPONSE LANGUAGE REQUIREMENT: Reply naturally and fluently in ${LANGUAGE_LABELS[lang]}. Keep proper nouns (project titles like MedCareSnap, RoboXR AI, FraudLens, conference venues like ESA XR 2026 / AIVR 2026, and institution names like IIT Jodhpur / DAAD) accurate.`;
}

export interface PersonaConfig {
  id: ChatPersonaId;
  model: 'gemini-4-hydrogen' | 'gemini-3.1-flash-lite';
  systemInstruction: string;
}

export interface GroundedCitation {
  kind: 'project' | 'paper' | 'focus' | 'cv';
  id: string;
  label: string;
  detail: string;
  focusIndex?: number;
}

export interface RetrievalResult {
  citations: GroundedCitation[];
  focusedSnippet: string;
}

export interface RoleFitResult {
  fitScore: number;
  headline: string;
  summary: string;
  matchedProjectIds: string[];
  matchedPaperIds: string[];
  strengths: string[];
  gapsOrNotes: string;
  recommendedOutreach: string;
}

const VALID_VOICES = new Set<VoiceName>(['Kore', 'Zephyr', 'Fenrir', 'Puck', 'Charon']);
const ALLOWED_AUDIO_MIMES = new Set([
  'audio/webm',
  'audio/mp4',
  'audio/ogg',
  'audio/wav',
  'audio/mpeg',
  'audio/mp3',
  'audio/x-m4a',
]);

export function sanitizeVoiceName(raw: unknown): VoiceName {
  if (typeof raw === 'string' && VALID_VOICES.has(raw as VoiceName)) {
    return raw as VoiceName;
  }
  return 'Kore';
}

export function sanitizeAudioMime(raw: unknown): string {
  if (typeof raw !== 'string') return 'audio/webm';
  const base = raw.split(';')[0].trim().toLowerCase();
  if (ALLOWED_AUDIO_MIMES.has(base)) {
    return base === 'audio/x-m4a' ? 'audio/mp4' : base;
  }
  return 'audio/webm';
}

/**
 * Dynamically serializes the live TypeScript website data structure from
 * src/data/portfolioData.ts so the AI pipeline is always 100% synced with the site.
 */
function buildStructuredPortfolioCatalog(): string {
  const emailEntry = PROFILE_LINKS.find((l) => l.isEmail);
  const contactEmail = emailEntry?.detail ?? 'ak6358404@gmail.com';

  const metricsText = PROOF_METRICS.map(
    (m) => `- ${m.value} (${m.label}): ${m.detail}`
  ).join('\n');

  const focusText = FOCUS_AREAS.map(
    (f, idx) => `${idx + 1}. ${f.label} — ${f.detail}`
  ).join('\n');

  const interestsText = RESEARCH_INTERESTS.map(
    (r) => `- ${r.label}: ${r.detail}`
  ).join('\n');

  const projectsText = PROJECTS.map(
    (p, idx) =>
      `${idx + 1}. [${p.id}] ${p.title} (${p.year} | ${p.categoryLabel}${p.venue ? ` | ${p.venue}` : ''})\n` +
      `   Subtitle: ${p.subtitle}\n` +
      `   Summary: ${p.summary}\n` +
      `   Contribution: ${p.contribution}\n` +
      `   Outcome: ${p.outcome}\n` +
      `   Stack: ${p.stack.join(', ')}\n` +
      `   Links: ${p.links.map((l) => `${l.label}: ${l.href}`).join(' | ')}`
  ).join('\n');

  const researchText = RESEARCH_PUBLICATIONS.map(
    (r, idx) =>
      `${idx + 1}. [${r.id}] ${r.venue} (${r.location} | ${r.status}${r.dateNote ? ` · ${r.dateNote}` : ''} | ${r.kind})\n` +
      `   Title: ${r.title}\n` +
      `   Summary: ${r.summary}\n` +
      `   Link: ${r.href}`
  ).join('\n');

  const experienceText = EXPERIENCES.map(
    (e) =>
      `- ${e.period}: ${e.role} at ${e.organization} (${e.location})\n` +
      `  Platform/Stack: ${e.platform ?? 'N/A'}\n` +
      `  Summary: ${e.summary}`
  ).join('\n');

  const skillsText = SKILL_GROUPS.map(
    (g) => `- ${g.category} (${g.subtitle}): ${g.items.join(', ')}`
  ).join('\n');

  const recognitionsText = RECOGNITIONS.map(
    (r) =>
      `- [${r.groupLabel}] ${r.title} (${r.metaLeft}) — Outcome: ${r.outcome}${
        r.description ? ` | ${r.description}` : ''
      }`
  ).join('\n');

  const writingText = [...WRITING_ITEMS, ...LEARNING_RESOURCES]
    .map((w) => `- ${w.label}: ${w.title} (${w.href})`)
    .join('\n');

  const profilesText = PROFILE_LINKS.map(
    (p) => `- ${p.label}: ${p.detail} (${p.href})`
  ).join('\n');

  return `
PORTFOLIO OWNER: Ashish Kumar — Software Engineer & Independent Researcher
Direct Email: ${contactEmail}
CV PDF: ${CV_PDF_URL}
10-Country International Footprint: ${GLOBAL_COUNTRIES.join(', ')}

KEY PROOF METRICS:
${metricsText}

6 CORE FOCUS AREAS:
${focusText}

RESEARCH INTERESTS:
${interestsText}

SELECTED PROJECTS (${PROJECTS.length}):
${projectsText}

RESEARCH PUBLICATIONS & LIVE DEMOS (${RESEARCH_PUBLICATIONS.length}):
${researchText}

EXPERIENCE (${EXPERIENCES.length}):
${experienceText}

TECHNICAL SKILLS MATRIX:
${skillsText}

FELLOWSHIPS, GLOBAL SCHOOLS, AWARDS & EDUCATION (${RECOGNITIONS.length}):
${recognitionsText}

WRITING & LEARNING RESOURCES:
${writingText}

ONLINE PROFILES:
${profilesText}
`.trim();
}

const LIVE_CATALOG_TEXT = buildStructuredPortfolioCatalog();

export function getCatalogStats() {
  return {
    projects: PROJECTS.length,
    papers: RESEARCH_PUBLICATIONS.length,
    experiences: EXPERIENCES.length,
    recognitions: RECOGNITIONS.length,
    focusAreas: FOCUS_AREAS.length,
    skillGroups: SKILL_GROUPS.length,
  };
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 2);
}

const STOPWORDS = new Set([
  'the',
  'and',
  'for',
  'with',
  'about',
  'that',
  'this',
  'from',
  'what',
  'how',
  'does',
  'tell',
  'explain',
  'show',
  'give',
  'ashish',
  'kumar',
  'his',
  'her',
  'your',
  'are',
  'was',
  'can',
  'into',
  'role',
  'work',
  'please',
  'more',
]);

/**
 * Deterministic Stage-1 Retriever directly over src/data/portfolioData.ts.
 * Computes grounded citations and interactive website actions with zero external latency.
 */
export function retrieveGroundedContext(query: string): RetrievalResult {
  const tokens = tokenize(query).filter((t) => !STOPWORDS.has(t));
  const citations: GroundedCitation[] = [];
  const snippetParts: string[] = [];

  if (tokens.length === 0) {
    return { citations, focusedSnippet: '' };
  }

  const scoreText = (haystack: string, titleBoostText: string): number => {
    const lowerHay = haystack.toLowerCase();
    const lowerTitle = titleBoostText.toLowerCase();
    let score = 0;
    for (const tok of tokens) {
      if (lowerTitle.includes(tok)) score += 4;
      else if (lowerHay.includes(tok)) score += 1.5;
    }
    return score;
  };

  // Rank Projects
  const scoredProjects = PROJECTS.map((p) => ({
    item: p,
    score: scoreText(
      `${p.title} ${p.subtitle} ${p.categoryLabel} ${p.venue ?? ''} ${p.summary} ${p.contribution} ${p.outcome} ${p.stack.join(' ')}`,
      `${p.title} ${p.id} ${p.categoryLabel}`
    ),
  }))
    .filter((x) => x.score >= 2.5)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);

  for (const { item } of scoredProjects) {
    citations.push({
      kind: 'project',
      id: item.id,
      label: item.title,
      detail: `${item.categoryLabel} · ${item.year}`,
    });
    snippetParts.push(
      `Matched Project [${item.id}]: ${item.title} — ${item.summary} Outcome: ${item.outcome}`
    );
  }

  // Rank Research Publications
  const scoredPapers = RESEARCH_PUBLICATIONS.map((r) => ({
    item: r,
    score: scoreText(
      `${r.venue} ${r.location} ${r.title} ${r.summary} ${r.status}`,
      `${r.venue} ${r.title} ${r.id}`
    ),
  }))
    .filter((x) => x.score >= 2.5)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);

  for (const { item } of scoredPapers) {
    citations.push({
      kind: 'paper',
      id: item.id,
      label: item.venue,
      detail: item.title,
    });
    snippetParts.push(
      `Matched Paper [${item.id}]: ${item.venue} (${item.location}) — ${item.title}. ${item.summary}`
    );
  }

  // Match Focus Area to allow 1-click Hero Anime Reel switching
  const scoredFocus = FOCUS_AREAS.map((f, idx) => ({
    item: f,
    idx,
    score: scoreText(`${f.label} ${f.detail}`, f.label),
  }))
    .filter((x) => x.score >= 3)
    .sort((a, b) => b.score - a.score)[0];

  if (scoredFocus) {
    citations.push({
      kind: 'focus',
      id: `focus-${scoredFocus.idx}`,
      label: `Reel: ${scoredFocus.item.label}`,
      detail: scoredFocus.item.detail,
      focusIndex: scoredFocus.idx,
    });
  }

  // If user asks about CV / resume / hiring / background
  if (/(cv|resume|hire|recruiter|experience|fellowship|education|daad|iit)/.test(query.toLowerCase())) {
    citations.push({
      kind: 'cv',
      id: 'cv-modal',
      label: 'Open Curriculum Vitae',
      detail: 'Full printable & PDF CV',
    });
  }

  return {
    citations: citations.slice(0, 4),
    focusedSnippet: snippetParts.join('\n'),
  };
}

export function getPersonaConfig(
  personaId: ChatPersonaId,
  language: SupportedLanguage = 'en'
): PersonaConfig {
  const emailEntry = PROFILE_LINKS.find((l) => l.isEmail);
  const contactEmail = emailEntry?.detail ?? 'ak6358404@gmail.com';
  const langRule = languageDirective(language);

  if (personaId === 'recruiter') {
    return {
      id: 'recruiter',
      model: 'gemini-4-hydrogen',
      systemInstruction: `You are the Role-Fit & Technical Hiring Advisor on Ashish Kumar's portfolio website.
Your role: Help recruiters, hiring managers, and research lab leads evaluate how Ashish Kumar's verified skills, 2026 papers, shipped prototypes, and international experience align with a specific role, lab, or collaboration.

Guidelines:
- Rely strictly on the live website data below. Never invent skills, employers, or metrics.
- Map Ashish's verified strengths directly to the visitor's requirements with concrete evidence (exact project names, paper venues, tech stacks, rankings).
- Be transparent about any requested skills not present in the portfolio while noting adjacent foundations.
- End with 1 concise sentence suggesting which 1–2 projects or papers to inspect first, and note direct contact (${contactEmail}).
- Keep answers focused, scannable, and around 110–210 words. Never output raw HTML.${langRule}

${LIVE_CATALOG_TEXT}`,
    };
  }

  if (personaId === 'quick') {
    return {
      id: 'quick',
      model: 'gemini-3.1-flash-lite',
      systemInstruction: `You are the Fast Brief & Inquiry Assistant on Ashish Kumar's portfolio website.
Your role: Deliver crisp, punchy answers (3–5 short bullets or 2–4 clean sentences, under 110 words) for rapid TL;DRs, spoken voice responses, or drafting a ready-to-send contact message to Ashish Kumar.

Guidelines:
- Rely strictly on the live website data below; never invent claims.
- When asked to draft a contact or collaboration message to Ashish, write a clean, ready-to-paste message directly addressed to Ashish (without extra preamble) so the visitor can insert it straight into the Contact Form.
- Never output raw HTML.${langRule}

${LIVE_CATALOG_TEXT}`,
    };
  }

  return {
    id: 'guide',
    model: 'gemini-4-hydrogen',
    systemInstruction: `You are the Portfolio & Research Concierge for Ashish Kumar's personal website.
Your role: Help visitors, researchers, collaborators, and engineers explore Ashish Kumar's projects, 2026 research papers, fellowships, and technical craft.

Strict grounding rules:
- Rely ONLY on the live website data below. Never invent publications, metrics, employers, or unreleased results.
- If asked something not listed in the portfolio, say so honestly and invite the visitor to reach Ashish directly at ${contactEmail} or via the Contact Form.
- Keep responses well-structured, concise (typically 90–180 words unless asked for deeper detail), warm, and technically sharp.
- Use short paragraphs or crisp bullet points with bold key terms when helpful. Never output raw HTML.${langRule}

${LIVE_CATALOG_TEXT}`,
  };
}

/**
 * Stage-2 Structured Pipeline: Role-Fit JSON Analyzer grounded strictly in portfolioData.ts IDs.
 */
export async function runRoleFitAnalysis(
  ai: GoogleGenAI,
  roleDescription: string,
  language: SupportedLanguage = 'en'
): Promise<RoleFitResult> {
  const validProjectIds = new Set(PROJECTS.map((p) => p.id));
  const validPaperIds = new Set(RESEARCH_PUBLICATIONS.map((r) => r.id));

  const response = await withExponentialBackoff(() =>
    ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: `Analyze Ashish Kumar's fit for the following role, lab, or collaboration brief:\n\n"""\n${roleDescription}\n"""\n\nReturn structured JSON matching the schema. Only pick matchedProjectIds from [${PROJECTS.map((p) => p.id).join(', ')}] and matchedPaperIds from [${RESEARCH_PUBLICATIONS.map((r) => r.id).join(', ')}].`,
      config: {
        systemInstruction: `You are an objective, accurate technical recruiting analyst evaluating Ashish Kumar strictly from his verified portfolio catalog below. Never fabricate skills or experience. Provide an honest fitScore (0-100), a crisp headline, a 2-sentence executive summary, exact matching project/paper IDs, 3-4 concrete evidence-backed strengths, an honest gapsOrNotes sentence, and a concise ready-to-send outreach note addressed to Ashish Kumar.${languageDirective(language)}\n\n${LIVE_CATALOG_TEXT}`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fitScore: {
              type: Type.INTEGER,
              description: 'Honest alignment score from 0 to 100 based strictly on verified portfolio evidence.',
            },
            headline: {
              type: Type.STRING,
              description: 'Short 5-10 word summary headline of the alignment.',
            },
            summary: {
              type: Type.STRING,
              description: 'Concise 2-sentence synthesis explaining why Ashish aligns with this opportunity.',
            },
            matchedProjectIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Up to 3 valid project IDs from the portfolio catalog.',
            },
            matchedPaperIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Up to 2 valid research paper/demo IDs from the portfolio catalog.',
            },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3 to 4 crisp, evidence-backed bullet points referencing specific projects, papers, or outcomes.',
            },
            gapsOrNotes: {
              type: Type.STRING,
              description: 'One transparent sentence noting any requested requirements not listed in the portfolio or worth discussing in an interview.',
            },
            recommendedOutreach: {
              type: Type.STRING,
              description: 'A polite, ready-to-send 3-4 sentence message addressed to Ashish Kumar that the visitor can insert into the Contact Form.',
            },
          },
          required: [
            'fitScore',
            'headline',
            'summary',
            'matchedProjectIds',
            'matchedPaperIds',
            'strengths',
            'gapsOrNotes',
            'recommendedOutreach',
          ],
        },
      },
    })
  );

  const rawJson = (response.text ?? '').trim();
  if (!rawJson) {
    throw new GeminiApiError('The analyzer returned an empty response. Please try again.', 502);
  }

  let parsed: Partial<RoleFitResult>;
  try {
    parsed = JSON.parse(rawJson) as Partial<RoleFitResult>;
  } catch {
    throw new GeminiApiError('Could not parse structured role-fit analysis. Please retry.', 502);
  }

  const clampedScore = Math.max(
    0,
    Math.min(100, Math.round(Number(parsed.fitScore) || 75))
  );

  return {
    fitScore: clampedScore,
    headline:
      typeof parsed.headline === 'string' && parsed.headline.trim()
        ? parsed.headline.trim()
        : 'Verified Portfolio Alignment Summary',
    summary:
      typeof parsed.summary === 'string' && parsed.summary.trim()
        ? parsed.summary.trim()
        : 'Evaluated directly against Ashish Kumar’s shipped projects, research publications, and technical craft.',
    matchedProjectIds: Array.isArray(parsed.matchedProjectIds)
      ? parsed.matchedProjectIds.filter((id): id is string => typeof id === 'string' && validProjectIds.has(id)).slice(0, 3)
      : [],
    matchedPaperIds: Array.isArray(parsed.matchedPaperIds)
      ? parsed.matchedPaperIds.filter((id): id is string => typeof id === 'string' && validPaperIds.has(id)).slice(0, 2)
      : [],
    strengths: Array.isArray(parsed.strengths)
      ? parsed.strengths.filter((s): s is string => typeof s === 'string' && s.trim().length > 0).slice(0, 5)
      : [],
    gapsOrNotes:
      typeof parsed.gapsOrNotes === 'string' && parsed.gapsOrNotes.trim()
        ? parsed.gapsOrNotes.trim()
        : 'All listed evidence is verified from the portfolio; additional domain specifics can be discussed directly.',
    recommendedOutreach:
      typeof parsed.recommendedOutreach === 'string' && parsed.recommendedOutreach.trim()
        ? parsed.recommendedOutreach.trim()
        : 'Hi Ashish, I reviewed your portfolio and would love to discuss a potential collaboration or role aligned with your XR and AI research.',
  };
}

function cleanTextForSpeech(raw: string): string {
  return raw
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^[-*•]\s+/gm, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 1100);
}

/**
 * Voice Synthesis via gemini-3.8-flash-lite-tts (unary WAV, 24kHz mono 16-bit).
 */
export async function synthesizeSpeech(
  ai: GoogleGenAI,
  rawText: string,
  voiceName: VoiceName = 'Kore'
): Promise<{ audioBase64: string; mimeType: 'audio/wav'; voiceName: VoiceName }> {
  const spokenText = cleanTextForSpeech(rawText);
  if (!spokenText) {
    throw new GeminiApiError('Nothing to speak — please provide text.', 400);
  }

  const response = await withExponentialBackoff(() =>
    ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: spokenText,
              speechMetadata: {
                style: 'Warm, articulate, calm research concierge speaking clearly at a natural pace',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    })
  );

  const audioBase64 =
    response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

  if (!audioBase64) {
    throw new GeminiApiError('Voice synthesis did not return audio. Please try again.', 502);
  }

  return {
    audioBase64,
    mimeType: 'audio/wav',
    voiceName,
  };
}

/**
 * Speech-to-Text Transcription via gemini-3.5-transcribe.
 */
export async function transcribeAudio(
  ai: GoogleGenAI,
  audioBase64: string,
  mimeType: string
): Promise<string> {
  const cleanBase64 = audioBase64.replace(/^data:[^;]+;base64,/, '').trim();
  if (!cleanBase64 || cleanBase64.length < 32) {
    throw new GeminiApiError('Audio recording was empty or too short. Please try speaking again.', 400);
  }

  const response = await withExponentialBackoff(() =>
    ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: sanitizeAudioMime(mimeType),
              data: cleanBase64,
            },
          },
          {
            text: 'Transcribe the spoken question clearly and accurately in plain text without timestamps or extra commentary.',
          },
        ],
      },
    })
  );

  const transcript = (response.text ?? '').trim();
  if (!transcript) {
    throw new GeminiApiError('No speech was detected in the recording. Please try again.', 422);
  }

  return transcript;
}

/**
 * 2-Stage Audio Brief Pipeline:
 * 1) Generates a natural spoken script grounded in portfolioData.ts using gemini-3.1-flash-lite.
 * 2) Synthesizes crisp WAV speech using gemini-3.8-flash-lite-tts.
 */
export async function generateAudioBrief(
  ai: GoogleGenAI,
  target: { kind: 'overview' | 'project' | 'paper'; id?: string },
  voiceName: VoiceName = 'Kore',
  language: SupportedLanguage = 'en'
): Promise<{
  title: string;
  script: string;
  audioBase64: string;
  mimeType: 'audio/wav';
  voiceName: VoiceName;
}> {
  let title = 'Ashish Kumar — Audio Portfolio Brief';
  let prompt =
    'Write a warm, engaging 65-word spoken executive introduction to Ashish Kumar covering his focus areas (XR, AI, Machine Learning, Quantum Computing, Robotics, Space Science), his 2026 international papers (ESA XR and AIVR), Meta XROS Fellowship, and DJX Hackathon 2.0 1st Prize. Output plain spoken sentences only, no markdown or bullet symbols.';

  if (target.kind === 'project' && target.id) {
    const proj = PROJECTS.find((p) => p.id === target.id);
    if (proj) {
      title = `${proj.title} — Audio Brief`;
      prompt = `Write a clear, natural 65-word spoken audio brief explaining Ashish Kumar's project "${proj.title}" (${proj.categoryLabel}, ${proj.year}). Cover what it solves, his contribution, stack (${proj.stack.slice(0, 4).join(', ')}), and verified outcome. Output plain spoken sentences only, no markdown.`;
    }
  } else if (target.kind === 'paper' && target.id) {
    const paper = RESEARCH_PUBLICATIONS.find((r) => r.id === target.id);
    if (paper) {
      title = `${paper.venue} — Audio Brief`;
      prompt = `Write a clear, natural 65-word spoken audio brief explaining Ashish Kumar's ${paper.venue} (${paper.location}) research "${paper.title}". Summarize the core idea and real-world significance accurately. Output plain spoken sentences only, no markdown.`;
    }
  }

  const scriptResponse = await withExponentialBackoff(() =>
    ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
      config: {
        systemInstruction: `You write natural, concise spoken audio scripts strictly grounded in Ashish Kumar's verified portfolio data below. Never invent facts. Plain conversational prose only.${languageDirective(language)}\n\n${LIVE_CATALOG_TEXT}`,
      },
    })
  );

  const script = cleanTextForSpeech(scriptResponse.text ?? '');
  if (!script) {
    throw new GeminiApiError('Could not generate audio brief script. Please try again.', 502);
  }

  const speech = await synthesizeSpeech(ai, script, voiceName);

  return {
    title,
    script,
    ...speech,
  };
}
