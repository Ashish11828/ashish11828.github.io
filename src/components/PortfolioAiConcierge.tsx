import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  AlertCircle,
  ArrowUp,
  ArrowUpRight,
  Briefcase,
  Check,
  Copy,
  FileEdit,
  Headphones,
  Loader2,
  MessageSquare,
  Mic,
  MicOff,
  Play,
  RotateCcw,
  Sparkles,
  Square,
  Volume2,
  VolumeX,
  X,
  Zap,
} from 'lucide-react';
import {
  PROJECTS,
  RESEARCH_PUBLICATIONS,
  type ProjectItem,
} from '../data/portfolioData';
import {
  EXTRA_UI_BY_LANG,
  getLocalizedProject,
  getLocalizedResearch,
} from '../data/localizedContent';
import { TRANSLATIONS, type LanguageCode } from '../data/translations';
import {
  apiUrl,
  blobToBase64,
  createWavAudioPlayer,
  pickSupportedRecorderMime,
  safeJsonFetch,
  type AudioBriefResponse,
  type GroundedCitation,
  type RoleFitResult,
  type VoiceName,
} from '../utils/aiClient';

export type AiPersonaId = 'guide' | 'recruiter' | 'quick';
export type AiTabId = 'chat' | 'rolefit' | 'voicebrief';

export interface AiLaunchRequest {
  prompt?: string;
  persona?: AiPersonaId;
  tab?: AiTabId;
  autoBriefTarget?: { kind: 'overview' | 'project' | 'paper'; id?: string };
  nonce: number;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  persona: AiPersonaId;
  citations?: GroundedCitation[];
  isStreaming?: boolean;
}

interface PortfolioAiConciergeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  launchRequest: AiLaunchRequest | null;
  onInsertIntoContact: (message: string, topic?: string) => void;
  onOpenProject: (project: ProjectItem) => void;
  onSwitchFocusReel: (focusIndex: number) => void;
  onOpenCv: () => void;
  language?: LanguageCode;
}

interface PersonaMeta {
  id: AiPersonaId;
  label: string;
  shortTitle: string;
  description: string;
  placeholder: string;
  starters: string[];
}

const VOICE_OPTIONS: { id: VoiceName; label: string }[] = [
  { id: 'Kore', label: 'Kore · Warm' },
  { id: 'Zephyr', label: 'Zephyr · Bright' },
  { id: 'Fenrir', label: 'Fenrir · Deep' },
];

function renderInlineFormatting(line: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const tokenRegex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let partIdx = 0;

  while ((match = tokenRegex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(line.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      nodes.push(
        <strong
          key={`${keyPrefix}-b-${partIdx}`}
          className="font-semibold text-[#171C28] dark:text-[#F3F6FC]"
        >
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      nodes.push(
        <code
          key={`${keyPrefix}-c-${partIdx}`}
          className="rounded bg-[#EFEAE1] px-1 py-0.5 font-mono text-[11.5px] text-[#171C28] dark:bg-white/10 dark:text-[#FFD2DE]"
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    lastIndex = match.index + token.length;
    partIdx += 1;
  }

  if (lastIndex < line.length) {
    nodes.push(line.slice(lastIndex));
  }
  return nodes;
}

function FormattedMessageBody({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/).filter((b) => b.trim().length > 0);

  return (
    <div className="space-y-2.5 text-[13.5px] leading-[1.62]">
      {blocks.map((block, blockIdx) => {
        const lines = block.split('\n').filter((l) => l.trim().length > 0);
        const isBulletList =
          lines.length > 0 && lines.every((l) => /^(\s*[-*•]|\s*\d+\.)\s+/.test(l));

        if (isBulletList) {
          return (
            <ul
              key={`blk-${blockIdx}`}
              className="list-disc space-y-1.5 pl-4 marker:text-[#C83E4D] dark:marker:text-[#F47292]"
            >
              {lines.map((line, lineIdx) => {
                const cleaned = line.replace(/^(\s*[-*•]|\s*\d+\.)\s+/, '');
                return (
                  <li key={`li-${blockIdx}-${lineIdx}`}>
                    {renderInlineFormatting(cleaned, `${blockIdx}-${lineIdx}`)}
                  </li>
                );
              })}
            </ul>
          );
        }

        return (
          <p key={`blk-${blockIdx}`} className="whitespace-pre-wrap">
            {lines.map((line, lineIdx) => (
              <React.Fragment key={`ln-${blockIdx}-${lineIdx}`}>
                {lineIdx > 0 && <br />}
                {renderInlineFormatting(line, `${blockIdx}-${lineIdx}`)}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}

export const PortfolioAiConcierge: React.FC<PortfolioAiConciergeProps> = ({
  open,
  onOpenChange,
  launchRequest,
  onInsertIntoContact,
  onOpenProject,
  onSwitchFocusReel,
  onOpenCv,
  language = 'en',
}) => {
  const t = TRANSLATIONS[language].aiStudio;
  const contactTopics = TRANSLATIONS[language].contactForm.topics;
  const extra = EXTRA_UI_BY_LANG[language];
  const inputId = useId();
  const roleInputId = useId();

  const [activeTab, setActiveTab] = useState<AiTabId>('chat');
  const [persona, setPersona] = useState<AiPersonaId>('guide');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Voice Input & Output state
  const [voiceName, setVoiceName] = useState<VoiceName>('Kore');
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSec, setRecordingSec] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [loadingSpeechId, setLoadingSpeechId] = useState<string | null>(null);

  // Structured Role-Fit Analyzer state
  const [roleInput, setRoleInput] = useState('');
  const [roleLoading, setRoleLoading] = useState(false);
  const [roleError, setRoleError] = useState<string | null>(null);
  const [roleResult, setRoleResult] = useState<RoleFitResult | null>(null);

  // Two-Stage Audio Brief Studio state
  const [briefTargetKey, setBriefTargetKey] = useState<string>('overview');
  const [briefLoading, setBriefLoading] = useState(false);
  const [briefError, setBriefError] = useState<string | null>(null);
  const [briefResult, setBriefResult] = useState<AudioBriefResponse | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const audioCleanupRef = useRef<(() => void) | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const recorderStreamRef = useRef<MediaStream | null>(null);
  const recorderTimerRef = useRef<number | null>(null);
  const scrollEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const messagesRef = useRef<ChatMessage[]>([]);
  const autoSpeakRef = useRef(autoSpeak);
  const voiceNameRef = useRef(voiceName);
  const languageRef = useRef<LanguageCode>(language);
  const lastLaunchNonceRef = useRef<number>(-1);

  messagesRef.current = messages;
  autoSpeakRef.current = autoSpeak;
  voiceNameRef.current = voiceName;
  languageRef.current = language;

  const localizedPersonas: PersonaMeta[] = [
    {
      id: 'guide',
      label: t.personaGuide,
      shortTitle: t.guideTitle,
      description: t.guideDesc,
      placeholder: t.placeholderChat,
      starters: t.startersGuide,
    },
    {
      id: 'recruiter',
      label: t.personaRecruiter,
      shortTitle: t.recruiterTitle,
      description: t.recruiterDesc,
      placeholder: t.placeholderChat,
      starters: t.startersRecruiter,
    },
    {
      id: 'quick',
      label: t.personaQuick,
      shortTitle: t.quickTitle,
      description: t.quickDesc,
      placeholder: t.placeholderChat,
      starters: t.startersQuick,
    },
  ];
  const currentPersona =
    localizedPersonas.find((p) => p.id === persona) ?? localizedPersonas[0];

  const stopAudioPlayback = useCallback(() => {
    audioCleanupRef.current?.();
    audioCleanupRef.current = null;
    setSpeakingId(null);
    setLoadingSpeechId(null);
  }, []);

  const stopRecordingTracks = useCallback(() => {
    if (recorderTimerRef.current !== null) {
      window.clearInterval(recorderTimerRef.current);
      recorderTimerRef.current = null;
    }
    if (recorderStreamRef.current) {
      recorderStreamRef.current.getTracks().forEach((t) => t.stop());
      recorderStreamRef.current = null;
    }
    recorderRef.current = null;
    setIsRecording(false);
    setRecordingSec(0);
  }, []);

  const playBase64Audio = useCallback(
    async (id: string, audioBase64: string) => {
      stopAudioPlayback();
      const { audio, cleanup } = createWavAudioPlayer(audioBase64);
      audioCleanupRef.current = cleanup;
      setSpeakingId(id);

      audio.onended = () => {
        if (audioCleanupRef.current === cleanup) {
          cleanup();
          audioCleanupRef.current = null;
          setSpeakingId(null);
        }
      };
      audio.onerror = () => {
        if (audioCleanupRef.current === cleanup) {
          cleanup();
          audioCleanupRef.current = null;
          setSpeakingId(null);
        }
      };

      try {
        await audio.play();
      } catch {
        cleanup();
        audioCleanupRef.current = null;
        setSpeakingId(null);
        setErrorMsg('Browser blocked audio playback. Click Listen to play.');
      }
    },
    [stopAudioPlayback]
  );

  const speakText = useCallback(
    async (id: string, text: string) => {
      if (speakingId === id || loadingSpeechId === id) {
        stopAudioPlayback();
        return;
      }

      stopAudioPlayback();
      setLoadingSpeechId(id);

      try {
        const res = await safeJsonFetch<{ audioBase64: string; mimeType: string }>(
          '/api/ai/speak',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text,
              voiceName: voiceNameRef.current,
            }),
          }
        );
        setLoadingSpeechId(null);
        await playBase64Audio(id, res.audioBase64);
      } catch (err) {
        setLoadingSpeechId(null);
        const msg =
          err instanceof Error ? err.message : 'Unable to generate voice audio right now.';
        setErrorMsg(msg);
      }
    },
    [loadingSpeechId, playBase64Audio, speakingId, stopAudioPlayback]
  );

  const scrollToBottom = useCallback(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, []);

  useEffect(() => {
    if (open && activeTab === 'chat') {
      scrollToBottom();
    }
  }, [messages, open, activeTab, scrollToBottom]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOpenChange(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onOpenChange]);

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsStreaming(false);
    setMessages((prev) =>
      prev.map((m) => (m.isStreaming ? { ...m, isStreaming: false } : m))
    );
  }, []);

  const sendPrompt = useCallback(
    async (rawText: string, overridePersona?: AiPersonaId, shouldAutoSpeak?: boolean) => {
      const trimmed = rawText.trim();
      if (!trimmed) return;

      if (abortRef.current) {
        abortRef.current.abort();
        abortRef.current = null;
      }

      const activePersona = overridePersona ?? persona;
      if (overridePersona && overridePersona !== persona) {
        setPersona(overridePersona);
      }

      setActiveTab('chat');
      setErrorMsg(null);
      setInput('');

      const userMsg: ChatMessage = {
        id: `u-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        role: 'user',
        text: trimmed,
        persona: activePersona,
      };
      const assistantId = `m-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const assistantPlaceholder: ChatMessage = {
        id: assistantId,
        role: 'model',
        text: '',
        persona: activePersona,
        isStreaming: true,
      };

      const historyPayload = [
        ...messagesRef.current
          .filter((m) => m.text.trim().length > 0)
          .map((m) => ({ role: m.role, text: m.text })),
        { role: 'user' as const, text: trimmed },
      ];

      setMessages((prev) => [...prev, userMsg, assistantPlaceholder]);
      setIsStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch(apiUrl('/api/ai/chat'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            persona: activePersona,
            language: languageRef.current,
            messages: historyPayload,
          }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const contentType = res.headers.get('content-type') ?? '';
          if (contentType.includes('application/json')) {
            const errJson = (await res.json()) as { error?: string };
            throw new Error(errJson.error || `Request failed (${res.status})`);
          }
          if (res.status === 404 || res.status === 405) {
            throw new Error(
              'Live AI chat requires the Node/Express server. On a static GitHub Pages mirror, open the live app URL or configure VITE_API_BASE_URL.'
            );
          }
          throw new Error(`Request failed (${res.status})`);
        }

        if (!res.body) {
          throw new Error('Streaming response unavailable.');
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let accumulated = '';
        let receivedCitations: GroundedCitation[] = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const events = buffer.split('\n\n');
          buffer = events.pop() ?? '';

          for (const rawEvent of events) {
            const dataLines = rawEvent
              .split('\n')
              .filter((l) => l.startsWith('data:'))
              .map((l) => l.slice(5).trim());

            for (const dataStr of dataLines) {
              if (!dataStr) continue;
              let parsed: {
                delta?: string;
                done?: boolean;
                error?: string;
                citations?: GroundedCitation[];
              };
              try {
                parsed = JSON.parse(dataStr) as {
                  delta?: string;
                  done?: boolean;
                  error?: string;
                  citations?: GroundedCitation[];
                };
              } catch {
                continue;
              }

              if (parsed.error) {
                throw new Error(parsed.error);
              }

              if (Array.isArray(parsed.citations)) {
                receivedCitations = parsed.citations;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId ? { ...m, citations: receivedCitations } : m
                  )
                );
              }

              if (parsed.delta) {
                accumulated += parsed.delta;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId ? { ...m, text: accumulated } : m
                  )
                );
              }
            }
          }
        }

        const finalText =
          accumulated.trim() ||
          'I could not generate a reply for that prompt. Please try rephrasing.';

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  text: finalText,
                  citations: receivedCitations,
                  isStreaming: false,
                }
              : m
          )
        );

        if ((shouldAutoSpeak ?? autoSpeakRef.current) && accumulated.trim()) {
          void speakText(assistantId, finalText);
        }
      } catch (err) {
        if (controller.signal.aborted) {
          setMessages((prev) =>
            prev
              .map((m) => (m.id === assistantId ? { ...m, isStreaming: false } : m))
              .filter((m) => m.id !== assistantId || m.text.trim().length > 0)
          );
          return;
        }

        const msg =
          err instanceof Error
            ? err.message
            : 'Unable to reach the AI assistant right now.';
        setErrorMsg(msg);
        setMessages((prev) => prev.filter((m) => m.id !== assistantId));
      } finally {
        if (abortRef.current === controller) {
          abortRef.current = null;
        }
        setIsStreaming(false);
      }
    },
    [persona, speakText]
  );

  // Voice Recording -> gemini-3.5-transcribe -> Automatic Multi-Turn Chat Send
  const toggleVoiceRecording = async () => {
    if (isRecording) {
      if (recorderRef.current && recorderRef.current.state !== 'inactive') {
        recorderRef.current.stop();
      } else {
        stopRecordingTracks();
      }
      return;
    }

    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setErrorMsg('Microphone recording is not supported in this browser.');
      return;
    }

    setErrorMsg(null);
    stopAudioPlayback();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recorderStreamRef.current = stream;

      const mimeType = pickSupportedRecorderMime();
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
      recorderRef.current = recorder;

      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (ev) => {
        if (ev.data && ev.data.size > 0) {
          chunks.push(ev.data);
        }
      };

      recorder.onstop = async () => {
        const finalMime = recorder.mimeType || mimeType || 'audio/webm';
        stopRecordingTracks();

        if (chunks.length === 0) return;
        const blob = new Blob(chunks, { type: finalMime });
        if (blob.size < 400) {
          setErrorMsg('Voice clip was too short. Hold or speak for at least a second.');
          return;
        }

        setIsTranscribing(true);
        try {
          const audioBase64 = await blobToBase64(blob);
          const data = await safeJsonFetch<{ transcript: string }>('/api/ai/transcribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ audioBase64, mimeType: finalMime }),
          });
          setIsTranscribing(false);
          if (data.transcript?.trim()) {
            void sendPrompt(data.transcript.trim(), persona, true);
          }
        } catch (err) {
          setIsTranscribing(false);
          setErrorMsg(
            err instanceof Error ? err.message : 'Could not transcribe voice recording.'
          );
        }
      };

      recorder.start();
      setIsRecording(true);
      setRecordingSec(0);

      recorderTimerRef.current = window.setInterval(() => {
        setRecordingSec((prev) => {
          if (prev >= 24) {
            if (recorder.state !== 'inactive') recorder.stop();
            return 25;
          }
          return prev + 1;
        });
      }, 1000);
    } catch {
      stopRecordingTracks();
      setErrorMsg('Microphone access was denied. Please allow microphone access to use voice.');
    }
  };

  // Structured Role-Fit Pipeline handler
  const handleRunRoleFit = async (customRole?: string) => {
    const query = (customRole ?? roleInput).trim();
    if (query.length < 6) {
      setRoleError('Please enter a role title or brief description (at least 6 characters).');
      return;
    }
    if (customRole) setRoleInput(customRole);
    setRoleError(null);
    setRoleLoading(true);

    try {
      const result = await safeJsonFetch<RoleFitResult>('/api/ai/role-fit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roleDescription: query,
          language: languageRef.current,
        }),
      });
      setRoleResult(result);
    } catch (err) {
      setRoleError(err instanceof Error ? err.message : 'Role-fit analysis failed.');
    } finally {
      setRoleLoading(false);
    }
  };

  // 2-Stage Audio Brief Pipeline handler
  const handleGenerateBrief = useCallback(
    async (targetOverride?: { kind: 'overview' | 'project' | 'paper'; id?: string }) => {
      let target = targetOverride;
      if (!target) {
        if (briefTargetKey === 'overview') {
          target = { kind: 'overview' };
        } else if (briefTargetKey.startsWith('project:')) {
          target = { kind: 'project', id: briefTargetKey.slice('project:'.length) };
        } else if (briefTargetKey.startsWith('paper:')) {
          target = { kind: 'paper', id: briefTargetKey.slice('paper:'.length) };
        } else {
          target = { kind: 'overview' };
        }
      }

      stopAudioPlayback();
      setBriefError(null);
      setBriefLoading(true);

      try {
        const res = await safeJsonFetch<AudioBriefResponse>('/api/ai/audio-brief', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            kind: target.kind,
            id: target.id,
            voiceName: voiceNameRef.current,
            language: languageRef.current,
          }),
        });
        setBriefResult(res);
        setBriefLoading(false);
        await playBase64Audio('audio-brief-main', res.audioBase64);
      } catch (err) {
        setBriefLoading(false);
        setBriefError(
          err instanceof Error ? err.message : 'Could not generate audio briefing.'
        );
      }
    },
    [briefTargetKey, playBase64Audio, stopAudioPlayback]
  );

  // Handle contextual launches from Hero, Research cards, or Project Lightbox
  useEffect(() => {
    if (!launchRequest) return;
    if (launchRequest.nonce === lastLaunchNonceRef.current) return;
    lastLaunchNonceRef.current = launchRequest.nonce;

    onOpenChange(true);

    if (launchRequest.tab === 'voicebrief') {
      setActiveTab('voicebrief');
      if (launchRequest.autoBriefTarget) {
        const key =
          launchRequest.autoBriefTarget.kind === 'overview'
            ? 'overview'
            : `${launchRequest.autoBriefTarget.kind}:${launchRequest.autoBriefTarget.id ?? ''}`;
        setBriefTargetKey(key);
        void handleGenerateBrief(launchRequest.autoBriefTarget);
      }
      return;
    }

    if (launchRequest.tab === 'rolefit') {
      setActiveTab('rolefit');
      return;
    }

    if (launchRequest.prompt) {
      void sendPrompt(launchRequest.prompt, launchRequest.persona ?? 'guide');
    }
  }, [handleGenerateBrief, launchRequest, onOpenChange, sendPrompt]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      stopAudioPlayback();
      stopRecordingTracks();
    };
  }, [stopAudioPlayback, stopRecordingTracks]);

  const handleCitationAction = (citation: GroundedCitation) => {
    if (citation.kind === 'project') {
      const found = PROJECTS.find((p) => p.id === citation.id);
      if (found) {
        onOpenProject(found);
      }
    } else if (citation.kind === 'paper') {
      document.getElementById('research')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (citation.kind === 'focus' && typeof citation.focusIndex === 'number') {
      onSwitchFocusReel(citation.focusIndex);
      document.getElementById('top')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (citation.kind === 'cv') {
      onOpenCv();
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isStreaming || isTranscribing || !input.trim()) return;
    void sendPrompt(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isStreaming && !isTranscribing && input.trim()) {
        void sendPrompt(input);
      }
    }
  };

  const handleCopyReply = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId((curr) => (curr === id ? null : curr)), 2000);
    } catch {
      // Ignore clipboard failures
    }
  };

  const handleClearChat = () => {
    stopStreaming();
    stopAudioPlayback();
    setMessages([]);
    setErrorMsg(null);
    inputRef.current?.focus();
  };

  const handleRetryLast = () => {
    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    if (!lastUser) return;
    setMessages((prev) => {
      const idx = prev.findIndex((m) => m.id === lastUser.id);
      return idx >= 0 ? prev.slice(0, idx) : prev;
    });
    void sendPrompt(lastUser.text, lastUser.persona);
  };

  return (
    <div className="no-print">
      {/* Floating Concierge Launcher */}
      <AnimatePresence>
        {!open && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.9, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 12 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => onOpenChange(true)}
            aria-label="Open Ashish AI & Voice Concierge"
            className="fixed right-5 bottom-5 z-40 inline-flex items-center gap-2.5 rounded-2xl border border-[#DFD6C9]/90 bg-[#171C28]/95 px-4 py-3 text-xs font-semibold text-[#FCFBF8] shadow-xl shadow-black/25 backdrop-blur-md transition-all duration-150 hover:-translate-y-0.5 hover:border-[#C83E4D] hover:bg-[#C83E4D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C83E4D] dark:border-white/18 dark:bg-[#131B2E]/92 dark:text-[#F3F6FC] dark:hover:border-[#F47292] dark:hover:bg-[#E14B67] sm:right-6 sm:bottom-6"
          >
            <Sparkles className="h-4 w-4 text-[#FFB5C8]" aria-hidden="true" />
            <span>{t.launcher}</span>
            <span aria-hidden="true" className="text-white/35">
              ·
            </span>
            <Mic className="h-3.5 w-3.5 text-[#FFB5C8]" aria-hidden="true" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Multi-Modal AI & Voice Concierge Drawer */}
      <AnimatePresence>
        {open && (
          <motion.aside
            role="dialog"
            aria-modal="false"
            aria-label={t.title}
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-3 bottom-3 left-3 z-50 flex h-[min(82vh,680px)] flex-col overflow-hidden rounded-2xl border border-[#DFD6C9] bg-[#FCFBF8]/96 text-[#171C28] shadow-2xl shadow-black/25 backdrop-blur-xl sm:right-6 sm:bottom-6 sm:left-auto sm:w-[460px] dark:border-white/16 dark:bg-[#0B1121]/95 dark:text-[#EEF1F7] dark:shadow-black/60"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 border-b border-[#E6DFD5] bg-[#FFFFFF]/82 px-4 py-3 dark:border-white/10 dark:bg-[#10182C]/88">
              <div className="flex min-w-0 items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#C83E4D]/12 text-[#C83E4D] dark:bg-[#F47292]/18 dark:text-[#FFA3BC]">
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <h2 className="truncate font-display text-sm font-bold tracking-tight text-[#171C28] dark:text-[#F3F6FC]">
                    {t.title}
                  </h2>
                  <p className="truncate text-[11px] text-[#525C6E] dark:text-[#9CA8BE]">
                    {t.syncedPrefix} {PROJECTS.length} {t.projectsWord} · {RESEARCH_PUBLICATIONS.length} {t.papersWord}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    const next = !autoSpeak;
                    setAutoSpeak(next);
                    if (!next) stopAudioPlayback();
                  }}
                  title={autoSpeak ? 'Auto-speak replies on' : 'Auto-speak replies off'}
                  aria-label={autoSpeak ? 'Disable auto-speak replies' : 'Enable auto-speak replies'}
                  aria-pressed={autoSpeak}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C83E4D] ${
                    autoSpeak
                      ? 'bg-[#C83E4D]/14 text-[#C83E4D] dark:bg-[#F47292]/20 dark:text-[#FFA3BC]'
                      : 'text-[#525C6E] hover:bg-[#EFEAE1] hover:text-[#171C28] dark:text-[#9CA8BE] dark:hover:bg-white/10 dark:hover:text-[#F3F6FC]'
                  }`}
                >
                  {autoSpeak ? (
                    <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
                  ) : (
                    <VolumeX className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                </button>
                {activeTab === 'chat' && messages.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearChat}
                    title="Start new conversation"
                    aria-label="Start new conversation"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-[#525C6E] transition-colors hover:bg-[#EFEAE1] hover:text-[#171C28] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C83E4D] dark:text-[#9CA8BE] dark:hover:bg-white/10 dark:hover:text-[#F3F6FC]"
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    stopAudioPlayback();
                    onOpenChange(false);
                  }}
                  aria-label="Close AI Studio"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[#525C6E] transition-colors hover:bg-[#EFEAE1] hover:text-[#171C28] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C83E4D] dark:text-[#9CA8BE] dark:hover:bg-white/10 dark:hover:text-[#F3F6FC]"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Primary AI Capability Mode Switcher */}
            <div
              role="tablist"
              aria-label="AI capability workspace"
              className="grid grid-cols-3 gap-1 border-b border-[#E6DFD5]/80 bg-[#F5F1EA]/80 p-1.5 dark:border-white/10 dark:bg-[#0D1426]/88"
            >
              {[
                { id: 'chat' as const, label: t.tabChat, icon: MessageSquare },
                { id: 'rolefit' as const, label: t.tabRoleFit, icon: Briefcase },
                { id: 'voicebrief' as const, label: t.tabAudioBrief, icon: Headphones },
              ].map((tab) => {
                const active = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-[11.5px] font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C83E4D] whitespace-nowrap ${
                      active
                        ? 'bg-[#FFFFFF] text-[#C83E4D] shadow-xs dark:bg-[#1C2640] dark:text-[#FFA3BC]'
                        : 'text-[#525C6E] hover:text-[#171C28] dark:text-[#9CA8BE] dark:hover:text-[#EEF1F7]'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB 1: MULTI-TURN VOICE + TEXT CHAT */}
            {activeTab === 'chat' && (
              <>
                {/* Persona sub-bar */}
                <div className="flex items-center justify-between gap-2 border-b border-[#EFEAE1] bg-[#FCFBF8]/80 px-3.5 py-2 dark:border-white/8 dark:bg-[#0C1222]/80">
                  <div className="flex items-center gap-1" role="radiogroup" aria-label="Chat persona">
                    {localizedPersonas.map((item) => {
                      const active = persona === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          onClick={() => setPersona(item.id)}
                          className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium transition-colors whitespace-nowrap ${
                            active
                              ? 'bg-[#C83E4D] text-white dark:bg-[#E14B67]'
                              : 'text-[#525C6E] hover:bg-[#EFEAE1] hover:text-[#171C28] dark:text-[#9CA8BE] dark:hover:bg-white/10 dark:hover:text-[#EEF1F7]'
                          }`}
                        >
                          {item.id === 'quick' && <Zap className="h-2.5 w-2.5" aria-hidden="true" />}
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Scrollable Thread */}
                <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
                  {messages.length === 0 ? (
                    <div className="space-y-4">
                      <div className="rounded-xl border border-[#E6DFD5] bg-[#FFFFFF]/85 p-4 dark:border-white/10 dark:bg-[#121A30]/80">
                        <p className="text-xs font-semibold text-[#C83E4D] dark:text-[#F47292]">
                          {currentPersona.shortTitle}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-[#4C566A] dark:text-[#B5C0D4]">
                          {currentPersona.description}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-[11px] font-semibold text-[#697386] dark:text-[#8E9BB2]">
                          {t.tryAsking}
                        </p>
                        {currentPersona.starters.map((prompt) => (
                          <button
                            key={prompt}
                            type="button"
                            onClick={() => void sendPrompt(prompt)}
                            className="block w-full rounded-xl border border-[#E2DACD] bg-[#FFFFFF]/85 px-3.5 py-2.5 text-left text-xs font-medium text-[#2F3748] transition-all duration-150 hover:border-[#C83E4D]/60 hover:bg-[#FFFFFF] hover:text-[#C83E4D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C83E4D] dark:border-white/10 dark:bg-[#121A30]/75 dark:text-[#DCE3F0] dark:hover:border-[#F47292]/60 dark:hover:bg-[#18233E] dark:hover:text-[#FFA3BC]"
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isUser = msg.role === 'user';
                      const isSpeaking = speakingId === msg.id;
                      const isLoadingAudio = loadingSpeechId === msg.id;

                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                        >
                          <div
                            className={`max-w-[92%] rounded-2xl px-3.5 py-2.5 ${
                              isUser
                                ? 'bg-[#C83E4D] text-white dark:bg-[#E14B67]'
                                : 'border border-[#E6DFD5] bg-[#FFFFFF]/92 text-[#2F3748] dark:border-white/12 dark:bg-[#121A30]/90 dark:text-[#DCE3F0]'
                            }`}
                          >
                            {isUser ? (
                              <p className="whitespace-pre-wrap text-[13.5px] leading-relaxed">
                                {msg.text}
                              </p>
                            ) : msg.text ? (
                              <FormattedMessageBody text={msg.text} />
                            ) : (
                              <span className="inline-flex items-center gap-2 text-xs text-[#525C6E] dark:text-[#9CA8BE]">
                                <Loader2
                                  className="h-3.5 w-3.5 animate-spin text-[#C83E4D] dark:text-[#F47292]"
                                  aria-hidden="true"
                                />
                                <span>{t.searchingData}</span>
                              </span>
                            )}
                          </div>

                          {/* Interactive Website Citations hydrated from portfolioData.ts */}
                          {!isUser && !msg.isStreaming && msg.citations && msg.citations.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1.5 pl-1">
                              {msg.citations.map((cit) => (
                                <button
                                  key={`${msg.id}-${cit.kind}-${cit.id}`}
                                  type="button"
                                  onClick={() => handleCitationAction(cit)}
                                  title={cit.detail}
                                  className="inline-flex items-center gap-1 rounded-md border border-[#E2DACD] bg-[#FFFFFF]/90 px-2 py-1 text-[11px] font-medium text-[#2F3748] transition-colors hover:border-[#C83E4D] hover:text-[#C83E4D] dark:border-white/14 dark:bg-[#141D35]/90 dark:text-[#DCE3F0] dark:hover:border-[#F47292] dark:hover:text-[#FFA3BC]"
                                >
                                  <span className="max-w-[160px] truncate">{cit.label}</span>
                                  <ArrowUpRight className="h-3 w-3 shrink-0" aria-hidden="true" />
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Action row: Listen, Copy, Use in Contact Form */}
                          {!isUser && !msg.isStreaming && msg.text && (
                            <div className="mt-1.5 flex flex-wrap items-center gap-2 pl-1">
                              <button
                                type="button"
                                onClick={() => void speakText(msg.id, msg.text)}
                                className={`inline-flex items-center gap-1 text-[11px] font-medium transition-colors ${
                                  isSpeaking
                                    ? 'text-[#C83E4D] dark:text-[#FFA3BC]'
                                    : 'text-[#697386] hover:text-[#171C28] dark:text-[#8E9BB2] dark:hover:text-[#EEF1F7]'
                                }`}
                              >
                                {isLoadingAudio ? (
                                  <>
                                    <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
                                    <span>{t.voicing}</span>
                                  </>
                                ) : isSpeaking ? (
                                  <>
                                    <Square className="h-2.5 w-2.5 fill-current" aria-hidden="true" />
                                    <span>{t.stopVoice}</span>
                                  </>
                                ) : (
                                  <>
                                    <Volume2 className="h-3 w-3" aria-hidden="true" />
                                    <span>{t.listen}</span>
                                  </>
                                )}
                              </button>

                              <span aria-hidden="true" className="text-[11px] text-[#B5AEA4] dark:text-white/20">
                                ·
                              </span>

                              <button
                                type="button"
                                onClick={() => void handleCopyReply(msg.id, msg.text)}
                                className="inline-flex items-center gap-1 text-[11px] font-medium text-[#697386] transition-colors hover:text-[#171C28] dark:text-[#8E9BB2] dark:hover:text-[#EEF1F7]"
                              >
                                {copiedId === msg.id ? (
                                  <>
                                    <Check className="h-3 w-3 text-[#2E8B6E] dark:text-[#57B894]" aria-hidden="true" />
                                    <span>{t.copied}</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3 w-3" aria-hidden="true" />
                                    <span>{t.copy}</span>
                                  </>
                                )}
                              </button>

                              <span aria-hidden="true" className="text-[11px] text-[#B5AEA4] dark:text-white/20">
                                ·
                              </span>

                              <button
                                type="button"
                                onClick={() => {
                                  const inferredTopic =
                                    msg.persona === 'recruiter'
                                      ? contactTopics[1]
                                      : contactTopics[0];
                                  onInsertIntoContact(msg.text, inferredTopic);
                                  onOpenChange(false);
                                }}
                                className="inline-flex items-center gap-1 text-[11px] font-medium text-[#C83E4D] transition-colors hover:underline dark:text-[#FFA3BC]"
                              >
                                <FileEdit className="h-3 w-3" aria-hidden="true" />
                                <span>{t.useInContact}</span>
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}

                  {errorMsg && (
                    <div
                      role="alert"
                      className="rounded-xl border border-[#C83E4D]/40 bg-[#C83E4D]/10 p-3 text-xs text-[#8E2230] dark:border-[#F47292]/40 dark:bg-[#F47292]/12 dark:text-[#FFD2DE]"
                    >
                      <div className="flex items-start gap-2">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                        <div className="space-y-1.5">
                          <p className="leading-relaxed">{errorMsg}</p>
                          {messages.some((m) => m.role === 'user') && (
                            <button
                              type="button"
                              onClick={handleRetryLast}
                              className="font-semibold underline underline-offset-2 hover:opacity-85"
                            >
                              {t.retry}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={scrollEndRef} />
                </div>

                {/* Voice + Text Composer */}
                <form
                  onSubmit={handleSubmit}
                  className="border-t border-[#E6DFD5] bg-[#FFFFFF]/88 p-3 dark:border-white/10 dark:bg-[#0F1629]/92"
                >
                  <label htmlFor={inputId} className="sr-only">
                    {t.launcher}
                  </label>
                  <div className="flex items-end gap-2 rounded-xl border border-[#DFD6C9] bg-[#FCFBF8] px-2.5 py-2 focus-within:border-[#C83E4D] focus-within:ring-2 focus-within:ring-[#C83E4D]/20 dark:border-white/14 dark:bg-[#0A1020] dark:focus-within:border-[#F47292] dark:focus-within:ring-[#F47292]/25">
                    <button
                      type="button"
                      disabled={isStreaming || isTranscribing}
                      onClick={() => void toggleVoiceRecording()}
                      aria-label={isRecording ? 'Stop voice recording' : 'Record voice question'}
                      aria-pressed={isRecording}
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C83E4D] disabled:opacity-45 ${
                        isRecording
                          ? 'bg-[#C83E4D] text-white dark:bg-[#E14B67]'
                          : 'bg-[#F0EAE0] text-[#2F3748] hover:bg-[#E5DCCF] hover:text-[#C83E4D] dark:bg-white/10 dark:text-[#DCE3F0] dark:hover:bg-white/16 dark:hover:text-[#FFA3BC]'
                      }`}
                    >
                      {isTranscribing ? (
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      ) : isRecording ? (
                        <MicOff className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <Mic className="h-4 w-4" aria-hidden="true" />
                      )}
                    </button>

                    <textarea
                      ref={inputRef}
                      id={inputId}
                      rows={1}
                      maxLength={2500}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={
                        isRecording
                          ? `${t.listeningHint} (${recordingSec}s)...`
                          : isTranscribing
                            ? t.transcribingHint
                            : currentPersona.placeholder
                      }
                      disabled={isRecording || isTranscribing}
                      className="max-h-28 min-h-[24px] flex-1 resize-none bg-transparent text-xs leading-relaxed text-[#171C28] placeholder:text-[#788296] focus:outline-none disabled:opacity-75 dark:text-[#F3F6FC] dark:placeholder:text-[#7F8CA6]"
                    />

                    {isStreaming ? (
                      <button
                        type="button"
                        onClick={stopStreaming}
                        aria-label="Stop generating"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#171C28] text-white transition-colors hover:bg-[#C83E4D] dark:bg-white/15 dark:hover:bg-[#E14B67]"
                      >
                        <Square className="h-3 w-3 fill-current" aria-hidden="true" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={!input.trim() || isRecording || isTranscribing}
                        aria-label="Send message"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#C83E4D] text-white transition-colors hover:bg-[#B23342] disabled:cursor-not-allowed disabled:opacity-45 dark:bg-[#E14B67] dark:hover:bg-[#CC3D58]"
                      >
                        <ArrowUp className="h-4 w-4" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                  <p className="mt-1.5 flex items-center justify-between px-0.5 text-[10.5px] text-[#697386] dark:text-[#8E9BB2]">
                    <span>{t.footerHint}</span>
                    <span>{t.enterToSend}</span>
                  </p>
                </form>
              </>
            )}

            {/* TAB 2: STRUCTURED ROLE-FIT ANALYZER */}
            {activeTab === 'rolefit' && (
              <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
                <div className="rounded-xl border border-[#E6DFD5] bg-[#FFFFFF]/88 p-4 dark:border-white/10 dark:bg-[#121A30]/82">
                  <p className="text-xs font-semibold text-[#C83E4D] dark:text-[#F47292]">
                    {t.roleTitle}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-[#4C566A] dark:text-[#B5C0D4]">
                    {t.roleDesc}
                  </p>

                  <label htmlFor={roleInputId} className="sr-only">
                    {t.roleTitle}
                  </label>
                  <textarea
                    id={roleInputId}
                    rows={3}
                    maxLength={3000}
                    value={roleInput}
                    onChange={(e) => setRoleInput(e.target.value)}
                    placeholder={t.rolePlaceholder}
                    className="mt-3 w-full resize-none rounded-xl border border-[#DFD6C9] bg-[#FCFBF8] p-3 text-xs leading-relaxed text-[#171C28] placeholder:text-[#788296] focus:border-[#C83E4D] focus:outline-none focus:ring-2 focus:ring-[#C83E4D]/20 dark:border-white/14 dark:bg-[#0A1020] dark:text-[#F3F6FC] dark:placeholder:text-[#7F8CA6] dark:focus:border-[#F47292]"
                  />

                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {extra.rolePresets.map((preset) => (
                      <button
                        key={preset.chip}
                        type="button"
                        onClick={() => void handleRunRoleFit(preset.query)}
                        className="rounded-md border border-[#E2DACD] bg-[#FCFBF8] px-2 py-1 text-left text-[11px] text-[#4C566A] transition-colors hover:border-[#C83E4D] hover:text-[#C83E4D] dark:border-white/12 dark:bg-[#0D1528] dark:text-[#A9B5CA] dark:hover:border-[#F47292] dark:hover:text-[#FFA3BC]"
                      >
                        {preset.chip}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    disabled={roleLoading}
                    onClick={() => void handleRunRoleFit()}
                    className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#C83E4D] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#B23342] disabled:opacity-60 dark:bg-[#E14B67] dark:hover:bg-[#CC3D58]"
                  >
                    {roleLoading ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                        <span>{t.roleRunning}</span>
                      </>
                    ) : (
                      <>
                        <Briefcase className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{t.roleAnalyzeBtn}</span>
                      </>
                    )}
                  </button>
                </div>

                {roleError && (
                  <div
                    role="alert"
                    className="flex items-start gap-2 rounded-xl border border-[#C83E4D]/40 bg-[#C83E4D]/10 p-3 text-xs text-[#8E2230] dark:border-[#F47292]/40 dark:bg-[#F47292]/12 dark:text-[#FFD2DE]"
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>{roleError}</span>
                  </div>
                )}

                {roleResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3.5 rounded-xl border border-[#E6DFD5] bg-[#FFFFFF]/92 p-4 dark:border-white/12 dark:bg-[#121A30]/90"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-display text-sm font-bold text-[#171C28] dark:text-[#F3F6FC]">
                          {roleResult.headline}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-[#4C566A] dark:text-[#B5C0D4]">
                          {roleResult.summary}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="font-display text-2xl font-bold tabular-nums text-[#C83E4D] dark:text-[#FFA3BC]">
                          {roleResult.fitScore}%
                        </p>
                        <p className="text-[10px] font-mono text-[#697386] dark:text-[#8E9BB2]">
                          {t.roleMatchWord}
                        </p>
                      </div>
                    </div>

                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#EFEAE1] dark:bg-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${roleResult.fitScore}%` }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        className="h-full rounded-full bg-gradient-to-r from-[#C83E4D] to-[#F47292]"
                      />
                    </div>

                    {roleResult.strengths.length > 0 && (
                      <div>
                        <p className="text-[11px] font-semibold text-[#171C28] dark:text-[#EEF1F7]">
                          {t.roleVerifiedEvidence}
                        </p>
                        <ul className="mt-1.5 list-disc space-y-1 pl-4 text-xs leading-relaxed text-[#3B4456] marker:text-[#C83E4D] dark:text-[#C5CFE0] dark:marker:text-[#F47292]">
                          {roleResult.strengths.map((s, idx) => (
                            <li key={`str-${idx}`}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {(roleResult.matchedProjectIds.length > 0 ||
                      roleResult.matchedPaperIds.length > 0) && (
                      <div className="space-y-1.5 border-t border-[#EFEAE1] pt-3 dark:border-white/10">
                        <p className="text-[11px] font-semibold text-[#171C28] dark:text-[#EEF1F7]">
                          {t.roleInspectWork}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {roleResult.matchedProjectIds.map((pid) => {
                            const proj = PROJECTS.find((p) => p.id === pid);
                            if (!proj) return null;
                            return (
                              <button
                                key={pid}
                                type="button"
                                onClick={() => onOpenProject(proj)}
                                className="inline-flex items-center gap-1 rounded-md border border-[#E2DACD] bg-[#FCFBF8] px-2.5 py-1 text-[11px] font-medium text-[#171C28] hover:border-[#C83E4D] hover:text-[#C83E4D] dark:border-white/14 dark:bg-[#0D1528] dark:text-[#EEF1F7] dark:hover:border-[#F47292] dark:hover:text-[#FFA3BC]"
                              >
                                <span>{proj.title}</span>
                                <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                              </button>
                            );
                          })}
                          {roleResult.matchedPaperIds.map((rid) => {
                            const paper = RESEARCH_PUBLICATIONS.find((r) => r.id === rid);
                            if (!paper) return null;
                            return (
                              <button
                                key={rid}
                                type="button"
                                onClick={() => {
                                  document
                                    .getElementById('research')
                                    ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }}
                                className="inline-flex items-center gap-1 rounded-md border border-[#E2DACD] bg-[#FCFBF8] px-2.5 py-1 text-[11px] font-medium text-[#171C28] hover:border-[#C83E4D] hover:text-[#C83E4D] dark:border-white/14 dark:bg-[#0D1528] dark:text-[#EEF1F7] dark:hover:border-[#F47292] dark:hover:text-[#FFA3BC]"
                              >
                                <span>{paper.venue}</span>
                                <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <p className="border-t border-[#EFEAE1] pt-2.5 text-[11.5px] leading-relaxed text-[#525C6E] dark:border-white/10 dark:text-[#9CA8BE]">
                      <span className="font-semibold text-[#171C28] dark:text-[#EEF1F7]">
                        {t.roleTransparency}{' '}
                      </span>
                      {roleResult.gapsOrNotes}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() =>
                          void speakText(
                            'rolefit-summary',
                            `${roleResult.headline}. ${roleResult.summary} ${roleResult.strengths.slice(0, 2).join('. ')}`
                          )
                        }
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#D8CFC2] px-3 py-1.5 text-xs font-semibold text-[#171C28] hover:border-[#C83E4D] hover:text-[#C83E4D] dark:border-white/14 dark:text-[#EEF1F7] dark:hover:border-[#F47292] dark:hover:text-[#FFA3BC]"
                      >
                        {loadingSpeechId === 'rolefit-summary' ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                        ) : speakingId === 'rolefit-summary' ? (
                          <Square className="h-3 w-3 fill-current" aria-hidden="true" />
                        ) : (
                          <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
                        )}
                        <span>{speakingId === 'rolefit-summary' ? t.stop : t.listen}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onInsertIntoContact(
                            roleResult.recommendedOutreach,
                            contactTopics[1]
                          );
                          onOpenChange(false);
                        }}
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#171C28] px-3 py-1.5 text-xs font-semibold text-[#FCFBF8] hover:bg-[#C83E4D] dark:bg-[#F3F6FC] dark:text-[#090D18] dark:hover:bg-[#F47292]"
                      >
                        <FileEdit className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{t.roleInsertOutreach}</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* TAB 3: TWO-STAGE AUDIO BRIEFING STUDIO */}
            {activeTab === 'voicebrief' && (
              <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
                <div className="rounded-xl border border-[#E6DFD5] bg-[#FFFFFF]/88 p-4 dark:border-white/10 dark:bg-[#121A30]/82">
                  <p className="text-xs font-semibold text-[#C83E4D] dark:text-[#F47292]">
                    {t.briefTitle}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-[#4C566A] dark:text-[#B5C0D4]">
                    {t.briefDesc}
                  </p>

                  {/* Voice Persona Selector */}
                  <div className="mt-3.5">
                    <span className="block text-[11px] font-semibold text-[#2F3748] dark:text-[#DCE3F0]">
                      {t.narratorVoice}
                    </span>
                    <div className="mt-1.5 grid grid-cols-3 gap-1.5">
                      {VOICE_OPTIONS.map((v) => {
                        const active = voiceName === v.id;
                        return (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => setVoiceName(v.id)}
                            className={`rounded-lg border px-2 py-1.5 text-[11px] font-medium transition-colors ${
                              active
                                ? 'border-[#C83E4D] bg-[#C83E4D] text-white dark:border-[#E14B67] dark:bg-[#E14B67]'
                                : 'border-[#DFD6C9] bg-[#FCFBF8] text-[#4C566A] hover:border-[#C83E4D]/60 dark:border-white/12 dark:bg-[#0B1222] dark:text-[#A9B5CA]'
                            }`}
                          >
                            {extra.voiceLabels[v.id] ?? v.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Topic Selector populated directly from portfolioData.ts */}
                  <div className="mt-3.5">
                    <label
                      htmlFor={`${inputId}-brief-target`}
                      className="block text-[11px] font-semibold text-[#2F3748] dark:text-[#DCE3F0]"
                    >
                      {t.chooseTarget}
                    </label>
                    <select
                      id={`${inputId}-brief-target`}
                      value={briefTargetKey}
                      onChange={(e) => setBriefTargetKey(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-[#DFD6C9] bg-[#FCFBF8] px-3 py-2 text-xs text-[#171C28] focus:border-[#C83E4D] focus:outline-none dark:border-white/14 dark:bg-[#0A1020] dark:text-[#F3F6FC]"
                    >
                      <option value="overview">{t.fullOverviewOption}</option>
                      <optgroup label={extra.optgroupPapers}>
                        {RESEARCH_PUBLICATIONS.map((r) => {
                          const locPaper = getLocalizedResearch(r, language);
                          return (
                            <option key={r.id} value={`paper:${r.id}`}>
                              {locPaper.venue} — {locPaper.title}
                            </option>
                          );
                        })}
                      </optgroup>
                      <optgroup label={extra.optgroupProjects}>
                        {PROJECTS.map((p) => {
                          const locProj = getLocalizedProject(p, language);
                          return (
                            <option key={p.id} value={`project:${p.id}`}>
                              {locProj.title} ({locProj.year})
                            </option>
                          );
                        })}
                      </optgroup>
                    </select>
                  </div>

                  <button
                    type="button"
                    disabled={briefLoading}
                    onClick={() => void handleGenerateBrief()}
                    className="mt-3.5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#C83E4D] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#B23342] disabled:opacity-60 dark:bg-[#E14B67] dark:hover:bg-[#CC3D58]"
                  >
                    {briefLoading ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                        <span>{t.generatingBrief}</span>
                      </>
                    ) : (
                      <>
                        <Headphones className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{t.generatePlayBtn}</span>
                      </>
                    )}
                  </button>
                </div>

                {briefError && (
                  <div
                    role="alert"
                    className="flex items-start gap-2 rounded-xl border border-[#C83E4D]/40 bg-[#C83E4D]/10 p-3 text-xs text-[#8E2230] dark:border-[#F47292]/40 dark:bg-[#F47292]/12 dark:text-[#FFD2DE]"
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>{briefError}</span>
                  </div>
                )}

                {briefResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3 rounded-xl border border-[#E6DFD5] bg-[#FFFFFF]/92 p-4 dark:border-white/12 dark:bg-[#121A30]/90"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-display text-sm font-bold text-[#171C28] dark:text-[#F3F6FC]">
                          {briefResult.title}
                        </p>
                        <p className="text-[11px] font-mono text-[#697386] dark:text-[#8E9BB2]">
                          {extra.voiceMetaLabel}: {briefResult.voiceName} · 24kHz WAV
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (speakingId === 'audio-brief-main') {
                            stopAudioPlayback();
                          } else {
                            void playBase64Audio('audio-brief-main', briefResult.audioBase64);
                          }
                        }}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[#171C28] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#C83E4D] dark:bg-[#F3F6FC] dark:text-[#090D18] dark:hover:bg-[#F47292]"
                      >
                        {speakingId === 'audio-brief-main' ? (
                          <>
                            <Square className="h-3 w-3 fill-current" aria-hidden="true" />
                            <span>{t.stop}</span>
                          </>
                        ) : (
                          <>
                            <Play className="h-3 w-3 fill-current" aria-hidden="true" />
                            <span>{t.replay}</span>
                          </>
                        )}
                      </button>
                    </div>

                    <p className="border-t border-[#EFEAE1] pt-3 text-xs leading-relaxed text-[#3B4456] dark:border-white/10 dark:text-[#C5CFE0]">
                      {briefResult.script}
                    </p>
                  </motion.div>
                )}
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
};
