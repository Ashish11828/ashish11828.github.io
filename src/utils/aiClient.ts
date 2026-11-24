export type VoiceName = 'Kore' | 'Zephyr' | 'Fenrir' | 'Puck' | 'Charon';

export interface GroundedCitation {
  kind: 'project' | 'paper' | 'focus' | 'cv';
  id: string;
  label: string;
  detail: string;
  focusIndex?: number;
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

export interface AudioBriefResponse {
  title: string;
  script: string;
  audioBase64: string;
  mimeType: 'audio/wav';
  voiceName: VoiceName;
}

const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? '').trim().replace(/\/+$/, '');

export function apiUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${normalized}`;
}

export async function safeJsonFetch<T>(
  path: string,
  options: RequestInit
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(apiUrl(path), options);
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw err;
    }
    throw new Error('Could not reach the AI server. Please check your connection and try again.');
  }

  const contentType = res.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    if (res.status === 404 || res.status === 405) {
      throw new Error(
        'Live AI endpoints require the full-stack server. If viewing a static GitHub Pages mirror, open the live app URL or connect VITE_API_BASE_URL.'
      );
    }
    throw new Error(`Unexpected response from AI server (${res.status}).`);
  }

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    throw new Error('Received an unreadable response from the AI server.');
  }

  if (!res.ok) {
    const serverMsg =
      typeof data === 'object' &&
      data !== null &&
      'error' in data &&
      typeof (data as { error?: unknown }).error === 'string'
        ? (data as { error: string }).error
        : `AI request failed (${res.status}).`;
    throw new Error(serverMsg);
  }

  return data as T;
}

/**
 * Decodes base64 WAV audio returned by gemini-3.8-flash-lite-tts into an HTMLAudioElement
 * with clean Object URL teardown.
 */
export function createWavAudioPlayer(audioBase64: string): {
  audio: HTMLAudioElement;
  cleanup: () => void;
} {
  const binaryStr = window.atob(audioBase64);
  const len = binaryStr.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i += 1) {
    bytes[i] = binaryStr.charCodeAt(i);
  }
  const blob = new Blob([bytes], { type: 'audio/wav' });
  const objectUrl = URL.createObjectURL(blob);
  const audio = new Audio(objectUrl);

  let cleaned = false;
  const cleanup = () => {
    if (cleaned) return;
    cleaned = true;
    try {
      audio.pause();
      audio.src = '';
    } catch {
      // Ignore media teardown errors
    }
    URL.revokeObjectURL(objectUrl);
  };

  return { audio, cleanup };
}

export function pickSupportedRecorderMime(): string | undefined {
  if (typeof MediaRecorder === 'undefined' || !MediaRecorder.isTypeSupported) {
    return undefined;
  }
  const candidates = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/ogg;codecs=opus',
  ];
  return candidates.find((m) => MediaRecorder.isTypeSupported(m));
}

export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      const commaIdx = result.indexOf(',');
      resolve(commaIdx >= 0 ? result.slice(commaIdx + 1) : result);
    };
    reader.onerror = () => reject(new Error('Could not encode audio recording.'));
    reader.readAsDataURL(blob);
  });
}
