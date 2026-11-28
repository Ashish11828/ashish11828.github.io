import React, { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react';
import {
  ArrowUpRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Copy,
  Headphones,
  Menu,
  Mic,
  Moon,
  Pause,
  Play,
  Sparkles,
  Sun,
  X,
} from 'lucide-react';
import {
  ANIME_REEL_SCENES,
  AnimeBackgroundReel,
} from './components/AnimeBackgroundReel';
import { ArtworkFrame } from './components/ArtworkFrame';
import { ContactForm, type ContactDraft } from './components/ContactForm';
import { CountryFlag, type CountryCode } from './components/CountryFlag';
import { ErrorBoundary } from './components/ErrorBoundary';
import { FocusAreaMotionOverlay } from './components/FocusAreaMotionOverlay';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { DomainSymbol, OrgSymbol } from './components/OrgSymbol';
import type {
  AiLaunchRequest,
  AiPersonaId,
} from './components/PortfolioAiConcierge';
import { ResearchPaperAnimation } from './components/ResearchPaperAnimation';
import { SakuraVideoCanvas } from './components/SakuraVideoCanvas';
import {
  EXTRA_UI_BY_LANG,
  FOCUS_AREAS_BY_LANG,
  getLocalizedCountryName,
  getLocalizedExperience,
  getLocalizedProfileLinks,
  getLocalizedProject,
  getLocalizedRecognition,
  getLocalizedReelScene,
  getLocalizedResearch,
  getLocalizedResources,
  getLocalizedSkillGroups,
  getLocalizedWriting,
  METRIC_VALUES_BY_LANG,
  RESEARCH_INTERESTS_BY_LANG,
} from './data/localizedContent';
import {
  getSavedLanguage,
  TRANSLATIONS,
  type LanguageCode,
} from './data/translations';

const CvModal = lazy(() =>
  import('./components/CvModal').then((m) => ({ default: m.CvModal }))
);
const ProjectLightbox = lazy(() =>
  import('./components/ProjectLightbox').then((m) => ({ default: m.ProjectLightbox }))
);
const loadAiConcierge = () =>
  import('./components/PortfolioAiConcierge').then((m) => ({
    default: m.PortfolioAiConcierge,
  }));
const PortfolioAiConcierge = lazy(loadAiConcierge);
import {
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
  type ProjectCategory,
  type ProjectItem,
  type RecognitionItem,
} from './data/portfolioData';

type RecognitionTab = 'all' | RecognitionItem['group'];

const PROJECT_FILTERS: { id: ProjectCategory; label: string }[] = [
  { id: 'all', label: 'All Work' },
  { id: 'xr', label: 'XR & Glasses' },
  { id: 'ai', label: 'AI Safety & ML' },
  { id: 'quantum', label: 'Quantum' },
];

const RECOGNITION_TABS: { id: RecognitionTab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'fellowships', label: 'Fellowships' },
  { id: 'schools', label: 'Global Schools' },
  { id: 'competitions', label: 'Competitions' },
  { id: 'education', label: 'Education' },
];

function getInitialDarkMode(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const saved = window.localStorage.getItem('portfolio_theme');
    if (saved === 'light') return false;
    if (saved === 'dark') return true;
  } catch {
    // Ignore storage errors
  }
  return true;
}

function getInitialProjectFromUrl(): ProjectItem | null {
  if (typeof window === 'undefined') return null;
  try {
    const projectId = new URLSearchParams(window.location.search).get('project');
    if (!projectId) return null;
    return PROJECTS.find((p) => p.id === projectId) ?? null;
  } catch {
    return null;
  }
}

function buildResearchBibtex(item: {
  id: string;
  title: string;
  venue: string;
  location: string;
  href: string;
  kind: 'paper' | 'demo';
}): string {
  const safeKey = `kumar2026_${item.id.replace(/[^a-z0-9]/gi, '_')}`;
  const entryType = item.kind === 'paper' ? 'inproceedings' : 'misc';
  const venueField = item.kind === 'paper' ? `  booktitle = {${item.venue}},\n` : `  howpublished = {${item.venue}},\n`;
  return `@${entryType}{${safeKey},\n  author = {Ashish Kumar},\n  title = {${item.title}},\n${venueField}  address = {${item.location}},\n  year = {2026},\n  url = {${item.href}}\n}`;
}

export default function App() {
  // Default to Twilight Cinema, persisted across visits via localStorage
  const [darkMode, setDarkMode] = useState<boolean>(() => getInitialDarkMode());
  const [motionPaused, setMotionPaused] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const [activeScene, setActiveScene] = useState(0);
  const [loadedScenes, setLoadedScenes] = useState<Set<number>>(() => new Set([0]));
  const [projectFilter, setProjectFilter] = useState<ProjectCategory>('all');
  const [recognitionTab, setRecognitionTab] = useState<RecognitionTab>('all');
  const [countryFilter, setCountryFilter] = useState<CountryCode | 'all'>('all');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(() =>
    getInitialProjectFromUrl()
  );
  const [cvOpen, setCvOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const [copiedBibtexId, setCopiedBibtexId] = useState<string | null>(null);
  const [activeNavSection, setActiveNavSection] = useState<string>('');
  const [aiOpen, setAiOpen] = useState(false);
  const [aiMounted, setAiMounted] = useState(false);
  const [aiLaunch, setAiLaunch] = useState<AiLaunchRequest | null>(null);
  const [contactDraft, setContactDraft] = useState<ContactDraft | null>(null);
  const [language, setLanguage] = useState<LanguageCode>(() => getSavedLanguage());

  const effectiveMotionPaused = motionPaused || tabHidden;

  const t = TRANSLATIONS[language];
  const extra = EXTRA_UI_BY_LANG[language];
  const localizedReelScenes = useMemo(
    () => ANIME_REEL_SCENES.map((scene) => getLocalizedReelScene(scene, language)),
    [language]
  );
  const localizedSkillGroups = useMemo(
    () => getLocalizedSkillGroups(SKILL_GROUPS, language),
    [language]
  );
  const localizedWriting = useMemo(
    () => getLocalizedWriting(WRITING_ITEMS, language),
    [language]
  );
  const localizedResources = useMemo(
    () => getLocalizedResources(LEARNING_RESOURCES, language),
    [language]
  );
  const localizedProfiles = useMemo(
    () => getLocalizedProfileLinks(PROFILE_LINKS, language),
    [language]
  );

  const handleLanguageChange = (nextLang: LanguageCode) => {
    setLanguage(nextLang);
    try {
      window.localStorage.setItem('portfolio_lang', nextLang);
    } catch {
      // Ignore storage errors
    }
  };

  const { scrollYProgress } = useScroll();
  const readingProgress = useSpring(scrollYProgress, {
    stiffness: 240,
    damping: 32,
    restDelta: 0.001,
  });

  // Sync dark mode class and persist theme preference
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      window.localStorage.setItem('portfolio_theme', darkMode ? 'dark' : 'light');
    } catch {
      // Ignore storage errors
    }
  }, [darkMode]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // Keep shareable URL params (?lang= and ?project=) cleanly synced without full reload
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const url = new URL(window.location.href);
      if (language === 'en') {
        url.searchParams.delete('lang');
      } else {
        url.searchParams.set('lang', language);
      }
      if (selectedProject) {
        url.searchParams.set('project', selectedProject.id);
      } else {
        url.searchParams.delete('project');
      }
      const nextUrl = `${url.pathname}${url.search}${url.hash}`;
      const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      if (nextUrl !== currentUrl) {
        window.history.replaceState(null, '', nextUrl);
      }
    } catch {
      // Ignore history API issues in restricted frames
    }
  }, [language, selectedProject]);

  // Respect system prefers-reduced-motion on initial load
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mq.matches) {
        setMotionPaused(true);
      }
    }
  }, []);

  // Auto-pause background canvas & CSS animations when browser tab is hidden
  useEffect(() => {
    const handleVisibility = () => {
      setTabHidden(document.visibilityState === 'hidden');
    };
    handleVisibility();
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // Scroll-spy for active section highlight in top navigation
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
    const sectionIds = ['projects', 'research', 'experience', 'recognition', 'contact'];
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActiveNavSection(visible[0].target.id);
        }
      },
      { rootMargin: '-18% 0px -55% 0px', threshold: [0.08, 0.25, 0.5] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Continuous cinematic anime background reel loop (research & Japan interview story)
  useEffect(() => {
    if (effectiveMotionPaused) return;
    const timer = window.setInterval(() => {
      setActiveScene((prev) => (prev + 1) % ANIME_REEL_SCENES.length);
    }, 7500);
    return () => window.clearInterval(timer);
  }, [effectiveMotionPaused, activeScene]);

  // Progressively preload only the active and next scene in the Hero cinema player
  useEffect(() => {
    const nextIndex = (activeScene + 1) % ANIME_REEL_SCENES.length;
    setLoadedScenes((prev) => {
      if (prev.has(activeScene) && prev.has(nextIndex)) return prev;
      const next = new Set(prev);
      next.add(activeScene);
      next.add(nextIndex);
      return next;
    });
  }, [activeScene]);

  const currentScene = localizedReelScenes[activeScene];

  const handleStepScene = (delta: number) => {
    setActiveScene(
      (prev) => (prev + delta + ANIME_REEL_SCENES.length) % ANIME_REEL_SCENES.length
    );
  };

  const filteredProjects = useMemo(() => {
    if (projectFilter === 'all') return PROJECTS;
    return PROJECTS.filter((p) => p.category === projectFilter);
  }, [projectFilter]);

  const filteredRecognitions = useMemo(() => {
    return RECOGNITIONS.filter((r) => {
      const matchesGroup = recognitionTab === 'all' || r.group === recognitionTab;
      const matchesCountry = countryFilter === 'all' || r.country === countryFilter;
      return matchesGroup && matchesCountry;
    });
  }, [recognitionTab, countryFilter]);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('ak6358404@gmail.com');
      setEmailCopied(true);
      window.setTimeout(() => setEmailCopied(false), 2200);
    } catch {
      window.location.href = 'mailto:ak6358404@gmail.com';
    }
  };

  const handleCopyBibtex = async (item: (typeof RESEARCH_PUBLICATIONS)[number]) => {
    const bibtex = buildResearchBibtex(item);
    try {
      await navigator.clipboard.writeText(bibtex);
      setCopiedBibtexId(item.id);
      window.setTimeout(() => {
        setCopiedBibtexId((prev) => (prev === item.id ? null : prev));
      }, 2200);
    } catch {
      // Clipboard blocked in restricted frames
    }
  };

  const handleAskAi = (prompt: string, persona: AiPersonaId = 'guide') => {
    setAiMounted(true);
    setAiLaunch({ prompt, persona, tab: 'chat', nonce: Date.now() });
    setAiOpen(true);
  };

  const handleLaunchAudioBrief = (
    target: { kind: 'overview' | 'project' | 'paper'; id?: string } = { kind: 'overview' }
  ) => {
    setAiMounted(true);
    setAiLaunch({ tab: 'voicebrief', autoBriefTarget: target, nonce: Date.now() });
    setAiOpen(true);
  };

  const handleInsertIntoContact = (message: string, topic?: string) => {
    setContactDraft({ message, topic, nonce: Date.now() });
    const contactEl = document.getElementById('contact');
    contactEl?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  return (
    <div
      id="top"
      className={`min-h-screen bg-[#FCFBF8] text-[#171C28] transition-colors duration-200 dark:bg-[#090D18] dark:text-[#EEF1F7] ${
        effectiveMotionPaused ? 'motion-paused' : ''
      }`}
    >
      {/* Full-screen animated anime cinema background reel (Research & Japan Interview) */}
      <AnimeBackgroundReel activeIndex={activeScene} paused={effectiveMotionPaused} />

      {/* Live 60fps falling & cursor-following sakura petals + Makoto Shinkai light motes */}
      <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden no-print">
        <SakuraVideoCanvas paused={effectiveMotionPaused} darkMode={darkMode} variant="viewport" />
      </div>

      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-30 border-b border-[#E6DFD5]/75 bg-[#FCFBF8]/74 backdrop-blur-lg dark:border-white/12 dark:bg-[#090D18]/72 no-print">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-8 px-6 py-3.5">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            className="font-display text-lg font-bold tracking-tight text-[#171C28] transition-colors hover:text-[#C83E4D] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C83E4D] dark:text-[#EEF1F7] dark:hover:text-[#F47292] whitespace-nowrap shrink-0"
          >
            Ashish Kumar
          </a>

          {/* Zone 2: 5 concise single-line text navigation links with active scroll-spy */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-[#4C566A] dark:text-[#A9B5CA]"
          >
            {[
              { id: 'projects', href: '#projects', label: t.nav.projects },
              { id: 'research', href: '#research', label: t.nav.research },
              { id: 'experience', href: '#experience', label: t.nav.experience },
              { id: 'recognition', href: '#recognition', label: t.nav.recognition },
              { id: 'contact', href: '#contact', label: t.nav.contact },
            ].map((item) => {
              const isActive = activeNavSection === item.id;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'location' : undefined}
                  className={`relative py-1 transition-colors duration-150 after:absolute after:inset-x-0 after:bottom-0 after:h-[1.5px] after:origin-left after:bg-[#C83E4D] after:transition-transform after:duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C83E4D] dark:after:bg-[#F47292] whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'text-[#171C28] after:scale-x-100 dark:text-[#F3F6FC]'
                      : 'hover:text-[#171C28] after:scale-x-0 hover:after:scale-x-100 dark:hover:text-[#EEF1F7]'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Zone 3: Single primary action (+ compact mobile drawer trigger only below md) */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setCvOpen(true)}
              className="rounded-lg bg-[#C83E4D] px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-[#C83E4D]/25 transition-all duration-150 hover:bg-[#B23342] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C83E4D] dark:bg-[#E14B67] dark:shadow-[#E14B67]/25 dark:hover:bg-[#CC3D58] whitespace-nowrap shrink-0"
            >
              {t.nav.viewCv}
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E6DFD5] text-[#171C28] md:hidden dark:border-[#25314B] dark:text-[#EEF1F7]"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Hairline scroll reading progress bar */}
        <motion.div
          aria-hidden="true"
          style={{ scaleX: readingProgress }}
          className="h-[2px] origin-left bg-gradient-to-r from-[#C83E4D] via-[#F07A96] to-[#F7B2C4] dark:from-[#E14B67] dark:via-[#F47292] dark:to-[#FFD0DE]"
        />

        {/* Mobile dropdown navigation */}
        {mobileMenuOpen && (
          <nav
            aria-label="Mobile navigation"
            className="border-t border-[#E6DFD5] bg-[#FCFBF8]/95 px-6 py-4 backdrop-blur-xl md:hidden dark:border-[#1E2840] dark:bg-[#090D18]/95"
          >
            <div className="flex flex-col gap-3 text-sm font-medium text-[#2F3748] dark:text-[#D5DCE8]">
              {[
                { href: '#projects', label: t.nav.projects },
                { href: '#research', label: t.nav.research },
                { href: '#experience', label: t.nav.experience },
                { href: '#recognition', label: t.nav.recognition },
                { href: '#contact', label: t.nav.contact },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1.5 hover:text-[#C83E4D] dark:hover:text-[#F47292]"
                >
                  {item.label}
                </a>
              ))}
              <div className="border-t border-[#E6DFD5] pt-3 dark:border-white/10">
                <LanguageSwitcher
                  language={language}
                  onChange={(nextLang) => {
                    handleLanguageChange(nextLang);
                    setMobileMenuOpen(false);
                  }}
                  variant="bar"
                />
              </div>
            </div>
          </nav>
        )}
      </header>

      <main className="relative z-20">
        {/* HERO SECTION — Dedicated Top Language Utility Bar (First-Fixation Human Factors Placement) + Split-Screen Monograph */}
        <section className="mx-auto max-w-[1200px] px-6 pt-6 pb-14 lg:pt-8 lg:pb-16">
          <div className="mb-6 no-print">
            <LanguageSwitcher
              language={language}
              onChange={handleLanguageChange}
              variant="bar"
            />
          </div>

          <div className="grid gap-10 lg:grid-cols-12 lg:items-stretch lg:gap-12">
            {/* Left Column: Typographic Hierarchy & Primary Action inside clean translucent glass plate */}
            <div className="flex flex-col justify-between rounded-2xl border border-[#E6DFD5]/75 bg-[#FCFBF8]/76 p-6 backdrop-blur-md sm:p-8 lg:col-span-6 dark:border-white/12 dark:bg-[#090E1B]/68">
              <div>
                <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-[#525C6E] dark:text-[#A3B0C7]">
                  <span className="font-semibold text-[#C83E4D] dark:text-[#F47292]">
                    {t.hero.role}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{t.hero.degree}</span>
                  <span aria-hidden="true">·</span>
                  <span>{t.hero.domains}</span>
                </p>

                <h1
                  className="mt-4 font-display font-bold tracking-tight text-[#171C28] dark:text-[#F3F6FC] [text-wrap:balance]"
                  style={{
                    fontSize: 'clamp(2.35rem, 4.2vw, 3.75rem)',
                    lineHeight: 1.06,
                  }}
                >
                  {t.hero.headlineStart}{' '}
                  <span className="bg-gradient-to-r from-[#C83E4D] via-[#D94D68] to-[#9E2B42] bg-clip-text text-transparent dark:from-[#FFA3BC] dark:via-[#F47292] dark:to-[#FFD2DE]">
                    {t.hero.headlineAccent}
                  </span>
                </h1>

                <p className="mt-6 max-w-[58ch] text-[15.5px] leading-[1.72] text-[#3B4456] dark:text-[#C5CFE0]">
                  {t.hero.bio}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3.5">
                  <a
                    href="#projects"
                    className="group inline-flex items-center gap-2 rounded-lg bg-[#171C28] px-5 py-2.5 text-sm font-semibold text-[#FCFBF8] shadow-md shadow-black/10 transition-all duration-150 hover:-translate-y-0.5 hover:bg-[#C83E4D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C83E4D] dark:bg-[#F3F6FC] dark:text-[#090D18] dark:shadow-black/30 dark:hover:bg-[#F47292] dark:hover:text-[#090D18] whitespace-nowrap shrink-0"
                  >
                    <span>{t.hero.exploreProjects}</span>
                    <ArrowUpRight
                      className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </a>
                  <a
                    href="mailto:ak6358404@gmail.com"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#D8CFC2] bg-[#FCFBF8]/80 px-4 py-2.5 text-sm font-medium text-[#171C28] backdrop-blur-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-[#C83E4D] hover:text-[#C83E4D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C83E4D] dark:border-[#283552] dark:bg-[#111829]/75 dark:text-[#EEF1F7] dark:hover:border-[#F47292] dark:hover:text-[#F47292] whitespace-nowrap shrink-0"
                  >
                    <span>{t.hero.emailMe}</span>
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                  <a
                    href="https://github.com/Ashish11828"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2 py-2 text-sm font-medium text-[#4C566A] transition-colors hover:text-[#171C28] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C83E4D] dark:text-[#A3B0C7] dark:hover:text-[#EEF1F7] whitespace-nowrap shrink-0"
                  >
                    <span>GitHub</span>
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </div>

                {/* Crisp unboxed Open-To Target Opportunities Line */}
                <p className="mt-6 text-xs leading-relaxed text-[#4C566A] dark:text-[#B5C0D4]">
                  <span className="font-semibold text-[#C83E4D] dark:text-[#F47292]">
                    {extra.openToLabel}
                  </span>
                  <span aria-hidden="true" className="mx-1.5 text-[#8A94A6]">
                    ·
                  </span>
                  <span>{extra.openToText}</span>
                </p>

                {/* Unboxed 10-Country International Footprint Strip above the fold */}
                <div className="mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-2 text-xs text-[#525C6E] dark:text-[#9FAAC0]">
                  <span className="font-medium text-[#2F3748] dark:text-[#D5DCE8]">
                    {t.hero.footprint}
                  </span>
                  <span aria-hidden="true">·</span>
                  <div className="flex flex-wrap items-center gap-1.5" aria-label="Countries represented in research and programmes">
                    {GLOBAL_COUNTRIES.map((code) => (
                      <a
                        key={code}
                        href="#recognition"
                        onClick={() => {
                          setRecognitionTab('all');
                          setCountryFilter(code);
                        }}
                        title={getLocalizedCountryName(code, language)}
                        className="inline-flex items-center rounded-sm p-0.5 transition-transform duration-150 hover:-translate-y-0.5 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C83E4D]"
                      >
                        <CountryFlag code={code} className="h-[13px] w-[19px]" decorative={false} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Clean Hero Atmosphere & Audio Controls (separated from top Language Bar per Gestalt proximity) */}
              <div className="mt-8 flex flex-wrap items-center gap-2.5 border-t border-[#E6DFD5]/90 pt-5 dark:border-[#1E2840]">
                <button
                  type="button"
                  onClick={() => setDarkMode((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#E2DACD] bg-[#FFFFFF]/85 px-3 py-2 text-xs font-medium text-[#2F3748] backdrop-blur-sm transition-colors duration-150 hover:border-[#C83E4D]/60 hover:text-[#171C28] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C83E4D] dark:border-[#25314B] dark:bg-[#12192A]/85 dark:text-[#DCE3F0] dark:hover:border-[#F47292]/60 whitespace-nowrap shrink-0"
                >
                  {darkMode ? (
                    <>
                      <Sun className="h-3.5 w-3.5 text-[#F7B2C4]" aria-hidden="true" />
                      <span>{t.hero.daylightMode}</span>
                    </>
                  ) : (
                    <>
                      <Moon className="h-3.5 w-3.5 text-[#C83E4D]" aria-hidden="true" />
                      <span>{t.hero.twilightMode}</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setMotionPaused((prev) => !prev)}
                  aria-pressed={motionPaused}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#E2DACD] bg-[#FFFFFF]/85 px-3 py-2 text-xs font-medium text-[#2F3748] backdrop-blur-sm transition-colors duration-150 hover:border-[#C83E4D]/60 hover:text-[#171C28] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C83E4D] dark:border-[#25314B] dark:bg-[#12192A]/85 dark:text-[#DCE3F0] dark:hover:border-[#F47292]/60 whitespace-nowrap shrink-0"
                >
                  {motionPaused ? (
                    <>
                      <Play className="h-3.5 w-3.5 text-[#C83E4D] dark:text-[#F47292]" aria-hidden="true" />
                      <span>{t.hero.playReel}</span>
                    </>
                  ) : (
                    <>
                      <Pause className="h-3.5 w-3.5 text-[#C83E4D] dark:text-[#F47292]" aria-hidden="true" />
                      <span>{t.hero.pauseReel}</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleLaunchAudioBrief({ kind: 'overview' })}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#E2DACD] bg-[#FFFFFF]/85 px-3 py-2 text-xs font-medium text-[#2F3748] backdrop-blur-sm transition-colors duration-150 hover:border-[#C83E4D]/60 hover:text-[#C83E4D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C83E4D] dark:border-[#25314B] dark:bg-[#12192A]/85 dark:text-[#DCE3F0] dark:hover:border-[#F47292]/60 dark:hover:text-[#FFA3BC] whitespace-nowrap shrink-0"
                >
                  <Headphones className="h-3.5 w-3.5 text-[#C83E4D] dark:text-[#F47292]" aria-hidden="true" />
                  <span>{t.hero.audioBio}</span>
                </button>
              </div>
            </div>

            {/* Right Column: Synchronized Animated Focus Areas Anime Reel Player */}
            <div className="lg:col-span-6">
              <div className="group/reel relative flex h-full min-h-[380px] flex-col justify-end overflow-hidden rounded-2xl border border-[#DFD6C9] bg-[#0B0F1A] shadow-2xl shadow-[#171C28]/12 ring-1 ring-white/15 dark:border-[#2A3756] dark:shadow-black/50 lg:min-h-[500px]">
                {ANIME_REEL_SCENES.map((scene, idx) => {
                  if (!loadedScenes.has(idx)) return null;
                  const isActive = idx === activeScene;
                  return (
                    <div
                      key={scene.id}
                      aria-hidden={!isActive}
                      className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${
                        isActive ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <img
                        src={scene.src}
                        alt={scene.alt}
                        referrerPolicy="no-referrer"
                        decoding="async"
                        fetchPriority={idx === 0 ? 'high' : 'low'}
                        className={`h-full w-full object-cover contrast-[1.04] saturate-[1.08] ${
                          isActive ? scene.motionClass : ''
                        }`}
                      />
                    </div>
                  );
                })}

                {/* Subtle warm golden-hour rim light bloom over cinema plate */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-[3] bg-[radial-gradient(circle_at_80%_16%,rgba(255,214,227,0.22),transparent_48%)]"
                />

                {/* Domain-specific live Focus Area kinetic SVG animation */}
                <FocusAreaMotionOverlay
                  focusKey={currentScene.focusKey}
                  paused={effectiveMotionPaused}
                />

                {/* Anime film-frame corner viewfinder ticks */}
                <div aria-hidden="true" className="pointer-events-none absolute inset-3.5 z-[6]">
                  <span className="absolute top-0 left-0 h-3.5 w-3.5 border-t border-l border-white/45" />
                  <span className="absolute top-0 right-0 h-3.5 w-3.5 border-t border-r border-white/45" />
                  <span className="absolute bottom-0 left-0 h-3.5 w-3.5 border-b border-l border-white/30" />
                  <span className="absolute bottom-0 right-0 h-3.5 w-3.5 border-b border-r border-white/30" />
                </div>

                {/* Live falling & cursor-following sakura petals directly inside the Hero anime video frame */}
                <div className="pointer-events-none absolute inset-0 z-[5]">
                  <SakuraVideoCanvas paused={effectiveMotionPaused} darkMode={darkMode} variant="player" />
                </div>

                {/* Measured bottom scrim ensuring > 7:1 contrast for Focus Area caption & controls */}
                <div className="relative z-10 bg-gradient-to-t from-[#070B14]/95 via-[#070B14]/65 to-transparent p-6 pt-24 text-white">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-white/85">
                      <span className="inline-flex items-center gap-1.5 text-[#FFB5C8]">
                        <DomainSymbol kind={currentScene.focusKey} className="h-3.5 w-3.5" />
                        <span className="tabular-nums">
                          {t.hero.focusWord} {currentScene.index} / 0{ANIME_REEL_SCENES.length}
                        </span>
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{currentScene.shortLabel}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-white/70">
                        {motionPaused ? t.hero.paused : t.hero.playing}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleStepScene(-1)}
                        aria-label="Previous focus area scene"
                        className="flex h-7 w-7 items-center justify-center rounded-md bg-white/12 text-white/90 transition-colors hover:bg-white/24 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFB5C8]"
                      >
                        <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStepScene(1)}
                        aria-label="Next focus area scene"
                        className="flex h-7 w-7 items-center justify-center rounded-md bg-white/12 text-white/90 transition-colors hover:bg-white/24 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFB5C8]"
                      >
                        <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentScene.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <p className="mt-2 font-display text-lg font-bold tracking-tight text-white sm:text-xl">
                        {currentScene.title}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-white/85">
                        {currentScene.caption}
                      </p>
                    </motion.div>
                  </AnimatePresence>

                  {/* Synchronized 6 Focus Area Selector Controls with Live Progress Fill */}
                  <div
                    role="tablist"
                    aria-label="Select focus area anime scene"
                    className="mt-4 grid grid-cols-3 gap-1.5"
                  >
                    {localizedReelScenes.map((scene, idx) => {
                      const active = idx === activeScene;
                      return (
                        <button
                          key={scene.id}
                          role="tab"
                          type="button"
                          aria-selected={active}
                          onClick={() => setActiveScene(idx)}
                          className={`relative overflow-hidden rounded-md px-2.5 py-2 text-left text-[11px] font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFB5C8] whitespace-nowrap ${
                            active
                              ? 'bg-white/22 text-white ring-1 ring-white/35'
                              : 'bg-white/10 text-white/75 hover:bg-white/18 hover:text-white'
                          }`}
                        >
                          <span className="relative z-10 flex items-center gap-1.5 truncate">
                            <DomainSymbol
                              kind={scene.focusKey}
                              className={`h-3 w-3 shrink-0 ${
                                active ? 'text-[#FFB5C8]' : 'text-white/70'
                              }`}
                            />
                            <span className="truncate">
                              {scene.index}. {scene.shortLabel}
                            </span>
                          </span>
                          {/* Live hairline progress track at bottom of active scene tab */}
                          <span
                            aria-hidden="true"
                            className="absolute inset-x-0 bottom-0 h-[2px] bg-white/15"
                          >
                            {active && (
                              <span
                                key={`${activeScene}-${motionPaused ? 'p' : 'r'}`}
                                className="scene-progress-bar block h-full w-full bg-[#FFB5C8]"
                              />
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Full-Width 4-Column Proof Strip directly below the Hero split */}
          <div className="mt-10 grid grid-cols-2 divide-y divide-[#E6DFD5]/75 overflow-hidden rounded-2xl border border-[#E6DFD5]/75 bg-[#FFFFFF]/76 backdrop-blur-md sm:divide-y-0 lg:grid-cols-4 lg:divide-x dark:divide-white/10 dark:border-white/12 dark:bg-[#090E1B]/70">
            {PROOF_METRICS.map((metric, idx) => {
              const loc = t.metrics[idx];
              const locValue = METRIC_VALUES_BY_LANG[language]?.[idx] ?? metric.value;
              return (
                <div
                  key={metric.label}
                  className="space-y-1 p-5 transition-colors duration-150 hover:bg-[#FCFBF8]/80 sm:p-6 dark:hover:bg-[#131B2E]/75"
                >
                  <p className="font-display text-2xl font-bold tracking-tight tabular-nums text-[#171C28] sm:text-3xl dark:text-[#F3F6FC]">
                    {locValue}
                  </p>
                  <p className="text-sm font-semibold text-[#C83E4D] dark:text-[#F47292]">
                    {loc?.label ?? metric.label}
                  </p>
                  <p className="text-xs text-[#525C6E] dark:text-[#9CA8BE]">
                    {loc?.detail ?? metric.detail}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Subtle Editorial Marquee Ribbon Divider */}
        <div
          aria-hidden="true"
          className="overflow-hidden border-y border-[#E6DFD5]/65 bg-[#FCFBF8]/58 py-3 backdrop-blur-sm dark:border-white/10 dark:bg-[#090E1B]/58"
        >
          <div className="marquee-track flex w-max items-center gap-8 text-xs font-medium tracking-wide text-[#3B4456] dark:text-[#C5CFE0]">
            {[...t.marquee, ...t.marquee].map((term, index) => (
              <span key={`${term}-${index}`} className="flex items-center gap-8 whitespace-nowrap">
                <span>{term}</span>
                <span className="text-[#C83E4D] dark:text-[#F47292]">·</span>
              </span>
            ))}
          </div>
        </div>

        {/* 01. SELECTED PROJECTS — Complete 7-Card Media-First Anime Bento Grid */}
        <section id="projects" className="section-defer mx-auto max-w-[1200px] px-6 py-16 lg:py-20">
          <div className="flex flex-col gap-5 rounded-2xl border border-[#E6DFD5]/75 bg-[#FCFBF8]/76 p-5 backdrop-blur-md sm:flex-row sm:items-end sm:justify-between sm:px-6 dark:border-white/12 dark:bg-[#090E1B]/68">
            <div>
              <p className="text-xs font-semibold text-[#C83E4D] dark:text-[#F47292]">
                {t.sections.projectsEyebrow}
              </p>
              <h2 className="mt-1.5 font-display text-2xl font-bold tracking-tight text-[#171C28] sm:text-3xl dark:text-[#F3F6FC] [text-wrap:balance]">
                {t.sections.projectsTitle}
              </h2>
            </div>

            {/* Interactive Segmented Filter Tabs with smooth sliding indicator */}
            <div
              role="tablist"
              aria-label="Filter projects by discipline"
              className="flex flex-wrap items-center gap-1 rounded-xl border border-[#E6DFD5] bg-[#F5F1EA]/90 p-1 backdrop-blur-md dark:border-[#24304B] dark:bg-[#101626]/90"
            >
              {PROJECT_FILTERS.map((tab) => {
                const active = projectFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    role="tab"
                    type="button"
                    aria-selected={active}
                    onClick={() => setProjectFilter(tab.id)}
                    className={`relative rounded-lg px-3.5 py-2 text-xs font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C83E4D] whitespace-nowrap shrink-0 ${
                      active
                        ? 'text-[#171C28] dark:text-[#F3F6FC]'
                        : 'text-[#525C6E] hover:text-[#171C28] dark:text-[#9CA8BE] dark:hover:text-[#EEF1F7]'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="projectFilterActive"
                        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                        className="absolute inset-0 rounded-lg bg-[#FFFFFF] shadow-xs dark:bg-[#222D48]"
                      />
                    )}
                    <span className="relative z-10">{t.projectFilters[tab.id]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((rawProject, projectIndex) => {
              const project = getLocalizedProject(rawProject, language);
              const isHeroTile = projectFilter === 'all' && project.featured;
              const projectArtMotionClass = `project-art-${(projectIndex % 4) + 1}`;

              if (isHeroTile && project.image) {
                return (
                  <article
                    key={project.id}
                    className="group relative overflow-hidden rounded-2xl border border-[#DFD6C9] bg-[#101626] shadow-lg shadow-black/5 transition-all duration-200 hover:-translate-y-1 hover:border-[#C83E4D]/60 md:col-span-2 dark:border-[#25324E] dark:shadow-black/30 dark:hover:border-[#F47292]/60"
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedProject(rawProject)}
                      className="block h-full w-full text-left focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#C83E4D]"
                    >
                      <div className="relative aspect-[16/10] w-full sm:aspect-[16/9] lg:h-full lg:min-h-[390px]">
                        <ArtworkFrame
                          src={project.image}
                          alt={project.imageAlt ?? project.title}
                          title={project.title}
                          className="h-full w-full"
                          imgClassName={project.id === 'mixhai-xr' ? '' : `transition-transform duration-500 ease-out group-hover:scale-[1.04] ${projectArtMotionClass}`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#070B14]/94 via-[#070B14]/45 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 text-white">
                          <div className="flex flex-wrap items-center gap-2 text-xs text-white/85">
                            <span className="font-semibold text-[#FFB5C8]">
                              {project.categoryLabel}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono tabular-nums">{project.year}</span>
                            {project.venue && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span className="inline-flex items-center gap-1.5">
                                  {project.country && (
                                    <CountryFlag code={project.country} className="h-[12px] w-[18px]" />
                                  )}
                                  <span>{project.venue}</span>
                                </span>
                              </>
                            )}
                          </div>
                          <div className="mt-2.5 flex flex-wrap items-center gap-2.5">
                            {project.symbols.map((sym) => (
                              <OrgSymbol key={sym.alt} symbol={sym} size="sm" />
                            ))}
                            <h3 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                              {project.title}
                            </h3>
                          </div>
                          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/88">
                            {project.summary}
                          </p>
                          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-4 text-xs">
                            <span className="text-white/75">
                              {project.stack.slice(0, 4).join(' · ')}
                            </span>
                            <span className="inline-flex items-center gap-1 font-semibold text-white group-hover:text-[#FFB5C8] transition-colors whitespace-nowrap shrink-0">
                              <span>{t.sections.inspectProject}</span>
                              <ArrowUpRight
                                className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                aria-hidden="true"
                              />
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  </article>
                );
              }

              return (
                <article
                  key={project.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-[#E6DFD5]/80 bg-[#FFFFFF]/78 backdrop-blur-md transition-all duration-200 hover:-translate-y-1 hover:border-[#C83E4D]/55 hover:shadow-xl hover:shadow-[#171C28]/6 dark:border-white/12 dark:bg-[#0B1020]/74 dark:hover:border-[#F47292]/55 dark:hover:shadow-black/40"
                >
                  <button
                    type="button"
                    onClick={() => setSelectedProject(rawProject)}
                    className="flex h-full flex-col text-left focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#C83E4D]"
                  >
                    {project.image && (
                      <div className="relative overflow-hidden border-b border-[#E6DFD5]/90 dark:border-[#222E48]">
                        <ArtworkFrame
                          src={project.image}
                          alt={project.imageAlt ?? project.title}
                          title={project.title}
                          className="aspect-[4/3] w-full"
                          imgClassName={project.id === 'mixhai-xr' ? '' : `transition-transform duration-500 ease-out group-hover:scale-[1.05] ${projectArtMotionClass}`}
                        />
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/25 to-transparent opacity-80 transition-opacity duration-200 group-hover:opacity-40"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex items-center gap-2 text-xs text-[#525C6E] dark:text-[#9CA8BE]">
                        <span className="font-semibold text-[#C83E4D] dark:text-[#F47292]">
                          {project.categoryLabel}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">{project.year}</span>
                      </div>

                      <div className="mt-2.5 flex items-center gap-2.5">
                        {project.symbols.map((sym) => (
                          <OrgSymbol key={sym.alt} symbol={sym} size="sm" />
                        ))}
                        <h3 className="font-display text-xl font-bold tracking-tight text-[#171C28] group-hover:text-[#C83E4D] transition-colors dark:text-[#F3F6FC] dark:group-hover:text-[#FFA3BC]">
                          {project.title}
                        </h3>
                      </div>

                      <p className="mt-2.5 flex-1 text-sm leading-relaxed text-[#4C566A] dark:text-[#B5C0D4]">
                        {project.summary}
                      </p>

                      {project.venue && (
                        <p className="mt-3 flex items-center gap-2 text-xs font-medium text-[#2F3748] dark:text-[#DCE3F0]">
                          {project.country && (
                            <CountryFlag code={project.country} className="h-[12px] w-[18px]" />
                          )}
                          <span>{project.venue}</span>
                        </p>
                      )}

                      <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#EFEAE1] pt-4 text-xs dark:border-[#1E2840]">
                        <span className="truncate text-[#5A6476] dark:text-[#94A1B8]">
                          {project.stack.slice(0, 3).join(' · ')}
                        </span>
                        <span className="inline-flex items-center gap-1 font-semibold text-[#171C28] group-hover:text-[#C83E4D] dark:text-[#EEF1F7] dark:group-hover:text-[#FFA3BC] whitespace-nowrap shrink-0">
                          <span>{t.sections.details}</span>
                          <ArrowUpRight
                            className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            aria-hidden="true"
                          />
                        </span>
                      </div>
                    </div>
                  </button>
                </article>
              );
            })}
          </div>
        </section>

        {/* 02. RESEARCH & PUBLICATIONS */}
        <section id="research" className="section-defer mx-auto max-w-[1200px] px-6 py-14 lg:py-16">
          <div className="rounded-2xl border border-[#E6DFD5]/75 bg-[#FCFBF8]/78 p-6 backdrop-blur-md sm:p-8 dark:border-white/12 dark:bg-[#090E1B]/72">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold text-[#C83E4D] dark:text-[#F47292]">
                  {t.sections.researchEyebrow}
                </p>
                <h2 className="mt-1.5 font-display text-2xl font-bold tracking-tight text-[#171C28] sm:text-3xl dark:text-[#F3F6FC] [text-wrap:balance]">
                  {t.sections.researchTitle}
                </h2>
              </div>
              <a
                href="https://share.google/NXxM2sSHaWVdn83kw"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#171C28] hover:text-[#C83E4D] transition-colors dark:text-[#EEF1F7] dark:hover:text-[#FFA3BC] whitespace-nowrap shrink-0"
              >
                <span>{t.sections.googleScholar}</span>
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </a>
            </div>

            <div className="mt-8 divide-y divide-[#E2DACD] border-t border-[#E2DACD] dark:divide-white/10 dark:border-white/10">
              {RESEARCH_PUBLICATIONS.map((rawItem) => {
                const item = getLocalizedResearch(rawItem, language);
                return (
                <article
                  key={item.id}
                  className="group -mx-4 grid gap-5 rounded-xl px-4 py-6 transition-colors duration-150 hover:bg-[#FFFFFF]/70 lg:grid-cols-12 lg:items-start lg:gap-7 dark:hover:bg-[#141D32]/70"
                >
                  <div className="lg:col-span-3">
                    <p className="flex items-center gap-2 font-mono text-sm font-medium tabular-nums text-[#171C28] dark:text-[#F3F6FC]">
                      <CountryFlag code={item.country} className="h-[13px] w-[20px]" />
                      <span>{item.venue}</span>
                    </p>
                    <p className="mt-1 pl-[28px] text-xs text-[#525C6E] dark:text-[#9CA8BE]">
                      {item.location}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2 pl-[28px]">
                      {item.symbols.map((sym) => (
                        <OrgSymbol key={sym.alt} symbol={sym} />
                      ))}
                    </div>
                    <div className="pl-0 sm:pl-[28px]">
                      <ResearchPaperAnimation paperId={item.id} paused={effectiveMotionPaused} />
                    </div>
                  </div>

                  <div className="lg:col-span-6">
                    <h3 className="font-display text-lg font-bold leading-snug text-[#171C28] group-hover:text-[#C83E4D] transition-colors dark:text-[#F3F6FC] dark:group-hover:text-[#FFA3BC]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#4C566A] dark:text-[#B5C0D4]">
                      {item.summary}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 lg:col-span-3 lg:flex-col lg:items-end lg:text-right">
                    <div>
                      <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#171C28] dark:text-[#EEF1F7]">
                        {item.kind === 'paper' ? (
                          <BookOpen
                            className="h-3.5 w-3.5 text-[#C83E4D] dark:text-[#F47292]"
                            aria-hidden="true"
                          />
                        ) : (
                          <CheckCircle2
                            className="h-3.5 w-3.5 text-[#2E8B6E] dark:text-[#57B894]"
                            aria-hidden="true"
                          />
                        )}
                        <span>{item.status}</span>
                      </p>
                      {item.dateNote && (
                        <p className="mt-0.5 text-xs text-[#525C6E] dark:text-[#9CA8BE]">
                          {item.dateNote}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 lg:flex-col lg:items-end">
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#C83E4D] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C83E4D] dark:text-[#FFA3BC] whitespace-nowrap shrink-0"
                      >
                        <span>{item.linkLabel}</span>
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                      <div className="flex flex-wrap items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => void handleCopyBibtex(rawItem)}
                          className="inline-flex items-center gap-1.5 rounded-md border border-[#E2DACD] bg-[#FFFFFF]/80 px-2.5 py-1 text-[11.5px] font-medium text-[#2F3748] transition-colors hover:border-[#C83E4D]/60 hover:text-[#C83E4D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C83E4D] dark:border-white/14 dark:bg-[#131C32]/80 dark:text-[#DCE3F0] dark:hover:border-[#F47292]/60 dark:hover:text-[#FFA3BC] whitespace-nowrap shrink-0"
                        >
                          {copiedBibtexId === item.id ? (
                            <>
                              <Check className="h-3 w-3 text-[#2E8B6E] dark:text-[#57B894]" aria-hidden="true" />
                              <span>{extra.bibtexCopied}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3 text-[#697386] dark:text-[#9CA8BE]" aria-hidden="true" />
                              <span>{extra.copyBibtex}</span>
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleAskAi(extra.askPaperPrompt(item.venue, item.title), 'guide')
                          }
                          className="inline-flex items-center gap-1.5 rounded-md border border-[#E2DACD] bg-[#FFFFFF]/80 px-2.5 py-1 text-[11.5px] font-medium text-[#2F3748] transition-colors hover:border-[#C83E4D]/60 hover:text-[#C83E4D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C83E4D] dark:border-white/14 dark:bg-[#131C32]/80 dark:text-[#DCE3F0] dark:hover:border-[#F47292]/60 dark:hover:text-[#FFA3BC] whitespace-nowrap shrink-0"
                        >
                          <Sparkles className="h-3 w-3 text-[#C83E4D] dark:text-[#F47292]" aria-hidden="true" />
                          <span>{t.sections.explainWithAi}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* 03. EXPERIENCE & TECHNICAL CRAFT */}
        <section id="experience" className="section-defer mx-auto max-w-[1200px] px-6 py-16 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
            {/* Left 7 Columns: Experience Chronology with crisp hairline timeline */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-[#E6DFD5]/75 bg-[#FCFBF8]/76 px-5 py-4 backdrop-blur-md dark:border-white/12 dark:bg-[#090E1B]/68">
                <p className="text-xs font-semibold text-[#C83E4D] dark:text-[#F47292]">
                  {t.sections.experienceEyebrow}
                </p>
                <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-[#171C28] sm:text-3xl dark:text-[#F3F6FC]">
                  {t.sections.experienceTitle}
                </h2>
              </div>

              <ol className="relative mt-6 space-y-5 before:absolute before:top-3 before:bottom-3 before:left-[5px] before:w-px before:bg-[#DDD4C7] dark:before:bg-white/20">
                {EXPERIENCES.map((rawExp) => {
                  const exp = getLocalizedExperience(rawExp, language);
                  return (
                  <li key={exp.id} className="relative pl-8">
                    <span
                      aria-hidden="true"
                      className="absolute top-6 left-0 h-[11px] w-[11px] rounded-full border-2 border-[#C83E4D] bg-[#FCFBF8] dark:border-[#F47292] dark:bg-[#090D18]"
                    />
                    <div className="rounded-2xl border border-[#E6DFD5]/78 bg-[#FFFFFF]/78 p-5 backdrop-blur-md transition-all duration-150 hover:border-[#C83E4D]/45 sm:p-6 dark:border-white/12 dark:bg-[#0B1020]/74 dark:hover:border-[#F47292]/45">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-mono text-xs font-semibold tabular-nums text-[#C83E4D] dark:text-[#F47292]">
                          {exp.period}
                        </span>
                        <span className="inline-flex items-center gap-2 text-xs text-[#525C6E] dark:text-[#9CA8BE]">
                          <CountryFlag code={exp.country} className="h-[13px] w-[20px]" />
                          <span>{exp.location}</span>
                        </span>
                      </div>

                      <div className="mt-2.5 flex flex-wrap items-center gap-2.5">
                        {exp.symbols.map((sym) => (
                          <OrgSymbol key={sym.alt} symbol={sym} />
                        ))}
                        <h3 className="font-display text-lg font-bold text-[#171C28] dark:text-[#F3F6FC]">
                          {exp.role}{' '}
                          <span className="font-normal text-[#525C6E] dark:text-[#9CA8BE]">·</span>{' '}
                          <a
                            href={exp.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 hover:text-[#C83E4D] transition-colors dark:hover:text-[#FFA3BC]"
                          >
                            <span>{exp.organization}</span>
                            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                          </a>
                        </h3>
                      </div>

                      <p className="mt-2.5 text-sm leading-relaxed text-[#4C566A] dark:text-[#B5C0D4]">
                        {exp.summary}
                      </p>

                      {exp.platform && (
                        <p className="mt-3 font-mono text-xs text-[#5A6476] dark:text-[#94A1B8]">
                          {exp.platform}
                        </p>
                      )}
                    </div>
                  </li>
                  );
                })}
              </ol>
            </div>

            {/* Right 5 Columns: Focus Areas, Interests & Technical Craft */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-[#E6DFD5]/78 bg-[#FFFFFF]/78 p-6 backdrop-blur-md sm:p-8 dark:border-white/12 dark:bg-[#0B1020]/74">
                <h3 className="font-display text-xl font-bold tracking-tight text-[#171C28] dark:text-[#F3F6FC]">
                  {t.sections.focusCraftTitle}
                </h3>
                <p className="mt-2 text-sm text-[#525C6E] dark:text-[#9CA8BE]">
                  {t.sections.focusCraftSubtitle}
                </p>

                <div className="mt-6 border-t border-[#EFEAE1] pt-5 dark:border-[#1E2840]">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-semibold text-[#C83E4D] dark:text-[#F47292]">
                      {t.sections.primaryFocus}
                    </h4>
                    <span className="text-[11px] text-[#697386] dark:text-[#8E9BB2]">
                      {t.sections.clickSwitchReel}
                    </span>
                  </div>
                  <div className="mt-3.5 grid grid-cols-2 gap-2.5">
                    {FOCUS_AREAS.map((area, idx) => {
                      const isActive = activeScene === idx;
                      const locArea =
                        language === 'en' || language === 'en-US'
                          ? area
                          : FOCUS_AREAS_BY_LANG[language]?.[idx] ?? area;
                      return (
                        <button
                          key={area.label}
                          type="button"
                          onClick={() => setActiveScene(idx)}
                          aria-pressed={isActive}
                          className={`flex items-start gap-2.5 rounded-xl border p-2.5 text-left transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C83E4D] ${
                            isActive
                              ? 'border-[#C83E4D]/60 bg-[#C83E4D]/8 dark:border-[#F47292]/60 dark:bg-[#F47292]/12'
                              : 'border-transparent hover:border-[#E2DACD] hover:bg-[#FCFBF8]/70 dark:hover:border-white/12 dark:hover:bg-white/5'
                          }`}
                        >
                          <span className="mt-0.5 text-[#C83E4D] dark:text-[#F47292] shrink-0">
                            <DomainSymbol kind={area.icon} className="h-4 w-4" />
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-[#171C28] dark:text-[#F3F6FC]">
                              {locArea.label}
                            </p>
                            <p className="text-xs text-[#525C6E] dark:text-[#9CA8BE]">
                              {locArea.detail}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-6 border-t border-[#EFEAE1] pt-5 dark:border-[#1E2840]">
                  <h4 className="text-xs font-semibold text-[#C83E4D] dark:text-[#F47292]">
                    {t.sections.researchInterests}
                  </h4>
                  <ul className="mt-3 space-y-2.5">
                    {RESEARCH_INTERESTS.map((interest, idx) => {
                      const locInterest =
                        language === 'en' || language === 'en-US'
                          ? interest
                          : RESEARCH_INTERESTS_BY_LANG[language]?.[idx] ?? interest;
                      return (
                      <li key={interest.label} className="flex items-center gap-2.5 text-sm">
                        <span className="text-[#C83E4D] dark:text-[#F47292] shrink-0">
                          <DomainSymbol kind={interest.icon} className="h-3.5 w-3.5" />
                        </span>
                        <span className="font-semibold text-[#171C28] dark:text-[#F3F6FC]">
                          {locInterest.label}
                        </span>
                        <span aria-hidden="true" className="text-[#525C6E] dark:text-[#9CA8BE]">
                          ·
                        </span>
                        <span className="text-xs text-[#4C566A] dark:text-[#B5C0D4]">
                          {locInterest.detail}
                        </span>
                      </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="mt-6 space-y-4 border-t border-[#EFEAE1] pt-5 dark:border-[#1E2840]">
                  <h4 className="text-xs font-semibold text-[#C83E4D] dark:text-[#F47292]">
                    {t.sections.skillsMatrix}
                  </h4>
                  {localizedSkillGroups.map((group) => (
                    <div key={group.icon} className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#171C28] dark:text-[#F3F6FC]">
                          <span className="text-[#C83E4D] dark:text-[#F47292]">
                            <DomainSymbol kind={group.icon} className="h-3.5 w-3.5" />
                          </span>
                          <span>{group.category}</span>
                        </span>
                        <span className="text-xs text-[#697386] dark:text-[#8E9BB2]">
                          {group.subtitle}
                        </span>
                      </div>
                      <p className="pl-[22px] text-xs leading-relaxed text-[#4C566A] dark:text-[#B5C0D4]">
                        {group.items.join(' · ')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 04. RECOGNITION, GLOBAL SCHOOLS & EDUCATION */}
        <section id="recognition" className="section-defer mx-auto max-w-[1200px] px-6 py-14 lg:py-16">
          <div>
            <div className="rounded-2xl border border-[#E6DFD5]/75 bg-[#FCFBF8]/78 p-5 backdrop-blur-md sm:p-6 dark:border-white/12 dark:bg-[#090E1B]/72">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#C83E4D] dark:text-[#F47292]">
                    {t.sections.recognitionEyebrow}
                  </p>
                  <h2 className="mt-1.5 font-display text-2xl font-bold tracking-tight text-[#171C28] sm:text-3xl dark:text-[#F3F6FC]">
                    {t.sections.recognitionTitle}
                  </h2>
                </div>

                {/* Segmented Filter Tabs with smooth sliding active indicator */}
                <div
                  role="tablist"
                  aria-label="Filter recognition and education"
                  className="flex flex-wrap items-center gap-1 rounded-xl border border-[#E6DFD5] bg-[#FCFBF8]/90 p-1 backdrop-blur-md dark:border-[#24304B] dark:bg-[#101626]/90"
                >
                  {RECOGNITION_TABS.map((tab) => {
                    const active = recognitionTab === tab.id;
                    const count =
                      tab.id === 'all'
                        ? RECOGNITIONS.length
                        : RECOGNITIONS.filter((r) => r.group === tab.id).length;
                    return (
                      <button
                        key={tab.id}
                        role="tab"
                        type="button"
                        aria-selected={active}
                        onClick={() => setRecognitionTab(tab.id)}
                        className={`relative inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C83E4D] whitespace-nowrap shrink-0 ${
                          active
                            ? 'text-white dark:text-[#090D18]'
                            : 'text-[#525C6E] hover:text-[#171C28] dark:text-[#9CA8BE] dark:hover:text-[#EEF1F7]'
                        }`}
                      >
                        {active && (
                          <motion.span
                            layoutId="recognitionTabActive"
                            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                            className="absolute inset-0 rounded-lg bg-[#171C28] dark:bg-[#F3F6FC]"
                          />
                        )}
                        <span className="relative z-10">{t.recognitionTabs[tab.id]}</span>
                        <span
                          className={`relative z-10 font-mono text-[11px] tabular-nums ${
                            active ? 'opacity-80' : 'opacity-60'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Interactive Country Flags Filter Strip */}
              <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-2 border-t border-[#E2DACD] pt-4 text-xs dark:border-white/10">
                <span className="mr-2 font-semibold text-[#171C28] dark:text-[#EEF1F7]">
                  {t.sections.filterByCountry}
                </span>
                <button
                  type="button"
                  onClick={() => setCountryFilter('all')}
                  aria-pressed={countryFilter === 'all'}
                  className={`rounded-md px-2.5 py-1.5 font-medium transition-colors duration-150 whitespace-nowrap shrink-0 ${
                    countryFilter === 'all'
                      ? 'bg-[#C83E4D] text-white dark:bg-[#E14B67]'
                      : 'text-[#4C566A] hover:bg-[#EAE3D7] hover:text-[#171C28] dark:text-[#A3B0C7] dark:hover:bg-[#19233A] dark:hover:text-[#EEF1F7]'
                  }`}
                >
                  {t.sections.allWord} ({GLOBAL_COUNTRIES.length})
                </button>
                {GLOBAL_COUNTRIES.map((code) => {
                  const active = countryFilter === code;
                  return (
                    <button
                      key={code}
                      type="button"
                      onClick={() => setCountryFilter(active ? 'all' : code)}
                      aria-pressed={active}
                      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-medium transition-colors duration-150 whitespace-nowrap shrink-0 ${
                        active
                          ? 'bg-[#C83E4D] text-white dark:bg-[#E14B67]'
                          : 'text-[#4C566A] hover:bg-[#EAE3D7] hover:text-[#171C28] dark:text-[#A3B0C7] dark:hover:bg-[#19233A] dark:hover:text-[#EEF1F7]'
                      }`}
                    >
                      <CountryFlag code={code} className="h-[12px] w-[18px]" decorative={false} />
                      <span>{getLocalizedCountryName(code, language)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {filteredRecognitions.length === 0 ? (
              (() => {
                const matchingResearch =
                  countryFilter === 'all'
                    ? []
                    : RESEARCH_PUBLICATIONS.filter((pub) => pub.country === countryFilter).map(
                        (pub) => getLocalizedResearch(pub, language)
                      );
                return (
                  <div className="mt-8 rounded-2xl border border-[#E6DFD5]/80 bg-[#FFFFFF]/82 p-7 text-center backdrop-blur-md dark:border-white/12 dark:bg-[#0B1020]/78">
                    {matchingResearch.length > 0 ? (
                      <div className="mx-auto max-w-xl space-y-3">
                        <p className="text-sm text-[#4C566A] dark:text-[#B5C0D4]">
                          {t.sections.featuredUnderResearchBefore}{' '}
                          <span className="font-semibold text-[#171C28] dark:text-[#F3F6FC]">
                            {countryFilter !== 'all'
                              ? getLocalizedCountryName(countryFilter, language)
                              : ''}
                          </span>{' '}
                          {t.sections.featuredUnderResearchMid}{' '}
                          <span className="font-semibold text-[#C83E4D] dark:text-[#FFA3BC]">
                            {t.sections.researchTitle}
                          </span>
                          :
                        </p>
                        <ul className="space-y-2 text-left">
                          {matchingResearch.map((pub) => (
                            <li
                              key={pub.id}
                              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#E6DFD5] bg-[#FCFBF8]/90 px-4 py-3 text-xs dark:border-white/10 dark:bg-[#111829]/85"
                            >
                              <span className="inline-flex items-center gap-2 font-semibold text-[#171C28] dark:text-[#F3F6FC]">
                                <CountryFlag code={pub.country} className="h-[12px] w-[18px]" />
                                <span>
                                  {pub.venue} — {pub.title}
                                </span>
                              </span>
                              <span className="font-mono text-[#C83E4D] dark:text-[#FFA3BC]">
                                {pub.status}
                              </span>
                            </li>
                          ))}
                        </ul>
                        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                          <a
                            href="#research"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#C83E4D] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#B23342] dark:bg-[#E14B67] dark:hover:bg-[#CC3D58]"
                          >
                            <span>{t.sections.viewInResearch}</span>
                            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                          </a>
                          <button
                            type="button"
                            onClick={() => {
                              setRecognitionTab('all');
                              setCountryFilter('all');
                            }}
                            className="rounded-lg border border-[#D8CFC2] px-4 py-2 text-xs font-semibold text-[#171C28] transition-colors hover:border-[#C83E4D] hover:text-[#C83E4D] dark:border-white/15 dark:text-[#EEF1F7] dark:hover:border-[#F47292] dark:hover:text-[#FFA3BC]"
                          >
                            {t.sections.showAllRecognitions}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm text-[#4C566A] dark:text-[#B5C0D4]">
                          {t.sections.noRecognitionMatch}{' '}
                          <span className="font-semibold text-[#171C28] dark:text-[#F3F6FC]">
                            {countryFilter !== 'all'
                              ? getLocalizedCountryName(countryFilter, language)
                              : ''}
                          </span>
                          .
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setRecognitionTab('all');
                            setCountryFilter('all');
                          }}
                          className="mt-4 rounded-lg bg-[#C83E4D] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#B23342] dark:bg-[#E14B67] dark:hover:bg-[#CC3D58]"
                        >
                          {t.sections.showAllRecognitions}
                        </button>
                      </>
                    )}
                  </div>
                );
              })()
            ) : (
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {filteredRecognitions.map((rawItem) => {
                  const item = getLocalizedRecognition(rawItem, language);
                  return (
                  <article
                    key={item.id}
                    className="flex flex-col justify-between rounded-xl border border-[#E6DFD5]/78 bg-[#FFFFFF]/78 p-5 backdrop-blur-md transition-all duration-150 hover:-translate-y-0.5 hover:border-[#C83E4D]/50 hover:shadow-md hover:shadow-[#171C28]/5 dark:border-white/12 dark:bg-[#0B1020]/74 dark:hover:border-[#F47292]/50 dark:hover:shadow-black/30"
                  >
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span className="inline-flex items-center gap-2 font-mono tabular-nums text-[#525C6E] dark:text-[#9CA8BE]">
                          <CountryFlag code={item.country} className="h-[13px] w-[20px]" />
                          <span>{item.metaLeft}</span>
                        </span>
                        <span className="font-semibold text-[#C83E4D] tabular-nums dark:text-[#FFA3BC]">
                          {item.outcome}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-2.5">
                        {item.symbols.map((sym) => (
                          <OrgSymbol key={sym.alt} symbol={sym} />
                        ))}
                        <h3 className="font-display text-base font-bold text-[#171C28] dark:text-[#F3F6FC]">
                          {item.href ? (
                            <a
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 hover:text-[#C83E4D] transition-colors dark:hover:text-[#FFA3BC]"
                            >
                              <span>{item.title}</span>
                              <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                            </a>
                          ) : (
                            item.title
                          )}
                        </h3>
                      </div>

                      {item.description && (
                        <p className="mt-2 text-sm leading-relaxed text-[#4C566A] dark:text-[#B5C0D4]">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#EFEAE1] pt-3 text-xs text-[#697386] dark:border-[#1E2840] dark:text-[#8E9BB2]">
                      <span>{item.groupLabel}</span>
                      {item.tags && <span>{item.tags.join(' · ')}</span>}
                    </div>
                  </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* 05. WRITING, RESOURCES & FIND ME */}
        <section id="contact" className="section-defer mx-auto max-w-[1200px] px-6 py-16 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
            {/* Left 5 Columns: Writing & Learning Resources inside matching frosted glass surface */}
            <div className="lg:col-span-5">
              <div className="h-full rounded-2xl border border-[#E6DFD5]/78 bg-[#FFFFFF]/78 p-6 backdrop-blur-md sm:p-8 dark:border-white/12 dark:bg-[#0B1020]/74">
                <p className="text-xs font-semibold text-[#C83E4D] dark:text-[#F47292]">
                  {t.sections.writingEyebrow}
                </p>
                <h2 className="mt-1.5 font-display text-2xl font-bold tracking-tight text-[#171C28] sm:text-3xl dark:text-[#F3F6FC]">
                  {t.sections.writingTitle}
                </h2>

                <ul className="mt-7 divide-y divide-[#E6DFD5] border-t border-[#E6DFD5] dark:divide-white/10 dark:border-white/10">
                  {localizedWriting.map((essay) => (
                    <li key={essay.href}>
                      <a
                        href={essay.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between gap-4 py-4 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 shrink-0">
                            {essay.symbol ? (
                              <OrgSymbol symbol={essay.symbol} size="sm" />
                            ) : (
                              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-[#E2DACD] bg-[#F5F1EA] text-[#C83E4D] dark:border-[#2A354E] dark:bg-[#172036] dark:text-[#F47292]">
                                <DomainSymbol kind={essay.icon ?? 'essay'} className="h-3.5 w-3.5" />
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="inline-flex items-center gap-2 text-xs text-[#525C6E] dark:text-[#9CA8BE]">
                              {essay.country && (
                                <CountryFlag code={essay.country} className="h-[12px] w-[18px]" />
                              )}
                              <span>{essay.label}</span>
                            </p>
                            <p className="mt-0.5 font-display text-base font-semibold text-[#171C28] group-hover:text-[#C83E4D] transition-colors dark:text-[#F3F6FC] dark:group-hover:text-[#FFA3BC]">
                              {essay.title}
                            </p>
                          </div>
                        </div>
                        <ArrowUpRight
                          className="h-4 w-4 shrink-0 text-[#525C6E] transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#C83E4D] dark:text-[#9CA8BE] dark:group-hover:text-[#FFA3BC]"
                          aria-hidden="true"
                        />
                      </a>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <h3 className="text-xs font-semibold text-[#525C6E] dark:text-[#9CA8BE]">
                    {t.sections.learningResources}
                  </h3>
                  <ul className="mt-3 divide-y divide-[#E6DFD5] border-y border-[#E6DFD5] dark:divide-white/10 dark:border-white/10">
                    {localizedResources.map((res) => (
                      <li key={res.href}>
                        <a
                          href={res.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center justify-between gap-4 py-3.5"
                        >
                          <span className="inline-flex items-center gap-2.5 text-sm font-medium text-[#171C28] group-hover:text-[#C83E4D] transition-colors dark:text-[#F3F6FC] dark:group-hover:text-[#FFA3BC]">
                            <span className="text-[#C83E4D] dark:text-[#F47292]">
                              <DomainSymbol kind={res.icon ?? 'resource'} className="h-4 w-4" />
                            </span>
                            <span>
                              {res.title}{' '}
                              <span className="text-xs font-normal text-[#525C6E] dark:text-[#9CA8BE]">
                                · {res.label}
                              </span>
                            </span>
                          </span>
                          <ArrowUpRight
                            className="h-4 w-4 shrink-0 text-[#525C6E] transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#C83E4D] dark:text-[#9CA8BE] dark:group-hover:text-[#FFA3BC]"
                            aria-hidden="true"
                          />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Right 7 Columns: Find Me & Direct Contact */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-[#E6DFD5]/78 bg-[#FFFFFF]/78 p-6 backdrop-blur-md sm:p-8 dark:border-white/12 dark:bg-[#0B1020]/74">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display text-2xl font-bold tracking-tight text-[#171C28] dark:text-[#F3F6FC]">
                      {t.sections.findMeOnline}
                    </h3>
                    <p className="mt-1 text-sm text-[#525C6E] dark:text-[#9CA8BE]">
                      {t.sections.findMeSubtitle}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#D8CFC2] bg-[#FCFBF8] px-3.5 py-2 text-xs font-semibold text-[#171C28] transition-colors duration-150 hover:border-[#C83E4D] hover:text-[#C83E4D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C83E4D] dark:border-[#2E3A54] dark:bg-[#172036] dark:text-[#EEF1F7] dark:hover:border-[#F47292] dark:hover:text-[#FFA3BC] whitespace-nowrap shrink-0"
                  >
                    {emailCopied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-[#2E8B6E] dark:text-[#57B894]" aria-hidden="true" />
                        <span>{t.sections.emailCopied}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{t.sections.copyEmail}</span>
                      </>
                    )}
                  </button>
                </div>

                <ul className="mt-6 divide-y divide-[#EFEAE1] border-t border-[#EFEAE1] dark:divide-[#1E2840] dark:border-[#1E2840]">
                  {localizedProfiles.map((profile) => (
                    <li key={profile.href}>
                      <a
                        href={profile.href}
                        target={profile.isEmail ? undefined : '_blank'}
                        rel={profile.isEmail ? undefined : 'noopener noreferrer'}
                        className="group -mx-2 flex items-center justify-between gap-4 rounded-lg px-2 py-3.5 text-sm transition-colors hover:bg-[#F7F3EC]/80 dark:hover:bg-[#172036]/70"
                      >
                        <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-4 min-w-0">
                          <span className="inline-flex w-36 shrink-0 items-center gap-2.5 font-semibold text-[#171C28] group-hover:text-[#C83E4D] transition-colors dark:text-[#F3F6FC] dark:group-hover:text-[#FFA3BC]">
                            <span className="text-[#525C6E] group-hover:text-[#C83E4D] transition-colors dark:text-[#9CA8BE] dark:group-hover:text-[#F47292]">
                              <DomainSymbol kind={profile.icon} className="h-4 w-4" />
                            </span>
                            <span>{profile.label}</span>
                          </span>
                          <span className="truncate font-mono text-xs text-[#525C6E] dark:text-[#9CA8BE]">
                            {profile.detail}
                          </span>
                        </div>
                        <ArrowUpRight
                          className="h-4 w-4 shrink-0 text-[#525C6E] transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#C83E4D] dark:text-[#9CA8BE] dark:group-hover:text-[#FFA3BC]"
                          aria-hidden="true"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Animated Direct Contact Form (EmailJS + FormSubmit fallback + AI Draft prefill) */}
          <ContactForm prefillDraft={contactDraft} language={language} />
        </section>
      </main>

      {/* Quiet Editorial Footer with subtle XR Coordinate Axis Legend & Language Switcher */}
      <footer className="relative z-20 border-t border-[#E6DFD5]/75 bg-[#FCFBF8]/74 backdrop-blur-md dark:border-white/12 dark:bg-[#090D18]/72 no-print">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 px-6 py-7 text-xs text-[#525C6E] sm:flex-row dark:text-[#9CA8BE]">
          <div className="flex items-center gap-4">
            <span className="font-medium text-[#171C28] dark:text-[#EEF1F7]">
              Ashish Kumar · {t.hero.domains}
            </span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-3 font-mono text-[11px]" aria-label="3D coordinate axes X, Y, Z">
              <span className="inline-flex items-center gap-1">
                <span className="h-[2px] w-3 bg-[#C83E4D]" aria-hidden="true" />X
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="h-[2px] w-3 bg-[#2E8B6E]" aria-hidden="true" />Y
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="h-[2px] w-3 bg-[#3B6FD8]" aria-hidden="true" />Z
              </span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <LanguageSwitcher
              language={language}
              onChange={handleLanguageChange}
              variant="menu"
              placement="up"
              compact
            />
            <a
              href="#top"
              className="hover:text-[#171C28] transition-colors dark:hover:text-[#EEF1F7]"
            >
              {t.sections.backToTop}
            </a>
            <button
              type="button"
              onClick={() => setCvOpen(true)}
              className="hover:text-[#C83E4D] transition-colors dark:hover:text-[#FFA3BC]"
            >
              {t.sections.curriculumVitae}
            </button>
          </div>
        </div>
      </footer>

      {/* Interactive Modals (Code-Split Lazy Chunks) */}
      <Suspense fallback={null}>
        {selectedProject && (
          <ProjectLightbox
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
            onAskAi={(prompt) => handleAskAi(prompt, 'guide')}
            language={language}
          />
        )}
        {cvOpen && (
          <CvModal
            open={cvOpen}
            onClose={() => setCvOpen(false)}
            language={language}
          />
        )}
      </Suspense>

      {/* Multi-Modal Streaming Gemini AI & Voice Studio (Lazy-Loaded + Crash-Proof ErrorBoundary) */}
      {!aiMounted ? (
        <button
          type="button"
          onMouseEnter={() => {
            void loadAiConcierge();
          }}
          onFocus={() => {
            void loadAiConcierge();
          }}
          onClick={() => {
            setAiMounted(true);
            setAiOpen(true);
          }}
          aria-label="Open Ashish AI & Voice Concierge"
          className="fixed right-5 bottom-5 z-40 inline-flex items-center gap-2.5 rounded-2xl border border-[#DFD6C9]/90 bg-[#171C28]/95 px-4 py-3 text-xs font-semibold text-[#FCFBF8] shadow-xl shadow-black/25 backdrop-blur-md transition-all duration-150 hover:-translate-y-0.5 hover:border-[#C83E4D] hover:bg-[#C83E4D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C83E4D] dark:border-white/18 dark:bg-[#131B2E]/92 dark:text-[#F3F6FC] dark:hover:border-[#F47292] dark:hover:bg-[#E14B67] sm:right-6 sm:bottom-6 no-print"
        >
          <Sparkles className="h-4 w-4 text-[#FFB5C8]" aria-hidden="true" />
          <span>{t.aiStudio.launcher}</span>
          <span aria-hidden="true" className="text-white/35">
            ·
          </span>
          <Mic className="h-3.5 w-3.5 text-[#FFB5C8]" aria-hidden="true" />
        </button>
      ) : (
        <ErrorBoundary fallbackTitle="AI Studio recovered safely">
          <Suspense fallback={null}>
            <PortfolioAiConcierge
              open={aiOpen}
              onOpenChange={setAiOpen}
              launchRequest={aiLaunch}
              onInsertIntoContact={handleInsertIntoContact}
              onOpenProject={(proj) => setSelectedProject(proj)}
              onSwitchFocusReel={(idx) => setActiveScene(idx)}
              onOpenCv={() => setCvOpen(true)}
              language={language}
            />
          </Suspense>
        </ErrorBoundary>
      )}
    </div>
  );
}
