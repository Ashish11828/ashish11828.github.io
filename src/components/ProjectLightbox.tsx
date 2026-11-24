import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Sparkles, X } from 'lucide-react';
import { ProjectItem } from '../data/portfolioData';
import { EXTRA_UI_BY_LANG, getLocalizedProject } from '../data/localizedContent';
import { TRANSLATIONS, type LanguageCode } from '../data/translations';
import { ArtworkFrame } from './ArtworkFrame';
import { CountryFlag } from './CountryFlag';
import { OrgSymbol } from './OrgSymbol';

interface ProjectLightboxProps {
  project: ProjectItem | null;
  onClose: () => void;
  onAskAi?: (prompt: string) => void;
  language?: LanguageCode;
}

export const ProjectLightbox: React.FC<ProjectLightboxProps> = ({
  project,
  onClose,
  onAskAi,
  language = 'en',
}) => {
  const t = TRANSLATIONS[language];
  const extra = EXTRA_UI_BY_LANG[language];
  useEffect(() => {
    if (!project) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKey);
    };
  }, [project, onClose]);

  if (!project) return null;

  const localized = getLocalizedProject(project, language);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-project-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#070A13]/80 p-4 sm:p-6 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-[#E6DFD5] bg-[#FCFBF8] text-[#171C28] shadow-2xl dark:border-[#26324B] dark:bg-[#0F1523] dark:text-[#EEF1F7]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-[#E6DFD5] bg-[#FCFBF8]/95 px-6 py-4 backdrop-blur dark:border-[#222D45] dark:bg-[#0F1523]/95">
          <div className="flex min-w-0 items-center gap-2 text-xs text-[#525C6E] dark:text-[#9AA5BA]">
            <span className="truncate font-medium text-[#C83E4D] dark:text-[#F07A8E]">
              {localized.categoryLabel}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums shrink-0">{localized.year}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close project details"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#E6DFD5] text-[#171C28] transition-colors duration-150 hover:bg-[#EFEAE1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C83E4D] dark:border-[#26324B] dark:text-[#EEF1F7] dark:hover:bg-[#1A2338]"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {project.image && (
          <ArtworkFrame
            src={project.image}
            alt={project.imageAlt ?? project.title}
            title={project.title}
            priority
            className="aspect-[16/9] w-full border-b border-[#E6DFD5] dark:border-[#263047]"
          />
        )}

        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            {localized.symbols.map((sym) => (
              <OrgSymbol key={sym.alt} symbol={sym} />
            ))}
            <h3
              id="lightbox-project-title"
              className="font-display text-2xl font-bold tracking-tight text-[#171C28] sm:text-3xl dark:text-[#EEF1F7]"
            >
              {localized.title}
            </h3>
          </div>
          {localized.venue && (
            <p className="mt-2 flex items-center gap-2 text-sm font-medium text-[#525C6E] dark:text-[#A3AEBF]">
              {localized.country && <CountryFlag code={localized.country} />}
              <span>{localized.venue}</span>
            </p>
          )}

          <p className="mt-5 text-[15px] leading-relaxed text-[#2F3748] dark:text-[#D5DCE8]">
            {localized.summary}
          </p>

          <div className="mt-6 grid gap-6 border-t border-[#E6DFD5] pt-6 sm:grid-cols-2 dark:border-[#263047]">
            <div>
              <h4 className="font-display text-sm font-semibold text-[#171C28] dark:text-[#EEF1F7]">
                {t.lightbox.contribution}
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-[#4C566A] dark:text-[#A8B3C7]">
                {localized.contribution}
              </p>
            </div>
            <div>
              <h4 className="font-display text-sm font-semibold text-[#171C28] dark:text-[#EEF1F7]">
                {t.lightbox.outcome}
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-[#4C566A] dark:text-[#A8B3C7]">
                {localized.outcome}
              </p>
            </div>
          </div>

          <div className="mt-6 border-t border-[#E6DFD5] pt-5 dark:border-[#263047]">
            <p className="text-xs text-[#525C6E] dark:text-[#9AA5BA]">
              <span className="font-semibold text-[#171C28] dark:text-[#EEF1F7]">{t.lightbox.toolsStack} </span>
              {localized.stack.join(' · ')}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {localized.links.map((link) => (
              <a
                key={link.href + link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={
                  link.primary
                    ? 'inline-flex items-center gap-1.5 rounded-lg bg-[#C83E4D] px-4 py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-[#AE313F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C83E4D] whitespace-nowrap shrink-0'
                    : 'inline-flex items-center gap-1.5 rounded-lg border border-[#D8CFC2] px-4 py-2.5 text-sm font-medium text-[#171C28] transition-colors duration-150 hover:bg-[#EFEAE1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C83E4D] dark:border-[#2E3A54] dark:text-[#EEF1F7] dark:hover:bg-[#1B2336] whitespace-nowrap shrink-0'
                }
              >
                <span>{link.label}</span>
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            ))}
            {onAskAi && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onAskAi(extra.askProjectPrompt(localized.title));
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#C83E4D]/45 bg-[#C83E4D]/8 px-4 py-2.5 text-sm font-medium text-[#C83E4D] transition-colors duration-150 hover:bg-[#C83E4D]/16 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C83E4D] dark:border-[#F47292]/45 dark:bg-[#F47292]/12 dark:text-[#FFA3BC] dark:hover:bg-[#F47292]/20 whitespace-nowrap shrink-0"
              >
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                <span>{t.lightbox.askAiAboutProject}</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
