import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Printer, X } from 'lucide-react';
import {
  CV_PDF_URL,
  EXPERIENCES,
  RECOGNITIONS,
  RESEARCH_PUBLICATIONS,
} from '../data/portfolioData';
import {
  EXTRA_UI_BY_LANG,
  getLocalizedExperience,
  getLocalizedRecognition,
  getLocalizedResearch,
} from '../data/localizedContent';
import { TRANSLATIONS, type LanguageCode } from '../data/translations';
import { CountryFlag } from './CountryFlag';
import { OrgSymbol } from './OrgSymbol';

interface CvModalProps {
  open: boolean;
  onClose: () => void;
  language?: LanguageCode;
}

export const CvModal: React.FC<CvModalProps> = ({
  open,
  onClose,
  language = 'en',
}) => {
  const t = TRANSLATIONS[language].cvModal;
  useEffect(() => {
    if (!open) return;
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
  }, [open, onClose]);

  if (!open) return null;

  const extra = EXTRA_UI_BY_LANG[language];
  const localizedExperiences = EXPERIENCES.map((e) => getLocalizedExperience(e, language));
  const localizedPublications = RESEARCH_PUBLICATIONS.map((r) => getLocalizedResearch(r, language));
  const localizedRecognitions = RECOGNITIONS.map((r) => getLocalizedRecognition(r, language));

  const fellowshipItems = localizedRecognitions.filter((r) => r.group === 'fellowships');
  const schoolItems = localizedRecognitions.filter((r) => r.group === 'schools');
  const competitionItems = localizedRecognitions.filter((r) => r.group === 'competitions');
  const educationItems = localizedRecognitions.filter((r) => r.group === 'education');

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cv-modal-title"
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
        <div className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-b border-[#E6DFD5] bg-[#FCFBF8]/95 px-6 py-4 backdrop-blur dark:border-[#222D45] dark:bg-[#0F1523]/95 no-print">
          <h3 id="cv-modal-title" className="font-display text-lg font-bold tracking-tight">
            {t.title}
          </h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#D8CFC2] px-3 py-2 text-xs font-medium text-[#171C28] transition-colors hover:bg-[#EFEAE1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C83E4D] dark:border-[#2E3A54] dark:text-[#EEF1F7] dark:hover:bg-[#1A2338] whitespace-nowrap shrink-0"
            >
              <Printer className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{t.print}</span>
            </button>
            <a
              href={CV_PDF_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#C83E4D] px-3.5 py-2 text-xs font-medium text-white transition-colors hover:bg-[#AE313F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C83E4D] dark:bg-[#E14B67] dark:hover:bg-[#CC3D58] whitespace-nowrap shrink-0"
            >
              <span>{t.downloadPdf}</span>
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close CV preview"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E6DFD5] text-[#171C28] transition-colors hover:bg-[#EFEAE1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C83E4D] dark:border-[#26324B] dark:text-[#EEF1F7] dark:hover:bg-[#1A2338]"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="space-y-7 p-6 sm:p-8">
          <div className="border-b border-[#E6DFD5] pb-5 dark:border-[#222D45]">
            <p className="font-display text-2xl font-bold tracking-tight">Ashish Kumar</p>
            <p className="mt-1 text-sm text-[#525C6E] dark:text-[#A3AEBF]">
              {extra.cvSubtitle}
            </p>
            <p className="mt-2 font-mono text-xs text-[#525C6E] dark:text-[#9AA5BA]">
              ak6358404@gmail.com · github.com/Ashish11828 · IIT Jodhpur
            </p>
          </div>

          <section>
            <h4 className="font-display text-sm font-semibold text-[#C83E4D] dark:text-[#F47292]">
              {t.experience}
            </h4>
            <ul className="mt-3 space-y-4">
              {localizedExperiences.map((exp) => (
                <li key={exp.id} className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-6">
                  <div>
                    <p className="flex flex-wrap items-center gap-2 text-sm font-semibold">
                      <CountryFlag code={exp.country} className="h-[12px] w-[18px]" />
                      {exp.symbols.map((sym) => (
                        <OrgSymbol key={sym.alt} symbol={sym} size="sm" />
                      ))}
                      <span>
                        {exp.role} — {exp.organization}
                      </span>
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-[#525C6E] dark:text-[#A3AEBF]">
                      {exp.summary}
                    </p>
                  </div>
                  <span className="font-mono text-xs tabular-nums text-[#525C6E] dark:text-[#9AA5BA] whitespace-nowrap shrink-0">
                    {exp.period}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="border-t border-[#E6DFD5] pt-6 dark:border-[#222D45]">
            <h4 className="font-display text-sm font-semibold text-[#C83E4D] dark:text-[#F47292]">
              {t.publications}
            </h4>
            <ul className="mt-3 space-y-3">
              {localizedPublications.map((pub) => (
                <li key={pub.id} className="flex items-start gap-2.5 text-sm">
                  <div className="mt-0.5 flex items-center gap-1.5 shrink-0">
                    <CountryFlag code={pub.country} className="h-[12px] w-[18px]" />
                    {pub.symbols.map((sym) => (
                      <OrgSymbol key={sym.alt} symbol={sym} size="sm" />
                    ))}
                  </div>
                  <div>
                    <span className="font-semibold">{pub.title}</span>
                    <span className="text-xs text-[#525C6E] dark:text-[#A3AEBF]">
                      {' '}· {pub.venue} ({pub.location}) · {pub.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="border-t border-[#E6DFD5] pt-6 dark:border-[#222D45]">
            <h4 className="font-display text-sm font-semibold text-[#C83E4D] dark:text-[#F47292]">
              {t.fellowships}
            </h4>
            <ul className="mt-3 space-y-2.5 text-sm">
              {[...fellowshipItems, ...schoolItems].map((item) => (
                <li key={item.id} className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex flex-wrap items-center gap-2">
                    <CountryFlag code={item.country} className="h-[12px] w-[18px]" />
                    {item.symbols.map((sym) => (
                      <OrgSymbol key={sym.alt} symbol={sym} size="sm" />
                    ))}
                    <span>
                      <span className="font-semibold">{item.title}</span>
                      <span className="text-xs text-[#525C6E] dark:text-[#A3AEBF]"> · {item.metaLeft}</span>
                    </span>
                  </span>
                  <span className="font-mono text-xs tabular-nums text-[#525C6E] dark:text-[#9AA5BA]">
                    {item.outcome}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="border-t border-[#E6DFD5] pt-6 dark:border-[#222D45]">
            <h4 className="font-display text-sm font-semibold text-[#C83E4D] dark:text-[#F47292]">
              {t.awards}
            </h4>
            <ul className="mt-3 space-y-2.5 text-sm">
              {competitionItems.map((item) => (
                <li key={item.id} className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex flex-wrap items-center gap-2">
                    <CountryFlag code={item.country} className="h-[12px] w-[18px]" />
                    {item.symbols.map((sym) => (
                      <OrgSymbol key={sym.alt} symbol={sym} size="sm" />
                    ))}
                    <span>
                      <span className="font-semibold">{item.title}</span>
                      <span className="text-xs text-[#525C6E] dark:text-[#A3AEBF]"> · {item.metaLeft}</span>
                    </span>
                  </span>
                  <span className="font-mono text-xs tabular-nums text-[#C83E4D] dark:text-[#FFA3BC]">
                    {item.outcome}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="border-t border-[#E6DFD5] pt-6 dark:border-[#222D45]">
            <h4 className="font-display text-sm font-semibold text-[#C83E4D] dark:text-[#F47292]">
              {t.education}
            </h4>
            <ul className="mt-3 space-y-2.5 text-sm">
              {educationItems.map((item) => (
                <li key={item.id} className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex flex-wrap items-center gap-2">
                    <CountryFlag code={item.country} className="h-[12px] w-[18px]" />
                    {item.symbols.map((sym) => (
                      <OrgSymbol key={sym.alt} symbol={sym} size="sm" />
                    ))}
                    <span>
                      <span className="font-semibold">{item.title}</span>
                      <span className="text-xs text-[#525C6E] dark:text-[#A3AEBF]"> · {item.metaLeft}</span>
                    </span>
                  </span>
                  <span className="font-mono text-xs tabular-nums text-[#525C6E] dark:text-[#9AA5BA]">
                    {item.outcome}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </motion.div>
    </motion.div>
  );
};
