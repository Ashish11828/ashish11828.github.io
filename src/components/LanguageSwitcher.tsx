import React, { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { CountryFlag } from './CountryFlag';
import { LANGUAGE_OPTIONS, type LanguageCode } from '../data/translations';

interface LanguageSwitcherProps {
  language: LanguageCode;
  onChange: (lang: LanguageCode) => void;
  variant?: 'bar' | 'menu';
  placement?: 'down' | 'up';
  compact?: boolean;
}

/**
 * Human-Factors-engineered Language Switcher:
 * - Recognition over Recall: always displays native autonyms (English, Español, Deutsch, Français, 日本語, Português)
 *   with proper `lang` attributes for assistive technology pronunciation.
 * - Fitts's Law: generous >=40px desktop / >=44px mobile touch targets with clear spacing.
 * - WCAG 1.4.1 Non-Color-Only State: active selection uses contrast shift + checkmark icon.
 * - Error Recovery: every option exposes both native autonym and English reference so users can always switch back.
 * - Full Keyboard Ergonomics: Arrow keys, Home/End, Escape with clean focus management + polite live announcement.
 */
export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  language,
  onChange,
  variant = 'menu',
  placement = 'down',
  compact = false,
}) => {
  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(() =>
    Math.max(
      0,
      LANGUAGE_OPTIONS.findIndex((opt) => opt.code === language)
    )
  );
  const [liveStatus, setLiveStatus] = useState('');
  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const barButtonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const menuButtonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const groupId = useId();

  const currentIndex = Math.max(
    0,
    LANGUAGE_OPTIONS.findIndex((opt) => opt.code === language)
  );
  const current = LANGUAGE_OPTIONS[currentIndex] ?? LANGUAGE_OPTIONS[0];

  const selectLanguage = (nextLang: LanguageCode) => {
    const matched = LANGUAGE_OPTIONS.find((opt) => opt.code === nextLang);
    onChange(nextLang);
    if (matched) {
      setLiveStatus(`Language set to ${matched.nativeName} (${matched.englishName})`);
    }
  };

  useEffect(() => {
    setFocusedIndex(currentIndex);
  }, [currentIndex]);

  useEffect(() => {
    if (!open || variant !== 'menu') return;
    const handlePointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, variant]);

  useEffect(() => {
    if (open && variant === 'menu') {
      window.requestAnimationFrame(() => {
        menuButtonsRef.current[currentIndex]?.focus();
      });
    }
  }, [open, variant, currentIndex]);

  const handleBarKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
    const total = LANGUAGE_OPTIONS.length;
    let nextIdx: number | null = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      nextIdx = (idx + 1) % total;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      nextIdx = (idx - 1 + total) % total;
    } else if (e.key === 'Home') {
      nextIdx = 0;
    } else if (e.key === 'End') {
      nextIdx = total - 1;
    }
    if (nextIdx !== null) {
      e.preventDefault();
      const target = LANGUAGE_OPTIONS[nextIdx];
      selectLanguage(target.code);
      barButtonsRef.current[nextIdx]?.focus();
    }
  };

  const handleMenuItemKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
    const total = LANGUAGE_OPTIONS.length;
    let nextIdx: number | null = null;
    if (e.key === 'ArrowDown') {
      nextIdx = (idx + 1) % total;
    } else if (e.key === 'ArrowUp') {
      nextIdx = (idx - 1 + total) % total;
    } else if (e.key === 'Home') {
      nextIdx = 0;
    } else if (e.key === 'End') {
      nextIdx = total - 1;
    }
    if (nextIdx !== null) {
      e.preventDefault();
      setFocusedIndex(nextIdx);
      menuButtonsRef.current[nextIdx]?.focus();
    }
  };

  if (variant === 'bar') {
    return (
      <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-2xl border border-[#E6DFD5]/80 bg-[#FCFBF8]/80 px-3 py-2 backdrop-blur-md dark:border-white/12 dark:bg-[#090E1B]/74">
        <div className="flex items-center gap-2 pl-1 text-xs text-[#4C566A] dark:text-[#A9B5CA]">
          <Globe
            className="h-4 w-4 shrink-0 text-[#C83E4D] dark:text-[#F47292]"
            aria-hidden="true"
          />
          <span className="font-medium text-[#171C28] dark:text-[#EEF1F7]" lang={current.code}>
            {current.nativeName}
          </span>
        </div>

        <div
          role="radiogroup"
          aria-label="Display language"
          className="flex flex-wrap items-center gap-1"
        >
          {LANGUAGE_OPTIONS.map((opt, idx) => {
            const active = opt.code === language;
            return (
              <button
                key={opt.code}
                ref={(el) => {
                  barButtonsRef.current[idx] = el;
                }}
                type="button"
                role="radio"
                aria-checked={active}
                tabIndex={active ? 0 : -1}
                lang={opt.code}
                title={`${opt.nativeName} (${opt.englishName})`}
                onClick={() => selectLanguage(opt.code)}
                onKeyDown={(e) => handleBarKeyDown(e, idx)}
                className={`relative inline-flex min-h-[40px] items-center gap-1.5 rounded-xl px-2.5 py-2 text-xs font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C83E4D] whitespace-nowrap shrink-0 sm:min-h-[38px] ${
                  active
                    ? 'text-[#FCFBF8] dark:text-[#090D18]'
                    : 'text-[#3B4456] hover:bg-[#EFEAE1]/85 hover:text-[#171C28] dark:text-[#BCC7DA] dark:hover:bg-white/10 dark:hover:text-[#F3F6FC]'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId={`langBarActive-${groupId}`}
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    className="absolute inset-0 rounded-xl bg-[#171C28] shadow-xs dark:bg-[#F3F6FC]"
                  />
                )}
                <span className="relative z-10 inline-flex items-center gap-1.5">
                  <CountryFlag code={opt.flag} className="h-[11px] w-[16px]" />
                  <span className={active ? 'font-semibold' : ''}>{opt.nativeName}</span>
                  {active && (
                    <Check
                      className="h-3.5 w-3.5 text-[#FFB5C8] dark:text-[#C83E4D]"
                      aria-hidden="true"
                    />
                  )}
                </span>
              </button>
            );
          })}
        </div>

        <span role="status" aria-live="polite" className="sr-only">
          {liveStatus}
        </span>
      </div>
    );
  }

  return (
    <div ref={rootRef} className="relative inline-block">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            setOpen(true);
          }
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Change language (current: ${current.nativeName} / ${current.englishName})`}
        className={`inline-flex min-h-[40px] items-center gap-2 rounded-xl border border-[#E2DACD] bg-[#FFFFFF]/85 font-medium text-[#2F3748] backdrop-blur-sm transition-colors duration-150 hover:border-[#C83E4D]/60 hover:text-[#171C28] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C83E4D] dark:border-[#25314B] dark:bg-[#12192A]/85 dark:text-[#DCE3F0] dark:hover:border-[#F47292]/60 whitespace-nowrap shrink-0 ${
          compact ? 'px-3 py-2 text-xs' : 'px-3.5 py-2 text-xs'
        }`}
      >
        <Globe className="h-3.5 w-3.5 text-[#C83E4D] dark:text-[#F47292]" aria-hidden="true" />
        <CountryFlag code={current.flag} className="h-[11px] w-[16px]" />
        <span lang={current.code} className="font-semibold">
          {current.nativeName}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 opacity-70 transition-transform duration-150 ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label="Select display language"
            initial={{ opacity: 0, y: placement === 'up' ? 6 : -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: placement === 'up' ? 6 : -6, scale: 0.97 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute z-50 min-w-[220px] overflow-hidden rounded-xl border border-[#DFD6C9] bg-[#FCFBF8]/96 p-1.5 shadow-xl shadow-black/15 backdrop-blur-xl dark:border-white/15 dark:bg-[#0D1426]/96 dark:shadow-black/55 ${
              placement === 'up' ? 'bottom-full right-0 mb-2' : 'top-full left-0 mt-2'
            }`}
          >
            {LANGUAGE_OPTIONS.map((opt, idx) => {
              const active = opt.code === language;
              return (
                <li key={opt.code} role="option" aria-selected={active}>
                  <button
                    ref={(el) => {
                      menuButtonsRef.current[idx] = el;
                    }}
                    type="button"
                    tabIndex={focusedIndex === idx ? 0 : -1}
                    lang={opt.code}
                    onClick={() => {
                      selectLanguage(opt.code);
                      setOpen(false);
                      triggerRef.current?.focus();
                    }}
                    onKeyDown={(e) => handleMenuItemKeyDown(e, idx)}
                    className={`flex min-h-[40px] w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#C83E4D] ${
                      active
                        ? 'bg-[#C83E4D]/12 font-semibold text-[#C83E4D] dark:bg-[#F47292]/18 dark:text-[#FFA3BC]'
                        : 'text-[#2F3748] hover:bg-[#EFEAE1]/85 hover:text-[#171C28] dark:text-[#DCE3F0] dark:hover:bg-white/10 dark:hover:text-[#F3F6FC]'
                    }`}
                  >
                    <span className="inline-flex items-center gap-2.5">
                      <CountryFlag code={opt.flag} className="h-[11px] w-[17px]" />
                      <span className="flex flex-col leading-tight">
                        <span>{opt.nativeName}</span>
                        {opt.nativeName !== opt.englishName && (
                          <span className="text-[10.5px] font-normal opacity-65">
                            {opt.englishName}
                          </span>
                        )}
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="font-mono text-[10px] opacity-60">{opt.shortLabel}</span>
                      {active && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                    </span>
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>

      <span role="status" aria-live="polite" className="sr-only">
        {liveStatus}
      </span>
    </div>
  );
};
