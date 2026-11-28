import type { CountryCode } from '../components/CountryFlag';
import type { DomainSymbolKey, SymbolSpec } from '../components/OrgSymbol';

export type ProjectCategory = 'all' | 'xr' | 'ai' | 'quantum';

export interface ProjectLink {
  label: string;
  href: string;
  primary?: boolean;
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  category: Exclude<ProjectCategory, 'all'>;
  categoryLabel: string;
  venue?: string;
  country?: CountryCode;
  symbols: SymbolSpec[];
  year: string;
  featured?: boolean;
  image?: string;
  imageAlt?: string;
  summary: string;
  contribution: string;
  outcome: string;
  stack: string[];
  links: ProjectLink[];
}

export interface ResearchItem {
  id: string;
  venue: string;
  location: string;
  country: CountryCode;
  symbols: SymbolSpec[];
  title: string;
  summary: string;
  status: string;
  dateNote?: string;
  href: string;
  linkLabel: string;
  kind: 'paper' | 'demo';
}

export interface ExperienceItem {
  id: string;
  period: string;
  role: string;
  organization: string;
  location: string;
  country: CountryCode;
  symbols: SymbolSpec[];
  platform?: string;
  summary: string;
  href: string;
}

export interface SkillGroup {
  category: string;
  subtitle: string;
  icon: DomainSymbolKey;
  items: string[];
}

export interface RecognitionItem {
  id: string;
  group: 'fellowships' | 'schools' | 'competitions' | 'education';
  groupLabel: string;
  metaLeft: string;
  country: CountryCode;
  symbols: SymbolSpec[];
  title: string;
  description?: string;
  outcome: string;
  tags?: string[];
  href?: string;
}

export interface WritingItem {
  label: string;
  title: string;
  href: string;
  country?: CountryCode;
  symbol?: SymbolSpec;
  icon?: DomainSymbolKey;
}

export interface ProfileLink {
  label: string;
  detail: string;
  href: string;
  icon: DomainSymbolKey;
  isEmail?: boolean;
}

export const PROOF_METRICS = [
  {
    value: '4 Papers',
    label: '2026 International Venues',
    detail: 'ESA XR · AIVR · ICMLAI · XRM',
  },
  {
    value: 'Top 100',
    label: 'Meta XROS Fellow',
    detail: 'Selected from 2,800+ applicants',
  },
  {
    value: '1st Prize',
    label: 'DJX · GAME FREAK · Tracks',
    detail: '₹50,000 Mentor Winner · 100/100 Japan coding',
  },
  {
    value: '2,821',
    label: 'Problems Solved',
    detail: 'CodeChef Diamond badge',
  },
];

export const FOCUS_AREAS: { label: string; detail: string; icon: DomainSymbolKey }[] = [
  { label: 'XR', detail: 'Smart glasses & spatial optics', icon: 'xr' },
  { label: 'AI', detail: 'Human-centered & agentic models', icon: 'ai' },
  { label: 'Machine Learning', detail: 'Computer vision & learning systems', icon: 'ml' },
  { label: 'Quantum Computing', detail: 'Hybrid qubit circuits & QML', icon: 'quantum' },
  { label: 'Robotics', detail: 'Embodied interactive machines', icon: 'robotics' },
  { label: 'Space Science', detail: 'Analog habitat mission interfaces', icon: 'space' },
];

export const RESEARCH_INTERESTS: { label: string; detail: string; icon: DomainSymbolKey }[] = [
  { label: 'AI Safety', detail: 'Trust, reliability & evaluation', icon: 'safety' },
  { label: 'Brain Science', detail: 'Mind, cognition & perception', icon: 'brain' },
  { label: 'Neurocomputing', detail: 'Neural-sensing computation', icon: 'neuro' },
];

export const GLOBAL_COUNTRIES: CountryCode[] = [
  'IN',
  'DE',
  'JP',
  'US',
  'IT',
  'PL',
  'AE',
  'ES',
  'EE',
  'GB',
];

export const PROJECTS: ProjectItem[] = [
  {
    id: 'medcaresnap',
    title: 'MedCareSnap (Pulse)',
    subtitle: 'Hands-free AR guidance for cardiac emergencies',
    category: 'xr',
    categoryLabel: 'Snap Spectacles · Spatial AR',
    venue: 'XRCC 2026 Finalist · VR Summit 2026 Demo',
    country: 'DE',
    symbols: [
      { src: '/src/assets/symbols/xrcc_event.png', alt: 'XRCC official event symbol' },
      { src: '/src/assets/symbols/ruhr_bochum.png', alt: 'Ruhr University Bochum VR Summit symbol' },
    ],
    year: '2026',
    featured: true,
    image: '/src/assets/images/project_medcaresnap_ar_1795327864151.jpg',
    imageAlt: 'Sunlit courtyard plaza seen through spatial AR optics with luminous directional navigation arcs and pulse geometry',
    summary:
      'AR guidance for cardiac emergencies displaying hand placement and compression rhythm for CPR alongside a voice-controlled AED locator with live distance and directional overlays.',
    contribution:
      'Prototyped hands-free CPR guidance and AED discovery using Lens Studio, Python, WebSockets, VoiceML, and gesture-led interfaces.',
    outcome:
      'XRCC 2026 official finalist (advancing from ~190 worldwide submissions) and accepted into the VR Summit 2026 official demo programme.',
    stack: ['Snap Spectacles', 'Lens Studio', 'VoiceML', 'Python', 'WebSockets', 'AR Overlays'],
    links: [
      { label: 'GitHub Repository', href: 'https://github.com/Ashish11828/xrcc_hack_2026', primary: true },
      { label: 'VR Summit Programme', href: 'https://vrs.ruhr-uni-bochum.de/programme-2026/' },
    ],
  },
  {
    id: 'mixhai-xr',
    title: 'MixHAI-XR HRI Sensor Lab',
    subtitle: 'Simulation-first workbench for collaborative human–robot interaction',
    category: 'xr',
    categoryLabel: 'WebXR · HRI · Smart Glasses Vision',
    symbols: [{ alt: 'Human Robot Interaction symbol', iconKey: 'robotics' }],
    image: '/src/assets/images/project_mixhai_hri.svg',
    imageAlt: 'Animated research illustration of a collaborative robot and smart-glasses wearer sharing a spatial sensing zone with live telemetry panels',
    venue: 'Interactive research prototype · 2026',
    year: '2026',
    summary:
      'An interactive XR workbench for exploring collaborative-robot handover, force-guidance, proximity-safety, and gaze-intent scenarios across AR, mixed-reality, and VR modes. It brings simulated sensor and vision feedback, a reinforcement-learning agent, experiment logging, and telemetry into one research interface.',
    contribution:
      'Built the TypeScript and Three.js workbench with XRBlocks, scenario controls, smart-glasses vision overlays, a simulated object-detection path, and experiment and telemetry views.',
    outcome:
      'A simulation-oriented research prototype. The repository enables a simulator override for object detection and does not document validation with a physical robot or study participants.',
    stack: ['TypeScript', 'Three.js', 'XRBlocks', 'WebXR', 'MediaPipe', 'Human–Robot Interaction', 'Reinforcement Learning'],
    links: [
      { label: 'GitHub Repository', href: 'https://github.com/Ashish11828/mixi_paper', primary: true },
    ],
  },
  {
    id: 'roboxr-ai',
    title: 'RoboXR AI',
    subtitle: 'XR-first robot teaching & ISO 10218 safety guardrails',
    category: 'xr',
    categoryLabel: 'XREAL · Android XR · Robotics',
    venue: 'Startup Buildathon India 2026 — Kochi',
    country: 'IN',
    symbols: [
      { src: '/src/assets/symbols/startup_buildathon.png', alt: 'Startup Buildathon India symbol' },
    ],
    year: '2026',
    image: '/src/assets/images/project_roboxr_ai_1795361148922.jpg',
    imageAlt:
      'Sunlit robotics and CNC workshop atelier with an articulated robot arm surrounded by translucent holographic XR waypoints and emerald ISO safety perimeter rings',
    summary:
      'XR-first robot teaching, deterministic ISO 10218 safety guardrails, and 30-second CNC anomaly recovery platform built for XREAL & Android XR at Startup Buildathon India 2026.',
    contribution:
      'Engineered a 4-stage Kotlin & Jetpack Compose architecture combining Gemini AI Logic with an offline Kotlin planner fallback, 3D pick-and-place anchor vectors, deterministic safety enforcement, and SHA-256 Firebase Firestore operator audit trails.',
    outcome:
      'Shipped for the Kochi City Buildathon round of Startup Buildathon India 2026 (featuring Google DeepMind & Google Cloud, 20–21 Nov 2026) with complete Android XR app, Firestore rules, and operator sign-off audit chain.',
    stack: [
      'Kotlin',
      'Jetpack Compose',
      'XREAL',
      'Android XR',
      'Gemini AI',
      'Firebase Firestore',
      'ISO 10218 Safety',
    ],
    links: [
      {
        label: 'Live Demo',
        href: 'https://ai.studio/apps/f4d21451-b7b0-45d3-a92d-677d55155ca3',
        primary: true,
      },
      { label: 'GitHub Repository', href: 'https://github.com/Ashish11828/roboxreal' },
      { label: 'Startup Buildathon India', href: 'https://startupbuildathon.com/' },
    ],
  },
  {
    id: 'fraudlens',
    title: 'FraudLens',
    subtitle: 'Accessible scam-risk guidance for smart glasses',
    category: 'xr',
    categoryLabel: 'Accessible UX · Smart Glasses',
    venue: 'Build the Invisible · Mumbai Meta Ray-Ban Display Hackathon',
    country: 'IN',
    symbols: [{ src: '/src/assets/symbols/meta.svg', alt: 'Meta official symbol' }],
    year: '2026',
    image: '/src/assets/images/project_fraudlens_glasses_1795327863794.jpg',
    imageAlt: 'Minimalist matte-black smart glasses on a sunlit cedar desk with prismatic window light and geometric lens rings',
    summary:
      'An accessibility-first scam-prevention experience crafted for a 600 × 600 Meta Ray-Ban Display preview, using concise guided prompts to help people spot pressure tactics and warning signs.',
    contribution:
      'Co-developed with Manav Rajpurohit as Team Invisible Creator; engineered read-aloud speech, adjustable text scale, high contrast, and reduced-motion modes.',
    outcome:
      'Shipped live web app and recorded demo using deterministic local rules and fixed prompts without relying on an AI verifier.',
    stack: ['JavaScript', 'Accessibility', 'Web Speech API', 'Meta Ray-Ban Display'],
    links: [
      { label: 'Live App', href: 'https://scamfruadlens.netlify.app/', primary: true },
      { label: 'Watch Demo', href: 'https://drive.google.com/file/d/1mxk_QB9SAB7yR2BMgr0MdIzllzrnREJZ/view' },
      { label: 'GitHub', href: 'https://github.com/Ashish11828/fraudlens' },
    ],
  },
  {
    id: 'hololens-sewing',
    title: 'Smart Sewing Machine Maintenance Guide',
    subtitle: 'Industrial hands-free AR repair walkthrough',
    category: 'xr',
    categoryLabel: 'HoloLens 2 · Industrial AR',
    venue: 'Meta XROS Fellowship · NIFT-Delhi',
    country: 'IN',
    symbols: [
      { src: '/src/assets/symbols/meta.svg', alt: 'Meta official symbol' },
      { src: '/src/assets/symbols/ficci.png', alt: 'FICCI symbol' },
    ],
    year: '2023',
    image: '/src/assets/images/project_hololens_atelier_1795327865144.jpg',
    imageAlt: 'Sunlit craft workshop atelier featuring an industrial sewing machine surrounded by luminous blue holographic mechanical schematics',
    summary:
      'A hands-free mixed-reality guide for learning to maintain an industrial seam-sealing machine, projecting detailed spatial assemblies that learners manipulate directly with their hands.',
    contribution:
      'Co-developed with Vibhanshu Singh Sindhu under NIFT-Delhi mentorship across a three-month Meta-supported open-source XR fellowship.',
    outcome:
      'Delivered a complete three-month HoloLens 2 team prototype; recognized as Fellow on the NIFT project in the FICCI XROS Fellowship outcome report (page 29).',
    stack: ['HoloLens 2', 'Unity', 'MRTK', 'Vuforia', 'Blender', 'Substance Painter', 'Figma'],
    links: [
      { label: 'GitHub Repository', href: 'https://github.com/Ashish11828/xros-nift-project', primary: true },
    ],
  },
  {
    id: 'khaali-dabba',
    title: 'Khaali Dabba Nahi Lautate',
    subtitle: 'Everyday Indian magic storytelling in spatial AR',
    category: 'xr',
    categoryLabel: 'Snap Spectacles · Spatial Storytelling',
    venue: 'DJX 2026 Residency Programme',
    country: 'IN',
    symbols: [{ src: '/src/assets/symbols/djx.jpg', alt: 'DJX Hack official event mark' }],
    year: '2026',
    image: '/src/assets/images/project_khaali_dabba_1795327864358.jpg',
    imageAlt: 'Sunlit miniature Indian neighborhood alleyway with bougainvillea balconies and a brass tiffin box resting on a wooden doorstep',
    summary:
      'An interactive miniature neighbourhood storytelling experience: explore terraced alleyways, uncover clues about three neighbours, choose a thoughtful gift, and deliver it to their doorstep.',
    contribution:
      'Designed and built the spatial neighbourhood storytelling prototype for Snap Spectacles using TypeScript and world-anchored interactions.',
    outcome:
      'Playable spatial prototype developed during the DJX 2026 Residency Programme, prepared for on-glasses hardware validation.',
    stack: ['TypeScript', 'Lens Studio', 'Spectacles Interaction Kit', 'UIKit', 'WorldQuery'],
    links: [
      { label: 'GitHub Repository', href: 'https://github.com/Ashish11828/khaali-dabba-nahi-lautate', primary: true },
    ],
  },
  {
    id: 'quantumx-alzheimers',
    title: "QuantumX Alzheimer's Classification",
    subtitle: '4-qubit hybrid quantum-classical clinical classifier',
    category: 'quantum',
    categoryLabel: 'Quantum ML · Healthcare',
    venue: 'Qiskit Fall Fest 2026 x QuantumX · Top 10 Finalist',
    country: 'IN',
    symbols: [{ src: '/src/assets/symbols/quantumx_event.png', alt: 'QuantumX event symbol' }],
    year: '2026',
    image: '/src/assets/images/project_quantum_orbit_1795327863359.jpg',
    imageAlt: 'Twilight astronomical observatory with four translucent crystalline spheres connected by golden geometric orbital threads',
    summary:
      "Classifies Alzheimer's disease and mild cognitive impairment from 9 clinical features compressed into a 4-qubit parameterized circuit, complete with a Streamlit explainability dashboard.",
    contribution:
      'Contributed to the team-built hybrid quantum-classical classification pipeline, benchmark comparison, and clinical explainability tools.',
    outcome:
      'Top 10 finalist at Quantum Hack Day Kochi. Reached 76.5% accuracy vs. 77.5% classical SVM on 39 OASIS-1 subjects (reported transparently with no claim of quantum advantage).',
    stack: ['Python', 'PennyLane', 'Qiskit', 'scikit-learn', 'Streamlit'],
    links: [
      { label: 'GitHub Repository', href: 'https://github.com/Ashish11828/Quark_disease_classification', primary: true },
    ],
  },
  {
    id: 'protect-safety-ai',
    title: 'Protect Safety AI',
    subtitle: 'Alert reliability evaluation for automated proctoring',
    category: 'ai',
    categoryLabel: 'AI Safety · Evaluation Toolkit',
    symbols: [{ alt: 'AI Safety Evaluation symbol', iconKey: 'safety' }],
    year: '2026',
    image: '/src/assets/images/project_protect_safety_ai_1795329666913.jpg',
    imageAlt: 'Twilight Japanese research desk overlooking cherry blossoms with glowing calibration grids, optical prism lenses, and golden balance rings',
    summary:
      'A reproducible Python evaluation toolkit for auditing false alarms, missed detections, and lighting or noise disparities across automated proctoring alert pipelines.',
    contribution:
      'Engineered confusion-matrix diagnostics, strict input validation, environmental condition breakdowns, and structured human-review escalation recommendations.',
    outcome:
      'Reproducible CLI and JSON reporting suite backed by unit tests across 12 synthetic benchmark events for transparent methodology demonstration.',
    stack: ['Python', 'AI Safety', 'Confusion Matrix Metrics', 'Human Oversight', 'CLI'],
    links: [
      { label: 'Source & Usage', href: 'https://github.com/Ashish11828/Protect-safety-ai', primary: true },
    ],
  },
  {
    id: 'ml-from-scratch',
    title: 'Machine Learning from Scratch',
    subtitle: 'First-principles implementations & interactive progress portfolio',
    category: 'ai',
    categoryLabel: 'ML Fundamentals · Algorithms',
    symbols: [{ alt: 'Machine Learning Algorithms symbol', iconKey: 'ml' }],
    year: '2025–2026',
    image: '/src/assets/images/project_ml_from_scratch_1795329667342.jpg',
    imageAlt: 'Sunlit anime drafting desk beside cumulus clouds and drifting cherry blossoms with glowing geometric regression curves and crystalline manifolds',
    summary:
      'A curated collection of first-principles machine learning algorithms implemented without black-box wrappers, spanning regression, feature scaling, kernels, encoding, and metrics.',
    contribution:
      'Implemented gradient descent, normal-equation linear regression, ridge loss regularization, and precision/recall/F-score evaluators from scratch.',
    outcome:
      'Documented, verified first-principles implementations published alongside an interactive web progress tracker.',
    stack: ['Python', 'Regression', 'Kernels', 'Model Evaluation', 'Algorithms'],
    links: [
      { label: 'Interactive Portfolio', href: 'https://ashish11828.github.io/deep-ml/', primary: true },
      { label: 'GitHub', href: 'https://github.com/Ashish11828/deep-ml' },
    ],
  },
];

export const RESEARCH_PUBLICATIONS: ResearchItem[] = [
  {
    id: 'esa-xr-2026',
    venue: 'ESA XR 2026',
    location: 'EAC, Cologne, Germany',
    country: 'DE',
    symbols: [
      {
        src: '/src/assets/symbols/esa.png',
        alt: 'European Space Agency (ESA) official logo',
        wide: true,
        plateTone: 'esa',
      },
    ],
    title: 'Mixed-Reality Camera Interface for Enhanced Data Collection in Space Analog Missions',
    summary:
      'A hands-free Meta Quest system for spatial mapping, synchronized recording, and gesture or gaze-triggered capture with automatic metadata tagging tailored for analog habitat research.',
    status: 'Published',
    dateNote: 'March 2026',
    href: 'https://www.esa.int/ESA_Multimedia/Videos/2026/05/ESA_XR_Conference_2026',
    linkLabel: 'ESA Conference',
    kind: 'paper',
  },
  {
    id: 'aivr-2026',
    venue: 'AIVR 2026',
    location: 'Kobe, Japan',
    country: 'JP',
    symbols: [{ alt: 'AIVR 2026 conference badge', iconKey: 'aivr' }],
    title: 'Decarbonizing the Metaverse: Sustainable System Design for Multi-Modal XR, AI, and IoT Responsive Environments',
    summary:
      'Architectural analysis and energy-aware system framework for lowering computational and environmental footprints across responsive multi-modal XR, AI, and IoT ecosystems.',
    status: 'Accepted (Full Paper)',
    dateNote: 'Oral presentation with major revisions',
    href: 'https://www.aivr.org/AIVR2026.html',
    linkLabel: 'AIVR 2026',
    kind: 'paper',
  },
  {
    id: 'icmlai-2026',
    venue: 'ICMLAI 2026',
    location: 'Spain',
    country: 'ES',
    symbols: [{ src: '/src/assets/symbols/icmlai.png', alt: 'ICMLAI official symbol' }],
    title: 'Neural-Sensing Smart Glasses for Human–AI Collaboration and Augmented Intelligence',
    summary:
      'Investigates wearable neural-sensing interfaces paired with smart glasses to support unobtrusive human-in-the-loop reasoning and contextual AI collaboration.',
    status: 'Accepted (Poster Abstract)',
    dateNote: '2026',
    href: 'https://ai.pagesconferences.org/',
    linkLabel: 'Conference Site',
    kind: 'paper',
  },
  {
    id: 'xrm-2026',
    venue: 'XRM 2026',
    location: 'Estonia',
    country: 'EE',
    symbols: [{ src: '/src/assets/symbols/xrm.png', alt: 'XRM official symbol' }],
    title: 'Augmenting Ideation: A Mixed Reality Framework for Dynamic Mind Mapping and Content Generation',
    summary:
      'Extended abstract proposing a spatial mixed-reality canvas that transforms non-linear conceptual brainstorming into structured dynamic mind maps and generated media.',
    status: 'Accepted (Extended Abstract)',
    dateNote: '2026',
    href: 'https://www.xrm2026.com/',
    linkLabel: 'XRM 2026',
    kind: 'paper',
  },
  {
    id: 'vr-summit-2026',
    venue: 'VR Summit 2026',
    location: 'Rotunde Bochum · Ruhr-Universität Bochum, Germany',
    country: 'DE',
    symbols: [
      { src: '/src/assets/symbols/ruhr_bochum.png', alt: 'Ruhr University Bochum official symbol' },
    ],
    title: 'MedCareSnap — Live Spatial AR Cardiac Response Demonstration',
    summary:
      'Listed in the official VR Demos & Poster programme (organized by KlaesLab, Ruhr-Universität Bochum) as Ashish Kumar, Independent Researcher, demonstrating hands-free CPR pacing and AED spatial navigation.',
    status: 'Accepted Demo',
    dateNote: '12–13 October 2026',
    href: 'https://vrs.ruhr-uni-bochum.de/programme-2026/',
    linkLabel: 'Demo Programme',
    kind: 'demo',
  },
];

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: 'exp-independent-researcher',
    period: 'Jul 2024 – Present',
    role: 'Independent XR & AI Researcher',
    organization: 'Spatial Computing & Human-Centered AI',
    location: 'India · Europe · Japan',
    country: 'IN',
    symbols: [
      {
        src: '/src/assets/symbols/esa.png',
        alt: 'European Space Agency (ESA) official logo',
        wide: true,
        plateTone: 'esa',
      },
      { src: '/src/assets/symbols/xrcc.png', alt: 'XRCC official symbol' },
    ],
    platform: 'Meta Quest · Snap Spectacles · Python · Lens Studio · Qiskit',
    summary:
      'Authored 4 international 2026 research works (ESA XR Germany, AIVR Kobe, ICMLAI Spain, XRM Estonia) and an accepted VR Summit Bochum live demo; built XRCC finalist MedCareSnap and completed funded research programmes with DAAD, NAWA, and AI4I.',
    href: 'https://share.google/NXxM2sSHaWVdn83kw',
  },
  {
    id: 'exp-akiya',
    period: 'Oct – Dec 2025',
    role: 'Software Development Intern',
    organization: 'Akiya 2.0 (Japan Inc. Holdings)',
    location: 'Japan · Remote',
    country: 'JP',
    symbols: [{ src: '/src/assets/symbols/akiya.png', alt: 'Akiya 2.0 official symbol' }],
    platform: 'Python · JavaScript · Data Engineering',
    summary:
      'Contributed to automated data collection, cross-source integration, and database reliability workflows for a Japan-focused vacant-property discovery platform.',
    href: 'https://www.akiya2.com/about',
  },
  {
    id: 'exp-tranquilmind',
    period: 'Feb – Jun 2025',
    role: 'Software Engineer',
    organization: 'TranquilMind.AI',
    location: 'Remote · Bengaluru, India',
    country: 'IN',
    symbols: [{ alt: 'TranquilMind.AI emblem', iconKey: 'tranquilmind' }],
    platform: 'Unreal Engine · C++ · Meta Quest',
    summary:
      'Designed restorative VR environments for AI-driven wellness experiences and optimized Meta Quest frame pacing and spatial interactions in Unreal Engine and C++.',
    href: 'https://in.linkedin.com/company/tranquilmind',
  },
  {
    id: 'exp-xros',
    period: 'Apr – Nov 2023',
    role: 'XR Software Developer',
    organization: 'Meta XROS Fellowship (FICCI)',
    location: 'India',
    country: 'IN',
    symbols: [
      { src: '/src/assets/symbols/meta.svg', alt: 'Meta official symbol' },
      { src: '/src/assets/symbols/ficci.png', alt: 'FICCI official symbol' },
    ],
    platform: 'Unity · C# · Vuforia · HoloLens 2',
    summary:
      'Built a hands-free industrial AR maintenance-guide prototype under NIFT mentorship as part of the Meta-supported open-source XR initiative; recognized in the FICCI XROS outcome report.',
    href: 'https://xrosfellowship.ficci.in/',
  },
];

export const SKILL_GROUPS: SkillGroup[] = [
  {
    category: 'XR Platforms',
    subtitle: 'Devices & Optics',
    icon: 'devices',
    items: ['Meta Quest', 'Snap Spectacles', 'XREAL', 'Android XR', 'HoloLens 2'],
  },
  {
    category: 'Engines & SDKs',
    subtitle: 'Spatial Toolchains',
    icon: 'engines',
    items: ['Unity', 'Unreal Engine', 'Lens Studio', 'Jetpack Compose', 'MRTK', 'Vuforia', 'Spectacles Interaction Kit'],
  },
  {
    category: 'Languages',
    subtitle: 'Core Engineering',
    icon: 'languages',
    items: ['Python', 'C++', 'Kotlin', 'TypeScript', 'C#', 'JavaScript'],
  },
  {
    category: '3D & Craft',
    subtitle: 'Asset & UI Design',
    icon: 'craft',
    items: ['Blender', 'Substance Painter', 'Figma'],
  },
  {
    category: 'Quantum Computing',
    subtitle: 'Hybrid Circuits',
    icon: 'quantum',
    items: ['Qiskit', 'PennyLane', 'Quantum Machine Learning'],
  },
  {
    category: 'Data & ML',
    subtitle: 'Modeling & Systems',
    icon: 'data',
    items: ['Data Engineering', 'Machine Learning', 'Computer Vision', 'DBMS', 'Data Analytics'],
  },
];

export const RECOGNITIONS: RecognitionItem[] = [
  // Fellowships & Scholarships
  {
    id: 'rec-xros',
    group: 'fellowships',
    groupLabel: 'Fellowships & Scholarships',
    metaLeft: 'Meta XROS · India',
    country: 'IN',
    symbols: [
      { src: '/src/assets/symbols/meta.svg', alt: 'Meta official symbol' },
      { src: '/src/assets/symbols/ficci.png', alt: 'FICCI official symbol' },
    ],
    title: 'Top 100 Meta Developer',
    description: 'Selected among the top 100 fellows nationwide for the Meta-supported open-source XR programme.',
    outcome: '100 of 2,800+ applicants',
    href: 'https://www.ficci.in/press_release_details/4697',
  },
  {
    id: 'rec-xrbootcamp',
    group: 'fellowships',
    groupLabel: 'Fellowships & Scholarships',
    metaLeft: 'Unity & Meta · US',
    country: 'US',
    symbols: [
      { src: '/src/assets/symbols/xr_bootcamp.png', alt: 'XR Bootcamp official symbol' },
      { alt: 'Unity official symbol', iconKey: 'unity' },
      { src: '/src/assets/symbols/meta.svg', alt: 'Meta official symbol' },
    ],
    title: 'XR Bootcamp Scholarship',
    description: 'Awarded an $8,000 full scholarship for intensive XR engineering training; graduated with High Honors.',
    outcome: '$8,000 · High Honors',
    href: 'https://xrbootcamp.com/',
  },
  {
    id: 'rec-mxr',
    group: 'fellowships',
    groupLabel: 'Fellowships & Scholarships',
    metaLeft: 'MXR 2026 · US',
    country: 'US',
    symbols: [{ src: '/src/assets/symbols/mxr.png', alt: 'Meaningful XR official symbol' }],
    title: 'Meaningful XR Scholarship',
    description: 'Conference registration fee waiver plus planned travel and accommodation support (at least $300) for in-person participation.',
    outcome: 'Scholarship Awarded',
    href: 'https://www.meaningfulxr.org/about-mxr/past-mxr-conferences/mxr2026',
  },
  // Global Summer & Winter Schools
  {
    id: 'rec-imt',
    group: 'schools',
    groupLabel: 'Global Schools',
    metaLeft: 'IMT Lucca · Italy',
    country: 'IT',
    symbols: [
      {
        src: '/src/assets/symbols/imt_lucca.svg',
        alt: 'IMT School for Advanced Studies Lucca logo',
        wide: true,
      },
      {
        alt: 'DAAD — Deutscher Akademischer Austauschdienst (German Academic Exchange Service)',
        iconKey: 'daad',
      },
    ],
    title: 'Game Design Summer School — IMT Lucca',
    description:
      'Funded by DAAD (Deutscher Akademischer Austauschdienst — German Academic Exchange Service). Project-based workshops combining game design, game theory, game jams, and circular economy prototyping.',
    outcome: 'Funded by DAAD (German Academic Exchange Service)',
    tags: ['DAAD Funded', 'Game Design', 'Game Theory', 'Circular Economy'],
    href: 'https://www.imtlucca.it/summer-school-game-design-meets-game-theory-prototyping-circular-economies',
  },
  {
    id: 'rec-isaga',
    group: 'schools',
    groupLabel: 'Global Schools',
    metaLeft: 'ISAGA · Poland',
    country: 'PL',
    symbols: [
      {
        src: '/src/assets/symbols/kozminski.svg',
        alt: 'Kozminski University official logo',
        wide: true,
        plateTone: 'plum',
      },
    ],
    title: 'ISAGA Summer School 2026',
    description: 'Participation fee waived via a Polish National Agency for Academic Exchange (NAWA) grant.',
    outcome: 'NAWA Grant · Fee Waived',
    href: 'https://www.kozminski.edu.pl/en/isaga-summer-school-2026',
  },
  {
    id: 'rec-nyu',
    group: 'schools',
    groupLabel: 'Global Schools',
    metaLeft: 'NYU Abu Dhabi · UAE',
    country: 'AE',
    symbols: [
      {
        src: '/src/assets/symbols/nyu_abudhabi.svg',
        alt: 'NYU Abu Dhabi official logo',
        wide: true,
        plateTone: 'plum',
      },
    ],
    title: 'Digital Humanities Winter School 2024 — Computing Culture',
    description: 'Studied exploratory data analysis, NLP, computer vision, convolutional neural networks, and computational image analysis.',
    outcome: 'Fully Funded · NYU Abu Dhabi',
    href: 'https://wp.nyu.edu/widh/widh-2024/',
  },
  {
    id: 'rec-ai4i',
    group: 'schools',
    groupLabel: 'Global Schools',
    metaLeft: 'AI4I · Turin, Italy',
    country: 'IT',
    symbols: [
      {
        src: '/src/assets/symbols/ai4i.png',
        alt: 'AI4I official logo',
        wide: true,
      },
    ],
    title: 'CSP–IAS Winter School 2026 — Cryptography & Machine Learning',
    description:
      'Selected for and completed remotely the intensive winter school organized by AI4I (Italian Institute of Artificial Intelligence for Industry) in Turin, Italy (2–5 Feb 2026).',
    outcome: 'Selected · Completed',
    tags: ['Cryptography', 'Machine Learning', 'AI Security'],
    href: 'https://ai4i.it/ias-winter-school-2026/',
  },
  // Competitions, Mentoring & Awards
  {
    id: 'rec-gamefreak',
    group: 'competitions',
    groupLabel: 'Competitions & Mentoring',
    metaLeft: 'Japan',
    country: 'JP',
    symbols: [
      {
        src: '/src/assets/symbols/gamefreak.svg',
        alt: 'GAME FREAK official logo',
        wide: true,
      },
    ],
    title: 'GAME FREAK Programming Challenge',
    description: 'Achieved a perfect score across algorithmic coding problems in the GAME FREAK challenge.',
    outcome: '1st of 33 · 100/100',
    href: 'https://job.tracks.run/user/reports/challenges/gamefreak-lp-03',
  },
  {
    id: 'rec-tracks',
    group: 'competitions',
    groupLabel: 'Competitions & Mentoring',
    metaLeft: 'Tracks Jobs · Japan',
    country: 'JP',
    symbols: [{ src: '/src/assets/symbols/tracks_jobs.png', alt: 'Tracks Jobs official symbol' }],
    title: 'National Programming Challenge',
    description: 'Top-ranked finish with a 100/100 evaluation score on Tracks Jobs Japan.',
    outcome: 'Ranked 1st · 100/100',
    href: 'https://job.tracks.run/share/programmingtest-26-01/4b04fb7e-294d-4912-8e40-b4e63901581c',
  },
  {
    id: 'rec-mit',
    group: 'competitions',
    groupLabel: 'Competitions & Mentoring',
    metaLeft: 'Cambridge, MA · US',
    country: 'US',
    symbols: [
      {
        src: '/src/assets/symbols/reality_hack_mit.webp',
        alt: 'Reality Hack at MIT official logo',
        wide: true,
        plateTone: 'mit',
      },
    ],
    title: 'Reality Hack at MIT 2026',
    description: 'Selected to volunteer as an in-person technical mentor for XR builders at MIT (22–26 Jan 2026).',
    outcome: 'Selected Mentor',
    href: 'https://www.realityhackatmit.com/',
  },
  {
    id: 'rec-buildathon',
    group: 'competitions',
    groupLabel: 'Competitions & Mentoring',
    metaLeft: 'Kochi, India · 2026',
    country: 'IN',
    symbols: [
      {
        src: '/src/assets/symbols/startup_buildathon.png',
        alt: 'Startup Buildathon India symbol',
      },
    ],
    title: 'Startup Buildathon India 2026 — Kochi',
    description:
      'Shortlisted for the Kochi City Buildathon round featuring Google DeepMind and Google Cloud (20–21 Nov 2026); built RoboXR AI for XREAL & Android XR robot teaching and ISO 10218 safety.',
    outcome: 'Shortlisted Finalist · RoboXR AI',
    tags: ['RoboXR AI', 'XREAL & Android XR', 'ISO 10218'],
    href: 'https://github.com/Ashish11828/roboxreal',
  },
  {
    id: 'rec-xrcc',
    group: 'competitions',
    groupLabel: 'Competitions & Mentoring',
    metaLeft: 'XRCC · Germany',
    country: 'DE',
    symbols: [{ src: '/src/assets/symbols/xrcc.png', alt: 'XRCC official symbol' }],
    title: 'XRCC Hackathon 2026',
    description: 'Team advanced to official finalist standing from approximately 190 worldwide submissions.',
    outcome: 'Global Finalist',
    href: 'https://www.xrcc.events/',
  },
  {
    id: 'rec-qiskit',
    group: 'competitions',
    groupLabel: 'Competitions & Mentoring',
    metaLeft: 'Kochi, India · 2026',
    country: 'IN',
    symbols: [{ src: '/src/assets/symbols/quantumx.png', alt: 'QuantumX official symbol' }],
    title: 'Qiskit Fall Fest 2026 × QuantumX Hack Day',
    description: 'Top 10 finalist on 1 November 2026 with a hybrid quantum-classical medical classification model.',
    outcome: 'Top 10 Finalist',
    href: 'https://qff26.quantumx.foundation/kochi-hack',
  },
  {
    id: 'rec-djx',
    group: 'competitions',
    groupLabel: 'Competitions & Mentoring',
    metaLeft: 'DJX · India',
    country: 'IN',
    symbols: [{ src: '/src/assets/symbols/djx.jpg', alt: 'DJX Hack 2.0 event mark' }],
    title: 'DJX Hackathon 2.0 — 1st Prize Winner & Mentor',
    description:
      'Won 1st Prize (₹50,000) while serving as a mentor, guiding student and indie XR teams on spatial prototyping and interaction design.',
    outcome: '1st Prize · ₹50,000 · Mentor',
    tags: ['1st Prize', '₹50,000 Award', 'XR Mentoring'],
    href: 'https://djxhackathon.devpost.com/',
  },
  {
    id: 'rec-interiit',
    group: 'competitions',
    groupLabel: 'Competitions & Mentoring',
    metaLeft: 'IIT Jodhpur · 2023',
    country: 'IN',
    symbols: [
      {
        src: '/src/assets/symbols/inter_iit.jpg',
        alt: 'Inter IIT Tech Meet Madras 2023 official logo',
        wide: true,
        plateTone: 'soft',
      },
    ],
    title: 'Inter IIT Tech Meet 12.0 — Game Development',
    description: 'Selected for IIT Jodhpur’s Inter IIT Tech Meet 12.0 contingent pool in Game Development.',
    outcome: 'Contingent Selection',
  },
  {
    id: 'rec-codechef',
    group: 'competitions',
    groupLabel: 'Competitions & Mentoring',
    metaLeft: 'CodeChef · India',
    country: 'IN',
    symbols: [{ src: '/src/assets/symbols/codechef.png', alt: 'CodeChef official symbol' }],
    title: 'Problem Solver — Diamond Badge',
    description: 'Sustained competitive programming practice across data structures, graph algorithms, and dynamic programming.',
    outcome: '2,821 Solved',
    href: 'https://www.codechef.com/users/ashish_q121',
  },
  // Education & Training
  {
    id: 'edu-iitj',
    group: 'education',
    groupLabel: 'Education & Training',
    metaLeft: 'MSc · 2022–2024',
    country: 'IN',
    symbols: [
      {
        src: '/src/assets/symbols/iit_jodhpur.png',
        alt: 'IIT Jodhpur official logo',
        wide: true,
        plateTone: 'plum',
      },
    ],
    title: 'MSc Digital Humanities — IIT Jodhpur',
    description: 'Interdisciplinary Research Platform (IDRP), IIT Jodhpur. Coursework: DSA, Programming, Android, HCI, AR/VR Content Creation, Machine Learning, R, Databases, Software Engineering.',
    outcome: 'Graduated · India',
    href: 'https://iitj.ac.in/dh/en/msc-digital-humanities',
  },
  {
    id: 'edu-gitam',
    group: 'education',
    groupLabel: 'Education & Training',
    metaLeft: 'BSc · 2018–2021',
    country: 'IN',
    symbols: [
      {
        src: '/src/assets/symbols/gitam.png',
        alt: 'GITAM University official logo',
        wide: true,
      },
    ],
    title: 'BSc Bioinformatics — GITAM University',
    description: 'School of Sciences, Visakhapatnam. Coursework: DBMS, Data Analytics, Unix, Programming, Computational Biology, Drug Design.',
    outcome: 'Graduated · India',
    href: 'https://www.gitam.edu/',
  },
  {
    id: 'edu-fastfutures',
    group: 'education',
    groupLabel: 'Education & Training',
    metaLeft: '2022 · Avado, UK',
    country: 'GB',
    symbols: [{ src: '/src/assets/symbols/fastfutures.png', alt: 'FastFutures official symbol' }],
    title: 'FastFutures Programme Graduate',
    description: '12-week digital business skills programme covering Entrepreneurship, Data & Technology, Marketing, Finance, and Teamwork.',
    outcome: 'Certificate of Graduation',
    href: 'https://www.fastfutures.com/for-individuals/fastfutures/programme-overview/',
  },
];

export const WRITING_ITEMS: WritingItem[] = [
  {
    label: 'Portfolio',
    icon: 'medium',
    title: 'XR Portfolio: Ashish Kumar',
    href: 'https://medium.com/@akumar49139/xr-portfolio-ashish-kumar-db03c92e3bb0',
  },
  {
    label: 'Summer School',
    country: 'IT',
    symbol: {
      src: '/src/assets/symbols/imt_lucca.svg',
      alt: 'IMT Lucca logo',
      wide: true,
    },
    title: 'Game Design Summer School at IMT Lucca',
    href: 'https://medium.com/@akumar49139/during-the-game-design-summer-school-at-imt-lucca-i-had-an-enriching-experience-that-broadened-my-356c083938d9',
  },
  {
    label: 'Winter School',
    country: 'AE',
    symbol: {
      src: '/src/assets/symbols/nyu_abudhabi.svg',
      alt: 'NYU Abu Dhabi logo',
      wide: true,
      plateTone: 'plum',
    },
    title: 'The Fully Funded NYU Winter School in Computing',
    href: 'https://medium.com/@akumar49139/during-my-time-at-the-fully-funded-nyu-winter-school-in-computing-i-had-the-opportunity-to-immerse-43e826cb11b1',
  },
];

export const LEARNING_RESOURCES: WritingItem[] = [
  {
    label: 'AI Practice',
    icon: 'resource',
    title: 'Deep Agnt · Problems',
    href: 'https://deep-agnt.com/problems',
  },
];

export const PROFILE_LINKS: ProfileLink[] = [
  {
    label: 'Email',
    detail: 'ak6358404@gmail.com',
    href: 'mailto:ak6358404@gmail.com',
    icon: 'email',
    isEmail: true,
  },
  {
    label: 'GitHub',
    detail: 'github.com/Ashish11828 · Projects & code',
    href: 'https://github.com/Ashish11828',
    icon: 'github',
  },
  {
    label: 'LinkedIn',
    detail: 'linkedin.com/in/ashish-kumar-76603216b',
    href: 'https://www.linkedin.com/in/ashish-kumar-76603216b',
    icon: 'linkedin',
  },
  {
    label: 'Wantedly',
    detail: 'wantedly.com/id/ashish_kumar_i',
    href: 'https://www.wantedly.com/id/ashish_kumar_i',
    icon: 'wantedly',
  },
  {
    label: 'Google Scholar',
    detail: 'Publications & citations',
    href: 'https://share.google/NXxM2sSHaWVdn83kw',
    icon: 'scholar',
  },
  {
    label: 'CodeChef',
    detail: 'codechef.com/users/ashish_q121 · 2,821 solved',
    href: 'https://www.codechef.com/users/ashish_q121',
    icon: 'codechef',
  },
  {
    label: 'Deep-ML',
    detail: 'First-principles machine learning algorithm implementations',
    href: 'https://www.deep-ml.com/profile/oaJG47vYJNPTBQ6SBtm8KH2v66a2',
    icon: 'deepml',
  },
  {
    label: 'Kaggle',
    detail: 'kaggle.com/ashishkumarvaid544',
    href: 'https://www.kaggle.com/ashishkumarvaid544',
    icon: 'kaggle',
  },
  {
    label: 'Medium',
    detail: 'medium.com/@akumar49139',
    href: 'https://medium.com/@akumar49139',
    icon: 'medium',
  },
];

export const CV_PDF_URL = 'https://ashish11828.github.io/Ashish-Kumar-CV.pdf';
