import React, { useState } from 'react';
import {
  Atom,
  BookOpen,
  Bot,
  Brain,
  Code2,
  Cpu,
  Database,
  Eye,
  FileText,
  Glasses,
  GraduationCap,
  Layers,
  Mail,
  Orbit,
  Palette,
  ShieldCheck,
  Sparkles,
  Wrench,
} from 'lucide-react';

export interface SymbolSpec {
  src?: string;
  alt: string;
  wide?: boolean;
  darkPlate?: boolean;
  plateTone?: 'esa' | 'mit' | 'plum' | 'slate' | 'soft';
  iconKey?:
    | 'tranquilmind'
    | 'safety'
    | 'ml'
    | 'cbse'
    | 'aivr'
    | 'daad'
    | 'unity';
}

interface OrgSymbolProps {
  symbol: SymbolSpec;
  size?: 'sm' | 'md';
}

const PLATE_CLASSES: Record<NonNullable<SymbolSpec['plateTone']>, string> = {
  esa: 'bg-[#07364B] border-[#1A5169]',
  mit: 'bg-[#151C32] border-[#313E60]',
  plum: 'bg-[#352A48] border-[#53456B]',
  slate: 'bg-[#171C28] border-[#2E3852]',
  soft: 'bg-[#E5ECEE] border-[#C8D5D9]',
};

function getFloatPhase(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % 4;
}

const ORG_FLOAT_CHROME =
  'symbol-float shadow-md shadow-[#171C28]/12 ring-1 ring-white/40 transition-shadow duration-200 hover:shadow-lg hover:shadow-[#C83E4D]/22 dark:shadow-black/45 dark:ring-white/12 dark:hover:shadow-[#F47292]/25';

export const OrgSymbol: React.FC<OrgSymbolProps> = ({ symbol, size = 'md' }) => {
  const [imgError, setImgError] = useState(false);
  const floatClass = `${ORG_FLOAT_CHROME} symbol-float-${getFloatPhase(symbol.alt || symbol.src || 'org')}`;

  if (symbol.iconKey === 'aivr') {
    return (
      <span
        aria-label={symbol.alt}
        className={`inline-flex h-8 items-center gap-1 rounded-md border border-[#D8CFC2] bg-[#171C28] px-2.5 font-mono text-[10px] font-semibold tracking-tight text-[#FAF8F4] dark:border-[#2E3A54] dark:bg-[#1E273D] shrink-0 ${floatClass}`}
      >
        <span>AIVR</span>
        <span className="text-[#F59EA8]">2026</span>
      </span>
    );
  }

  if (symbol.iconKey === 'daad') {
    return (
      <span
        aria-label={symbol.alt}
        title={symbol.alt}
        className={`inline-flex items-center gap-1 rounded-md border border-[#1B5799] bg-[#0060AF] px-2 font-mono font-bold tracking-wider text-white shrink-0 ${floatClass} ${
          size === 'sm' ? 'h-6 text-[9px]' : 'h-8 text-[10px]'
        }`}
      >
        <span>DAAD</span>
      </span>
    );
  }

  if (symbol.iconKey === 'unity') {
    return (
      <span
        title={symbol.alt}
        aria-label={symbol.alt}
        className={`inline-flex items-center justify-center rounded-md border border-[#E2DACD] bg-white p-1 text-[#171C28] dark:border-[#2E3A54] shrink-0 ${floatClass} ${
          size === 'sm' ? 'h-6 w-6' : 'h-8 w-8'
        }`}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
          <path d="M10.4 17.8 5.2 14.8l5.2-3 5.2 3-5.2 3Zm-6.6-4.4V7.3l5.2 3v6.1l-5.2-3Zm13.2 0-5.2 3v-6.1l5.2-3v6.1Zm-1.4-7.6-5.2 3-5.2-3L10.4 3l5.2 2.8Zm4.2 1.2L12.6 2.9 10.4 1.6 8.2 2.9 1 7v8.4l7.2 4.1 2.2 1.3 2.2-1.3 7.2-4.1V7Z" />
        </svg>
      </span>
    );
  }

  if (!symbol.src || imgError) {
    const Icon =
      symbol.iconKey === 'tranquilmind'
        ? Brain
        : symbol.iconKey === 'safety'
          ? ShieldCheck
          : symbol.iconKey === 'ml'
            ? Cpu
            : symbol.iconKey === 'cbse'
              ? GraduationCap
              : Sparkles;

    return (
      <span
        title={symbol.alt}
        className={`inline-flex items-center justify-center rounded-md border border-[#E2DACD] bg-[#F3EFE8] text-[#C83E4D] dark:border-[#2A354E] dark:bg-[#1A2236] dark:text-[#EA7180] shrink-0 ${floatClass} ${
          size === 'sm' ? 'h-6 w-6' : 'h-8 w-8'
        }`}
      >
        <Icon className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} aria-hidden="true" />
      </span>
    );
  }

  const plateClass = symbol.plateTone
    ? PLATE_CLASSES[symbol.plateTone]
    : symbol.darkPlate
      ? PLATE_CLASSES.slate
      : 'bg-white border-[#E2DACD] dark:border-[#2E3A54]';

  if (symbol.wide) {
    return (
      <span
        title={symbol.alt}
        className={`inline-flex items-center justify-center overflow-hidden rounded-md border px-2 py-1 shrink-0 ${plateClass} ${floatClass} ${
          size === 'sm' ? 'h-7 max-w-[92px]' : 'h-8 max-w-[116px]'
        }`}
      >
        <img
          src={symbol.src}
          alt={symbol.alt}
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={() => setImgError(true)}
          className="h-full w-auto max-w-full object-contain"
        />
      </span>
    );
  }

  return (
    <span
      title={symbol.alt}
      className={`inline-flex items-center justify-center overflow-hidden rounded-md border p-1 shrink-0 ${plateClass} ${floatClass} ${
        size === 'sm' ? 'h-6 w-6' : 'h-8 w-8'
      }`}
    >
      <img
        src={symbol.src}
        alt={symbol.alt}
        referrerPolicy="no-referrer"
        loading="lazy"
        onError={() => setImgError(true)}
        className="h-full w-full object-contain"
      />
    </span>
  );
};

export type DomainSymbolKey =
  | 'xr'
  | 'ai'
  | 'ml'
  | 'quantum'
  | 'robotics'
  | 'space'
  | 'safety'
  | 'brain'
  | 'neuro'
  | 'devices'
  | 'engines'
  | 'languages'
  | 'craft'
  | 'data'
  | 'email'
  | 'github'
  | 'linkedin'
  | 'wantedly'
  | 'scholar'
  | 'codechef'
  | 'deepml'
  | 'kaggle'
  | 'medium'
  | 'essay'
  | 'resource';

export const DomainSymbol: React.FC<{ kind: DomainSymbolKey; className?: string }> = ({
  kind,
  className = 'h-4 w-4',
}) => {
  const floatWrap = `inline-flex items-center justify-center shrink-0 symbol-float-micro symbol-float-${getFloatPhase(kind)} drop-shadow-[0_2px_4px_rgba(23,28,40,0.16)] dark:drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)]`;

  const renderInner = () => {
    switch (kind) {
      case 'xr':
      case 'devices':
        return <Glasses className={className} aria-hidden="true" />;
      case 'ai':
        return <Sparkles className={className} aria-hidden="true" />;
      case 'ml':
      case 'deepml':
        return <Cpu className={className} aria-hidden="true" />;
      case 'quantum':
        return <Atom className={className} aria-hidden="true" />;
      case 'robotics':
        return <Bot className={className} aria-hidden="true" />;
      case 'space':
        return <Orbit className={className} aria-hidden="true" />;
      case 'safety':
        return <ShieldCheck className={className} aria-hidden="true" />;
      case 'brain':
        return <Brain className={className} aria-hidden="true" />;
      case 'neuro':
        return <Eye className={className} aria-hidden="true" />;
      case 'engines':
        return <Layers className={className} aria-hidden="true" />;
      case 'languages':
        return <Code2 className={className} aria-hidden="true" />;
      case 'craft':
        return <Palette className={className} aria-hidden="true" />;
      case 'data':
        return <Database className={className} aria-hidden="true" />;
      case 'email':
        return <Mail className={className} aria-hidden="true" />;
      case 'scholar':
        return <GraduationCap className={className} aria-hidden="true" />;
      case 'essay':
        return <FileText className={className} aria-hidden="true" />;
      case 'resource':
        return <Wrench className={className} aria-hidden="true" />;
      case 'codechef':
        return (
          <img
            src="/src/assets/symbols/codechef.png"
            alt=""
            aria-hidden="true"
            referrerPolicy="no-referrer"
            className="h-4 w-4 rounded-[3px] bg-white object-contain p-[1px] ring-1 ring-black/10"
          />
        );
      case 'github':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
            <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.3 9.4 7.88 10.92.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.8 1.19 1.83 1.19 3.08 0 4.41-2.69 5.39-5.26 5.67.41.36.78 1.07.78 2.15 0 1.55-.01 2.8-.01 3.18 0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
          </svg>
        );
      case 'linkedin':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
            <path d="M4.98 3.5a2.48 2.48 0 1 0 0 4.96 2.48 2.48 0 0 0 0-4.96ZM3 9h4v12H3V9Zm7 0h3.8v1.64h.05c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94V21h-4V9Z" />
          </svg>
        );
      case 'wantedly':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
            <path d="M2.4 6.1c1.05 0 1.78.63 2.1 1.77l1.34 4.7 1.55-5.02c.35-1.12.99-1.67 1.94-1.67s1.6.55 1.95 1.67l1.55 5.02 1.34-4.7c.32-1.14 1.05-1.77 2.1-1.77 1.19 0 1.93.83 1.93 1.88 0 .37-.08.77-.23 1.22l-2.4 7.1c-.44 1.3-1.25 1.96-2.4 1.96-1.12 0-1.88-.63-2.28-1.85l-1.56-4.67-1.56 4.67c-.4 1.22-1.16 1.85-2.28 1.85-1.15 0-1.96-.66-2.4-1.96l-2.4-7.1c-.15-.45-.23-.85-.23-1.22 0-1.05.74-1.88 1.93-1.88Z" />
          </svg>
        );
      case 'kaggle':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
            <path d="M6 3h2.8v9.9L16.3 5h3.5l-7.2 7.4L20.3 21h-3.6l-6.1-6.9-1.8 1.8V21H6V3Z" />
          </svg>
        );
      case 'medium':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
            <circle cx="6.5" cy="12" r="5" />
            <ellipse cx="15.2" cy="12" rx="2.6" ry="4.7" />
            <ellipse cx="20.4" cy="12" rx="1.1" ry="4.2" />
          </svg>
        );
      default:
        return <BookOpen className={className} aria-hidden="true" />;
    }
  };

  return <span className={floatWrap}>{renderInner()}</span>;
};
