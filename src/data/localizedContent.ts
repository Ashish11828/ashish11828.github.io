import type { AnimeReelScene } from '../components/AnimeBackgroundReel';
import { COUNTRY_NAMES, type CountryCode } from '../components/CountryFlag';
import type {
  ExperienceItem,
  ProfileLink,
  ProjectItem,
  RecognitionItem,
  ResearchItem,
  SkillGroup,
  WritingItem,
} from './portfolioData';
import type { LanguageCode } from './translations';

type NonEnglishLang = Exclude<LanguageCode, 'en' | 'en-US'>;

function toUsEnglish(text: string): string {
  return text
    .replace(/\bProgrammes\b/g, 'Programs')
    .replace(/\bprogrammes\b/g, 'programs')
    .replace(/\bProgramme\b/g, 'Program')
    .replace(/\bprogramme\b/g, 'program')
    .replace(/\bNeighbourhoods\b/g, 'Neighborhoods')
    .replace(/\bneighbourhoods\b/g, 'neighborhoods')
    .replace(/\bNeighbourhood\b/g, 'Neighborhood')
    .replace(/\bneighbourhood\b/g, 'neighborhood')
    .replace(/\bNeighbours\b/g, 'Neighbors')
    .replace(/\bneighbours\b/g, 'neighbors')
    .replace(/\bNeighbour\b/g, 'Neighbor')
    .replace(/\bneighbour\b/g, 'neighbor')
    .replace(/\bHonours\b/g, 'Honors')
    .replace(/\bhonours\b/g, 'honors')
    .replace(/\bCentred\b/g, 'Centered')
    .replace(/\bcentred\b/g, 'centered');
}

export const COUNTRY_NAMES_BY_LANG: Record<LanguageCode, Record<CountryCode, string>> = {
  en: COUNTRY_NAMES,
  'en-US': COUNTRY_NAMES,
  es: {
    IN: 'India',
    DE: 'Alemania',
    JP: 'Japón',
    US: 'Estados Unidos',
    IT: 'Italia',
    PL: 'Polonia',
    AE: 'Emiratos Árabes Unidos',
    ES: 'España',
    EE: 'Estonia',
    GB: 'Reino Unido',
    PT: 'Portugal',
    FR: 'Francia',
  },
  de: {
    IN: 'Indien',
    DE: 'Deutschland',
    JP: 'Japan',
    US: 'USA',
    IT: 'Italien',
    PL: 'Polen',
    AE: 'Vereinigte Arabische Emirate',
    ES: 'Spanien',
    EE: 'Estland',
    GB: 'Vereinigtes Königreich',
    PT: 'Portugal',
    FR: 'Frankreich',
  },
  ja: {
    IN: 'インド',
    DE: 'ドイツ',
    JP: '日本',
    US: 'アメリカ',
    IT: 'イタリア',
    PL: 'ポーランド',
    AE: 'アラブ首長国連邦',
    ES: 'スペイン',
    EE: 'エストニア',
    GB: 'イギリス',
    PT: 'ポルトガル',
    FR: 'フランス',
  },
  pt: {
    IN: 'Índia',
    DE: 'Alemanha',
    JP: 'Japão',
    US: 'Estados Unidos',
    IT: 'Itália',
    PL: 'Polônia',
    AE: 'Emirados Árabes Unidos',
    ES: 'Espanha',
    EE: 'Estônia',
    GB: 'Reino Unido',
    PT: 'Portugal',
    FR: 'França',
  },
  fr: {
    IN: 'Inde',
    DE: 'Allemagne',
    JP: 'Japon',
    US: 'États-Unis',
    IT: 'Italie',
    PL: 'Pologne',
    AE: 'Émirats Arabes Unis',
    ES: 'Espagne',
    EE: 'Estonie',
    GB: 'Royaume-Uni',
    PT: 'Portugal',
    FR: 'France',
  },
};

export function getLocalizedCountryName(code: CountryCode, lang: LanguageCode): string {
  return COUNTRY_NAMES_BY_LANG[lang]?.[code] ?? COUNTRY_NAMES[code];
}

export const METRIC_VALUES_BY_LANG: Record<LanguageCode, [string, string, string, string]> = {
  en: ['4 Papers', 'Top 100', '1st Prize', '2,821'],
  'en-US': ['4 Papers', 'Top 100', '1st Prize', '2,821'],
  es: ['4 Artículos', 'Top 100', '1.er Premio', '2,821'],
  de: ['4 Paper', 'Top 100', '1. Preis', '2.821'],
  ja: ['4 論文', 'Top 100', '最優秀賞', '2,821'],
  pt: ['4 Artigos', 'Top 100', '1º Prêmio', '2.821'],
  fr: ['4 Articles', 'Top 100', '1er Prix', '2 821'],
};

interface ReelSceneTranslation {
  shortLabel: string;
  title: string;
  caption: string;
}

const REEL_SCENES_TRANSLATIONS: Record<NonEnglishLang, Record<string, ReelSceneTranslation>> = {
  es: {
    'focus-xr': {
      shortLabel: 'XR',
      title: 'Realidad Extendida y Gafas Inteligentes',
      caption: 'Diseñando óptica espacial manos libres, HUDs de realidad mixta y prototipos de gafas inteligentes.',
    },
    'focus-ai': {
      shortLabel: 'IA',
      title: 'IA Centrada en el Humano y Agéntica',
      caption: 'Construyendo sistemas inteligentes confiables, interpretables y con supervisión humana.',
    },
    'focus-ml': {
      shortLabel: 'ML',
      title: 'Aprendizaje Automático y Visión',
      caption: 'Creando pipelines reproducibles, modelos de percepción de profundidad y algoritmos desde cero.',
    },
    'focus-quantum': {
      shortLabel: 'Cuántica',
      title: 'Computación Cuántica y QML',
      caption: 'Explorando circuitos híbridos cuántico-clásicos, cúbits parametrizados y clasificación clínica con Qiskit y PennyLane.',
    },
    'focus-robotics': {
      shortLabel: 'Robótica',
      title: 'Robótica Corporizada y Cinemática',
      caption: 'Conectando percepción espacial, trayectorias de precisión y máquinas interactivas.',
    },
    'focus-space': {
      shortLabel: 'Espacio',
      title: 'Ciencia Espacial y Misiones Análogas',
      caption: 'Desarrollando interfaces de realidad mixta manos libres para hábitats análogos planetarios.',
    },
  },
  de: {
    'focus-xr': {
      shortLabel: 'XR',
      title: 'Extended Reality & Smart Glasses',
      caption: 'Entwicklung freihändiger räumlicher Optik, Mixed-Reality-HUDs und Smart-Glasses-Prototypen.',
    },
    'focus-ai': {
      shortLabel: 'KI',
      title: 'Menschzentrierte & Agentische KI',
      caption: 'Entwicklung vertrauenswürdiger, interpretierbarer und Human-in-the-Loop-KI-Systeme.',
    },
    'focus-ml': {
      shortLabel: 'ML',
      title: 'Maschinelles Lernen & Computer Vision',
      caption: 'Reproduzierbare ML-Pipelines, Tiefenwahrnehmungsmodelle und Algorithmen von Grund auf.',
    },
    'focus-quantum': {
      shortLabel: 'Quanten',
      title: 'Quantencomputing & QML',
      caption: 'Hybride Quanten-Klassik-Schaltkreise, parametrisierte Qubits und klinische Klassifikation mit Qiskit und PennyLane.',
    },
    'focus-robotics': {
      shortLabel: 'Robotik',
      title: 'Verkörperte Robotik & Kinematik',
      caption: 'Verbindung von räumlicher Sensorik, präzisen Bewegungsbahnen und interaktiven Maschinen.',
    },
    'focus-space': {
      shortLabel: 'Raumfahrt',
      title: 'Raumfahrt & Analogmissionen',
      caption: 'Freihändige Mixed-Reality-Missionsinterfaces für planetare Analoghabitate.',
    },
  },
  ja: {
    'focus-xr': {
      shortLabel: 'XR',
      title: '拡張現実 (XR) ＆ スマートグラス',
      caption: 'ハンズフリー空間光学、複合現実HUD、スマートグラス・プロトタイプを設計。',
    },
    'focus-ai': {
      shortLabel: 'AI',
      title: '人間中心AI ＆ エージェントAI',
      caption: '信頼性・解釈性が高く、人間参加型で機能する知的システムを構築。',
    },
    'focus-ml': {
      shortLabel: 'ML',
      title: '機械学習 ＆ コンピュータビジョン',
      caption: '再現性の高い学習パイプライン、深度推定モデル、基礎アルゴリズムを実装。',
    },
    'focus-quantum': {
      shortLabel: '量子',
      title: '量子コンピューティング ＆ QML',
      caption: 'QiskitとPennyLaneを用いたハイブリッド量子古典回路、パラメータ化量子ビット、医療分類を探求。',
    },
    'focus-robotics': {
      shortLabel: 'ロボティクス',
      title: '身体性ロボティクス ＆ キネマティクス',
      caption: '空間センシング、精密軌道制御、インタラクティブな身体性マシンを接続。',
    },
    'focus-space': {
      shortLabel: '宇宙科学',
      title: '宇宙科学 ＆ アナログミッション',
      caption: '惑星アナログ居住施設向けのハンズフリー複合現実ミッションUIを開発。',
    },
  },
  pt: {
    'focus-xr': {
      shortLabel: 'XR',
      title: 'Realidade Estendida & Óculos Inteligentes',
      caption: 'Projetando óptica espacial sem as mãos, HUDs de realidade mista e protótipos de óculos inteligentes.',
    },
    'focus-ai': {
      shortLabel: 'IA',
      title: 'IA Centrada no Humano & Agêntica',
      caption: 'Construindo sistemas inteligentes confiáveis, interpretáveis e com supervisão humana.',
    },
    'focus-ml': {
      shortLabel: 'ML',
      title: 'Aprendizado de Máquina & Visão',
      caption: 'Criando pipelines reproduzíveis, modelos de profundidade e algoritmos a partir dos fundamentos.',
    },
    'focus-quantum': {
      shortLabel: 'Quântica',
      title: 'Computação Quântica & QML',
      caption: 'Explorando circuitos híbridos quântico-clássicos, qubits parametrizados e classificação clínica com Qiskit e PennyLane.',
    },
    'focus-robotics': {
      shortLabel: 'Robótica',
      title: 'Robótica Incorporada & Cinemática',
      caption: 'Unindo percepção espacial, trajetórias de precisão e máquinas interativas.',
    },
    'focus-space': {
      shortLabel: 'Espaço',
      title: 'Ciência Espacial & Missões Análogas',
      caption: 'Desenvolvendo interfaces de realidade mista sem as mãos para habitats análogos planetários.',
    },
  },
  fr: {
    'focus-xr': {
      shortLabel: 'XR',
      title: 'Réalité Étendue & Lunettes Connectées',
      caption: 'Conception d’optiques spatiales mains libres, de HUD en réalité mixte et de prototypes de lunettes connectées.',
    },
    'focus-ai': {
      shortLabel: 'IA',
      title: 'IA Centrée sur l’Humain & Agentique',
      caption: 'Création de systèmes intelligents fiables, interprétables et supervisés par l’humain.',
    },
    'focus-ml': {
      shortLabel: 'ML',
      title: 'Apprentissage Automatique & Vision',
      caption: 'Conception de pipelines reproductibles, modèles de profondeur et algorithmes fondamentaux.',
    },
    'focus-quantum': {
      shortLabel: 'Quantique',
      title: 'Informatique Quantique & QML',
      caption: 'Exploration de circuits hybrides quantiques-classiques, qubits paramétrés et classification clinique avec Qiskit et PennyLane.',
    },
    'focus-robotics': {
      shortLabel: 'Robotique',
      title: 'Robotique Incarnée & Cinématique',
      caption: 'Alliance de la perception spatiale, des trajectoires de précision et des machines interactives.',
    },
    'focus-space': {
      shortLabel: 'Espace',
      title: 'Sciences Spatiales & Missions Analogues',
      caption: 'Développement d’interfaces de réalité mixte mains libres pour les habitats analogues planétaires.',
    },
  },
};

export function getLocalizedReelScene(
  scene: AnimeReelScene,
  lang: LanguageCode
): AnimeReelScene {
  if (lang === 'en') return scene;
  if (lang === 'en-US') {
    return {
      ...scene,
      title: toUsEnglish(scene.title),
      caption: toUsEnglish(scene.caption),
    };
  }
  const loc = REEL_SCENES_TRANSLATIONS[lang]?.[scene.id];
  if (!loc) return scene;
  return { ...scene, ...loc };
}

export const FOCUS_AREAS_BY_LANG: Record<
  NonEnglishLang,
  { label: string; detail: string }[]
> = {
  es: [
    { label: 'XR', detail: 'Gafas inteligentes y óptica espacial' },
    { label: 'IA', detail: 'Modelos centrados en el humano y agénticos' },
    { label: 'Aprendizaje Automático', detail: 'Visión por computadora y sistemas de aprendizaje' },
    { label: 'Computación Cuántica', detail: 'Circuitos híbridos de cúbits y QML' },
    { label: 'Robótica', detail: 'Máquinas interactivas corporizadas' },
    { label: 'Ciencia Espacial', detail: 'Interfaces para hábitats análogos' },
  ],
  de: [
    { label: 'XR', detail: 'Smart Glasses & räumliche Optik' },
    { label: 'KI', detail: 'Menschzentrierte & agentische Modelle' },
    { label: 'Maschinelles Lernen', detail: 'Computer Vision & Lernsysteme' },
    { label: 'Quantencomputing', detail: 'Hybride Qubit-Schaltkreise & QML' },
    { label: 'Robotik', detail: 'Verkörperte interaktive Maschinen' },
    { label: 'Raumfahrtwissenschaft', detail: 'Analoghabitat-Missionsinterfaces' },
  ],
  ja: [
    { label: 'XR', detail: 'スマートグラスと空間光学' },
    { label: 'AI', detail: '人間中心・エージェントモデル' },
    { label: '機械学習', detail: 'コンピュータビジョンと学習システム' },
    { label: '量子コンピューティング', detail: 'ハイブリッド量子回路とQML' },
    { label: 'ロボティクス', detail: '身体性インタラクティブマシン' },
    { label: '宇宙科学', detail: 'アナログ居住施設のミッションUI' },
  ],
  pt: [
    { label: 'XR', detail: 'Óculos inteligentes e óptica espacial' },
    { label: 'IA', detail: 'Modelos centrados no humano e agênticos' },
    { label: 'Aprendizado de Máquina', detail: 'Visão computacional e sistemas de ML' },
    { label: 'Computação Quântica', detail: 'Circuitos híbridos de qubits e QML' },
    { label: 'Robótica', detail: 'Máquinas interativas incorporadas' },
    { label: 'Ciência Espacial', detail: 'Interfaces para missões análogas' },
  ],
  fr: [
    { label: 'XR', detail: 'Lunettes connectées & optique spatiale' },
    { label: 'IA', detail: 'Modèles centrés sur l’humain & agentiques' },
    { label: 'Apprentissage Automatique', detail: 'Vision par ordinateur & systèmes ML' },
    { label: 'Informatique Quantique', detail: 'Circuits hybrides à qubits & QML' },
    { label: 'Robotique', detail: 'Machines interactives incarnées' },
    { label: 'Sciences Spatiales', detail: 'Interfaces de missions analogues' },
  ],
};

export const RESEARCH_INTERESTS_BY_LANG: Record<
  NonEnglishLang,
  { label: string; detail: string }[]
> = {
  es: [
    { label: 'Seguridad de IA', detail: 'Confianza, fiabilidad y evaluación' },
    { label: 'Ciencia del Cerebro', detail: 'Mente, cognición y percepción' },
    { label: 'Neurocomputación', detail: 'Computación con sensores neuronales' },
  ],
  de: [
    { label: 'KI-Sicherheit', detail: 'Vertrauen, Zuverlässigkeit & Evaluation' },
    { label: 'Hirnforschung', detail: 'Geist, Kognition & Wahrnehmung' },
    { label: 'Neurocomputing', detail: 'Neuronale Sensorik-Berechnung' },
  ],
  ja: [
    { label: 'AI安全性', detail: '信頼性・堅牢性・評価手法' },
    { label: '脳科学', detail: '心・認知・知覚の探究' },
    { label: 'ニューロコンピューティング', detail: '生体神経センシング計算' },
  ],
  pt: [
    { label: 'Segurança de IA', detail: 'Confiança, confiabilidade e avaliação' },
    { label: 'Ciência do Cérebro', detail: 'Mente, cognição e percepção' },
    { label: 'Neurocomputação', detail: 'Computação com sensoriamento neural' },
  ],
  fr: [
    { label: 'Sûreté de l’IA', detail: 'Confiance, fiabilité & évaluation' },
    { label: 'Sciences du Cerveau', detail: 'Esprit, cognition & perception' },
    { label: 'Neuroinformatique', detail: 'Calcul par capteurs neuronaux' },
  ],
};

export const SKILL_GROUPS_BY_LANG: Record<
  NonEnglishLang,
  { category: string; subtitle: string; items: string[] }[]
> = {
  es: [
    { category: 'Plataformas XR', subtitle: 'Dispositivos y Óptica', items: ['Meta Quest', 'HoloLens 2', 'Snap Spectacles'] },
    { category: 'Motores y SDKs', subtitle: 'Entornos Espaciales', items: ['Unity', 'Unreal Engine', 'Lens Studio', 'MRTK', 'Vuforia', 'Spectacles Interaction Kit'] },
    { category: 'Lenguajes', subtitle: 'Ingeniería Base', items: ['Python', 'C++', 'TypeScript', 'C#', 'JavaScript'] },
    { category: '3D y Diseño', subtitle: 'Activos e Interfaces', items: ['Blender', 'Substance Painter', 'Figma'] },
    { category: 'Computación Cuántica', subtitle: 'Circuitos Híbridos', items: ['Qiskit', 'PennyLane', 'Aprendizaje Cuántico (QML)'] },
    { category: 'Datos y ML', subtitle: 'Modelado y Sistemas', items: ['Ingeniería de Datos', 'Aprendizaje Automático', 'Visión por Computadora', 'DBMS', 'Analítica de Datos'] },
  ],
  de: [
    { category: 'XR-Plattformen', subtitle: 'Geräte & Optik', items: ['Meta Quest', 'HoloLens 2', 'Snap Spectacles'] },
    { category: 'Engines & SDKs', subtitle: 'Spatial Toolchains', items: ['Unity', 'Unreal Engine', 'Lens Studio', 'MRTK', 'Vuforia', 'Spectacles Interaction Kit'] },
    { category: 'Programmiersprachen', subtitle: 'Kernentwicklung', items: ['Python', 'C++', 'TypeScript', 'C#', 'JavaScript'] },
    { category: '3D & Gestaltung', subtitle: 'Assets & UI-Design', items: ['Blender', 'Substance Painter', 'Figma'] },
    { category: 'Quantencomputing', subtitle: 'Hybride Schaltkreise', items: ['Qiskit', 'PennyLane', 'Quanten-ML (QML)'] },
    { category: 'Daten & ML', subtitle: 'Modellierung & Systeme', items: ['Data Engineering', 'Maschinelles Lernen', 'Computer Vision', 'DBMS', 'Datenanalyse'] },
  ],
  ja: [
    { category: 'XRプラットフォーム', subtitle: 'デバイス・光学', items: ['Meta Quest', 'HoloLens 2', 'Snap Spectacles'] },
    { category: 'エンジン・SDK', subtitle: '空間ツールチェーン', items: ['Unity', 'Unreal Engine', 'Lens Studio', 'MRTK', 'Vuforia', 'Spectacles Interaction Kit'] },
    { category: 'プログラミング言語', subtitle: 'コア開発', items: ['Python', 'C++', 'TypeScript', 'C#', 'JavaScript'] },
    { category: '3D・クラフト', subtitle: 'アセット＆UI設計', items: ['Blender', 'Substance Painter', 'Figma'] },
    { category: '量子コンピューティング', subtitle: 'ハイブリッド回路', items: ['Qiskit', 'PennyLane', '量子機械学習 (QML)'] },
    { category: 'データ・機械学習', subtitle: 'モデリング＆システム', items: ['データエンジニアリング', '機械学習', 'コンピュータビジョン', 'DBMS', 'データ分析'] },
  ],
  pt: [
    { category: 'Plataformas XR', subtitle: 'Dispositivos e Óptica', items: ['Meta Quest', 'HoloLens 2', 'Snap Spectacles'] },
    { category: 'Motores e SDKs', subtitle: 'Ferramentas Espaciais', items: ['Unity', 'Unreal Engine', 'Lens Studio', 'MRTK', 'Vuforia', 'Spectacles Interaction Kit'] },
    { category: 'Linguagens', subtitle: 'Engenharia Base', items: ['Python', 'C++', 'TypeScript', 'C#', 'JavaScript'] },
    { category: '3D e Design', subtitle: 'Ativos e UI', items: ['Blender', 'Substance Painter', 'Figma'] },
    { category: 'Computação Quântica', subtitle: 'Circuitos Híbridos', items: ['Qiskit', 'PennyLane', 'Quantum ML'] },
    { category: 'Dados e ML', subtitle: 'Modelagem e Sistemas', items: ['Engenharia de Dados', 'Aprendizado de Máquina', 'Visão Computacional', 'DBMS', 'Análise de Dados'] },
  ],
  fr: [
    { category: 'Plateformes XR', subtitle: 'Appareils & Optique', items: ['Meta Quest', 'HoloLens 2', 'Snap Spectacles'] },
    { category: 'Moteurs & SDKs', subtitle: 'Chaînes Spatiales', items: ['Unity', 'Unreal Engine', 'Lens Studio', 'MRTK', 'Vuforia', 'Spectacles Interaction Kit'] },
    { category: 'Langages', subtitle: 'Ingénierie Cœur', items: ['Python', 'C++', 'TypeScript', 'C#', 'JavaScript'] },
    { category: '3D & Design', subtitle: 'Modélisation & UI', items: ['Blender', 'Substance Painter', 'Figma'] },
    { category: 'Informatique Quantique', subtitle: 'Circuits Hybrides', items: ['Qiskit', 'PennyLane', 'Apprentissage Quantique (QML)'] },
    { category: 'Données & ML', subtitle: 'Modélisation & Systèmes', items: ['Ingénierie des Données', 'Apprentissage Automatique', 'Vision par Ordinateur', 'SGBD', 'Analyse de Données'] },
  ],
};

export function getLocalizedSkillGroups(groups: SkillGroup[], lang: LanguageCode): SkillGroup[] {
  if (lang === 'en' || lang === 'en-US') return groups;
  const loc = SKILL_GROUPS_BY_LANG[lang];
  return groups.map((g, i) => (loc[i] ? { ...g, ...loc[i] } : g));
}

interface ProjectLocalization {
  title?: string;
  categoryLabel: string;
  venue?: string;
  summary: string;
  contribution: string;
  outcome: string;
  linkLabels: string[];
}

const PROJECTS_TRANSLATIONS: Record<NonEnglishLang, Record<string, ProjectLocalization>> = {
  es: {
    medcaresnap: {
      categoryLabel: 'Snap Spectacles · AR Espacial',
      venue: 'Finalista XRCC 2026 · Demo VR Summit 2026',
      summary:
        'Guía AR manos libres para emergencias cardíacas con posición de manos y ritmo de RCP junto con un localizador de DEA controlado por voz con distancia y flechas espaciales.',
      contribution:
        'Prototipado de guía RCP manos libres y localización de DEA con Lens Studio, Python, WebSockets, VoiceML e interfaces gestuales.',
      outcome:
        'Finalista oficial de XRCC 2026 (entre ~190 propuestas globales) y aceptado en el programa oficial de demos del VR Summit 2026.',
      linkLabels: ['Repositorio GitHub', 'Programa VR Summit'],
    },
    'roboxr-ai': {
      categoryLabel: 'XREAL · Android XR · Robótica',
      venue: 'Startup Buildathon India 2026 — Kochi',
      summary:
        'Plataforma XR para enseñanza de robots, guardrails deterministas ISO 10218 y recuperación de anomalías CNC en 30 segundos, creada para XREAL y Android XR en Startup Buildathon India 2026.',
      contribution:
        'Arquitectura de 4 etapas en Kotlin y Jetpack Compose combinando Gemini AI Logic con planificador offline en Kotlin, vectores 3D pick-and-place, seguridad determinista y auditoría criptográfica SHA-256 en Firebase Firestore.',
      outcome:
        'Desarrollado y entregado para la ronda Kochi de Startup Buildathon India 2026 (con Google DeepMind y Google Cloud, 20–21 nov 2026) con app completa, reglas Firestore y cadena de auditoría.',
      linkLabels: ['Demo en Vivo', 'Repositorio GitHub', 'Startup Buildathon India'],
    },
    fraudlens: {
      categoryLabel: 'UX Accesible · Gafas Inteligentes',
      venue: 'Build the Invisible · Hackathon Meta Ray-Ban Display Mumbai',
      summary:
        'Experiencia accesible de prevención de estafas creada para la vista de 600 × 600 de Meta Ray-Ban Display, con guías claras para detectar tácticas de presión y señales de alerta.',
      contribution:
        'Codesarrollado con Manav Rajpurohit (Team Invisible Creator); implementación de lectura en voz alta, escala de texto ajustable, alto contraste y movimiento reducido.',
      outcome:
        'Aplicación web en vivo y demo grabada con reglas locales deterministas y avisos fijos sin depender de un verificador de IA.',
      linkLabels: ['App en Vivo', 'Ver Demo', 'GitHub'],
    },
    'hololens-sewing': {
      title: 'Guía de Mantenimiento para Máquina de Coser Inteligente',
      categoryLabel: 'HoloLens 2 · AR Industrial',
      venue: 'Beca Meta XROS · NIFT-Delhi',
      summary:
        'Guía de realidad mixta manos libres para aprender el mantenimiento de máquinas industriales de sellado de costuras mediante ensamblajes espaciales manipulables.',
      contribution:
        'Codesarrollado con Vibhanshu Singh Sindhu bajo mentoría de NIFT-Delhi durante una beca XR de código abierto de tres meses apoyada por Meta.',
      outcome:
        'Prototipo completo en HoloLens 2 entregado en tres meses; reconocido como Becario en el informe de resultados de FICCI XROS Fellowship (página 29).',
      linkLabels: ['Repositorio GitHub'],
    },
    'khaali-dabba': {
      categoryLabel: 'Snap Spectacles · Narrativa Espacial',
      venue: 'Programa de Residencia DJX 2026',
      summary:
        'Experiencia narrativa espacial interactiva en miniatura sobre un vecindario indio: explora callejones, descubre pistas sobre tres vecinos, elige un regalo y entrégalo en su puerta.',
      contribution:
        'Diseño y desarrollo del prototipo de narrativa espacial para Snap Spectacles con TypeScript e interacciones ancladas al mundo.',
      outcome:
        'Prototipo espacial jugable desarrollado durante la Residencia DJX 2026, listo para validación en hardware.',
      linkLabels: ['Repositorio GitHub'],
    },
    'quantumx-alzheimers': {
      title: 'Clasificación de Alzheimer QuantumX',
      categoryLabel: 'ML Cuántico · Salud',
      venue: 'Qiskit Fall Fest 2026 × QuantumX · Finalista Top 10',
      summary:
        'Clasifica la enfermedad de Alzheimer y el deterioro cognitivo leve a partir de 9 variables clínicas comprimidas en un circuito parametrizado de 4 cúbits, con panel explicable en Streamlit.',
      contribution:
        'Aportación al pipeline híbrido cuántico-clásico en equipo, comparativa de referencia y herramientas de explicabilidad clínica.',
      outcome:
        'Finalista Top 10 en Quantum Hack Day Kochi. Alcanzó 76.5 % de precisión frente a 77.5 % de SVM clásico en 39 sujetos OASIS-1 (reportado con transparencia sin reclamar ventaja cuántica).',
      linkLabels: ['Repositorio GitHub'],
    },
    'protect-safety-ai': {
      categoryLabel: 'Seguridad IA · Kit de Evaluación',
      summary:
        'Kit reproducible en Python para auditar falsas alarmas, detecciones omitidas y disparidades de iluminación o ruido en sistemas automatizados de supervisión.',
      contribution:
        'Desarrollo de diagnósticos de matriz de confusión, validación estricta de entradas, desgloses ambientales y recomendaciones estructuradas de revisión humana.',
      outcome:
        'Suite reproducible de CLI e informes JSON respaldada por pruebas unitarias sobre 12 eventos sintéticos de referencia.',
      linkLabels: ['Código y Uso'],
    },
    'ml-from-scratch': {
      title: 'Aprendizaje Automático desde Cero',
      categoryLabel: 'Fundamentos ML · Algoritmos',
      summary:
        'Colección curada de algoritmos de aprendizaje automático implementados desde primeros principios sin cajas negras: regresión, escalado, kernels, codificación y métricas.',
      contribution:
        'Implementación desde cero de descenso de gradiente, regresión lineal por ecuación normal, regularización ridge y evaluadores de precisión/exhaustividad/F-score.',
      outcome:
        '11 soluciones documentadas y verificadas junto con un portafolio web interactivo de progreso.',
      linkLabels: ['Portafolio Interactivo', 'GitHub'],
    },
  },
  de: {
    medcaresnap: {
      categoryLabel: 'Snap Spectacles · Spatial AR',
      venue: 'XRCC 2026 Finalist · VR Summit 2026 Demo',
      summary:
        'Freihändige AR-Anleitung für Herznotfälle mit HLW-Handposition und Druckrhythmus sowie sprachgesteuertem AED-Locator mit Live-Distanz und Richtungspfeilen.',
      contribution:
        'Prototyp für freihändige HLW-Anleitung und AED-Suche mit Lens Studio, Python, WebSockets, VoiceML und Gestensteuerung.',
      outcome:
        'Offizieller Finalist der XRCC 2026 (aus ~190 weltweiten Einreichungen) und angenommen für das offizielle Demo-Programm des VR Summit 2026.',
      linkLabels: ['GitHub-Repository', 'VR-Summit-Programm'],
    },
    'roboxr-ai': {
      categoryLabel: 'XREAL · Android XR · Robotik',
      venue: 'Startup Buildathon India 2026 — Kochi',
      summary:
        'XR-first-Plattform für Roboter-Teaching, deterministische ISO-10218-Sicherheitsgrenzen und 30-Sekunden-CNC-Anomaliebehebung für XREAL & Android XR beim Startup Buildathon India 2026.',
      contribution:
        '4-stufige Kotlin- & Jetpack-Compose-Architektur aus Gemini AI Logic und Offline-Kotlin-Planer, 3D-Pick-and-Place-Ankervektoren, deterministischer Sicherheitsprüfung und unveränderlichen SHA-256-Firestore-Audit-Logs.',
      outcome:
        'Entwickelt für die Kochi-Runde des Startup Buildathon India 2026 (mit Google DeepMind & Google Cloud, 20.–21. Nov. 2026) inkl. vollständiger Android-XR-App, Firestore-Regeln und Audit-Kette.',
      linkLabels: ['Live-Demo', 'GitHub-Repository', 'Startup Buildathon India'],
    },
    fraudlens: {
      categoryLabel: 'Barrierefreie UX · Smart Glasses',
      venue: 'Build the Invisible · Mumbai Meta Ray-Ban Display Hackathon',
      summary:
        'Barrierefreie Betrugsprävention für das 600 × 600-Display der Meta Ray-Ban Smart Glasses mit klaren Hinweisen zum Erkennen von Drucktaktiken und Warnsignalen.',
      contribution:
        'Gemeinsam mit Manav Rajpurohit (Team Invisible Creator) entwickelt; Vorlesefunktion, skalierbare Schrift, hoher Kontrast und reduzierte Bewegung.',
      outcome:
        'Live-Web-App und aufgezeichnete Demo auf Basis deterministischer lokaler Regeln ohne externen KI-Prüfer.',
      linkLabels: ['Live-App', 'Demo ansehen', 'GitHub'],
    },
    'hololens-sewing': {
      title: 'Intelligente Wartungsanleitung für Industrienähmaschinen',
      categoryLabel: 'HoloLens 2 · Industrielle AR',
      venue: 'Meta XROS Fellowship · NIFT-Delhi',
      summary:
        'Freihändige Mixed-Reality-Anleitung zur Wartung industrieller Nahtversiegelungsmaschinen mit direkt per Hand steuerbaren 3D-Baugruppen.',
      contribution:
        'Gemeinsam mit Vibhanshu Singh Sindhu unter NIFT-Delhi-Mentoring in einem dreimonatigen Meta-geförderten Open-Source-XR-Stipendium entwickelt.',
      outcome:
        'Vollständiger HoloLens-2-Teamprototyp nach drei Monaten; als Fellow im FICCI-XROS-Abschlussbericht (Seite 29) gewürdigt.',
      linkLabels: ['GitHub-Repository'],
    },
    'khaali-dabba': {
      categoryLabel: 'Snap Spectacles · Räumliches Storytelling',
      venue: 'DJX 2026 Residency-Programm',
      summary:
        'Interaktives Miniatur-Nachbarschafts-Storytelling in räumlicher AR: Erkunde Gassen, entdecke Hinweise zu drei Nachbarn, wähle ein passendes Geschenk und liefere es an ihrer Haustür ab.',
      contribution:
        'Konzeption und Entwicklung des räumlichen Storytelling-Prototyps für Snap Spectacles mit TypeScript und Weltverankerung.',
      outcome:
        'Spielbarer Prototyp aus der DJX 2026 Residency, vorbereitet für Hardware-Tests auf der Brille.',
      linkLabels: ['GitHub-Repository'],
    },
    'quantumx-alzheimers': {
      title: 'QuantumX Alzheimer-Klassifikation',
      categoryLabel: 'Quanten-ML · Medizin',
      venue: 'Qiskit Fall Fest 2026 × QuantumX · Top-10-Finalist',
      summary:
        'Klassifiziert Alzheimer und leichte kognitive Beeinträchtigung aus 9 klinischen Merkmalen in einem parametrisierten 4-Qubit-Schaltkreis inklusive Streamlit-Erklärbarkeits-Dashboard.',
      contribution:
        'Mitarbeit an der hybriden Quanten-Klassik-Pipeline, Benchmark-Vergleich und klinischen Erklärbarkeits-Tools.',
      outcome:
        'Top-10-Finalist beim Quantum Hack Day Kochi. 76,5 % Genauigkeit vs. 77,5 % klassische SVM auf 39 OASIS-1-Fällen (transparent ohne Quantenvorteil-Anspruch berichtet).',
      linkLabels: ['GitHub-Repository'],
    },
    'protect-safety-ai': {
      categoryLabel: 'KI-Sicherheit · Evaluations-Toolkit',
      summary:
        'Reproduzierbares Python-Evaluationstoolkit zur Prüfung von Fehlalarmen, übersehenen Ereignissen sowie Licht- und Lärm-Disparitäten in automatisierten Aufsichtssystemen.',
      contribution:
        'Entwicklung von Konfusionsmatrix-Diagnostik, strikter Eingabevalidierung, Umgebungsanalysen und strukturierten Eskalationsempfehlungen für menschliche Prüfung.',
      outcome:
        'Reproduzierbare CLI- und JSON-Reporting-Suite mit Unit-Tests über 12 synthetische Benchmark-Ereignisse.',
      linkLabels: ['Quellcode & Nutzung'],
    },
    'ml-from-scratch': {
      title: 'Maschinelles Lernen von Grund auf',
      categoryLabel: 'ML-Grundlagen · Algorithmen',
      summary:
        'Kuratierte Sammlung grundlegender ML-Algorithmen ohne Black-Box-Bibliotheken: Regression, Skalierung, Kernel, Kodierung und Evaluationsmetriken.',
      contribution:
        'Implementierung von Gradientenabstieg, Normalengleichung, Ridge-Regularisierung sowie Precision/Recall/F-Score-Metriken von Grund auf.',
      outcome:
        '11 dokumentierte, verifizierte Lösungen veröffentlicht mit einem interaktiven Web-Fortschrittsportfolio.',
      linkLabels: ['Interaktives Portfolio', 'GitHub'],
    },
  },
  ja: {
    medcaresnap: {
      categoryLabel: 'Snap Spectacles · 空間AR',
      venue: 'XRCC 2026 ファイナリスト · VR Summit 2026 デモ採択',
      summary:
        '心停止緊急時のハンズフリーAR支援アプリ。胸骨圧迫（CPR）の手の位置とリズム表示に加え、音声操作のAED探索とリアルタイム距離・方向ガイドを提供。',
      contribution:
        'Lens Studio、Python、WebSockets、VoiceML、ジェスチャーUIを用い、ハンズフリーCPRガイドとAED探索をプロトタイプ開発。',
      outcome:
        '世界約190件の応募からXRCC 2026公式ファイナリストに選出され、VR Summit 2026公式デモプログラムにも採択。',
      linkLabels: ['GitHubリポジトリ', 'VR Summit プログラム'],
    },
    'roboxr-ai': {
      categoryLabel: 'XREAL · Android XR · ロボティクス',
      venue: 'Startup Buildathon India 2026 — コーチ',
      summary:
        'Startup Buildathon India 2026向けにXREAL・Android XR上で構築した、XRロボット教示、決定論的ISO 10218安全ガードレール、30秒CNC異常復旧プラットフォーム。',
      contribution:
        'Kotlin & Jetpack ComposeでGemini AI LogicとオフラインKotlinプランナー、3Dピック＆プレース座標アンカー、決定論的安全検証、SHA-256暗号監査ログ（Firebase Firestore）の4段階パイプラインを設計。',
      outcome:
        'Google DeepMind・Google Cloud協賛のStartup Buildathon India 2026（コーチ大会、2026年11月20–21日）向けにアプリ本体・Firestoreセキュリティルール・承認監査チェーンを完遂。',
      linkLabels: ['ライブデモ', 'GitHubリポジトリ', 'Startup Buildathon India'],
    },
    fraudlens: {
      categoryLabel: 'アクセシブルUX · スマートグラス',
      venue: 'Build the Invisible · ムンバイ Meta Ray-Ban Display ハッカソン',
      summary:
        'Meta Ray-Ban Display（600×600）向けに設計されたアクセシビリティ重視の詐欺防止体験。簡潔なガイドで詐欺の圧力手口や警戒サインを判別支援。',
      contribution:
        'Team Invisible CreatorとしてManav Rajpurohitと共同開発。音声読み上げ、文字拡大、ハイコントラスト、モーション軽減モードを実装。',
      outcome:
        '外部AI検証器に依存しない決定論的ローカルルールで動作する公開Webアプリとデモ映像を完成。',
      linkLabels: ['公開アプリ', 'デモを見る', 'GitHub'],
    },
    'hololens-sewing': {
      title: 'スマート工業用ミシン保守ARガイド',
      categoryLabel: 'HoloLens 2 · 産業用AR',
      venue: 'Meta XROS フェローシップ · NIFTデリー',
      summary:
        '工業用シームシーリングミシンの保守手順を学ぶハンズフリー複合現実ガイド。空間投影された分解構造を直接手で操作しながら習得可能。',
      contribution:
        'Meta支援の3か月間オープンソースXRフェローシップにて、NIFTデリーの指導のもとVibhanshu Singh Sindhuと共同開発。',
      outcome:
        '3か月でHoloLens 2実機プロトタイプを完遂し、FICCI XROS成果報告書（29ページ）にてNIFTプロジェクトのフェローとして掲載。',
      linkLabels: ['GitHubリポジトリ'],
    },
    'khaali-dabba': {
      categoryLabel: 'Snap Spectacles · 空間ストーリーテリング',
      venue: 'DJX 2026 レジデンシープログラム',
      summary:
        'インドの路地裏をミニチュア空間で体験するAR物語。路地を巡って3人の隣人のヒントを集め、心のこもった贈り物を選んで玄関先へ届けます。',
      contribution:
        'TypeScriptと空間アンカーインタラクションを用い、Snap Spectacles向け空間ストーリーテリング・プロトタイプを設計・実装。',
      outcome:
        'DJX 2026レジデンシーでプレイ可能な空間プロトタイプを制作し、実機グラス検証向けに整備。',
      linkLabels: ['GitHubリポジトリ'],
    },
    'quantumx-alzheimers': {
      title: 'QuantumX アルツハイマー分類モデル',
      categoryLabel: '量子ML · ヘルスケア',
      venue: 'Qiskit Fall Fest 2026 × QuantumX · トップ10ファイナリスト',
      summary:
        '9つの臨床特徴量を4量子ビットのパラメータ化量子回路へ圧縮し、アルツハイマー病および軽度認知障害を分類。Streamlitによる説明可能性ダッシュボード付き。',
      contribution:
        'チーム開発のハイブリッド量子古典分類パイプライン、古典手法とのベンチマーク比較、臨床説明ツールを担当。',
      outcome:
        'Quantum Hack Day Kochi トップ10ファイナリスト。OASIS-1の39症例で精度76.5%（古典SVM 77.5%）を透明性高く報告（量子超越の誇張なし）。',
      linkLabels: ['GitHubリポジトリ'],
    },
    'protect-safety-ai': {
      categoryLabel: 'AI安全性 · 評価ツールキット',
      summary:
        '自動試験監督アラートにおける誤検知、見逃し、照明・騒音条件間の性能格差を監査するための再現可能なPython評価ツールキット。',
      contribution:
        '混同行列診断、厳密な入力検証、環境条件別の分解分析、人間レビューへのエスカレーション推奨ロジックを構築。',
      outcome:
        '12件の合成ベンチマークイベントに対するユニットテスト付きの再現可能なCLI・JSONレポート基盤を公開。',
      linkLabels: ['ソース＆使い方'],
    },
    'ml-from-scratch': {
      title: 'ゼロから実装する機械学習',
      categoryLabel: 'ML基礎 · アルゴリズム',
      summary:
        'ブラックボックスライブラリを使わず、回帰、特徴量スケーリング、カーネル、エンコーディング、評価指標を第一原理から実装したコレクション。',
      contribution:
        '勾配降下法、正規方程式による線形回帰、リッジ正則化、適合率・再現率・F値評価をゼロから実装。',
      outcome:
        '検証済み11課題のドキュメントと、インタラクティブなWeb進捗ポートフォリオを公開。',
      linkLabels: ['インタラクティブ版', 'GitHub'],
    },
  },
  pt: {
    medcaresnap: {
      categoryLabel: 'Snap Spectacles · RA Espacial',
      venue: 'Finalista XRCC 2026 · Demo VR Summit 2026',
      summary:
        'Guia de RA sem as mãos para emergências cardíacas com posicionamento e ritmo de RCP junto a um localizador de DEA por voz com distância e setas espaciais.',
      contribution:
        'Prototipagem de guia de RCP sem as mãos e localização de DEA com Lens Studio, Python, WebSockets, VoiceML e interfaces por gestos.',
      outcome:
        'Finalista oficial do XRCC 2026 (entre ~190 submissões globais) e aceito no programa oficial de demos do VR Summit 2026.',
      linkLabels: ['Repositório GitHub', 'Programa VR Summit'],
    },
    'roboxr-ai': {
      categoryLabel: 'XREAL · Android XR · Robótica',
      venue: 'Startup Buildathon India 2026 — Kochi',
      summary:
        'Plataforma XR para ensino de robôs, travas determinísticas de segurança ISO 10218 e recuperação de anomalias CNC em 30 segundos para XREAL e Android XR no Startup Buildathon India 2026.',
      contribution:
        'Arquitetura em 4 etapas com Kotlin e Jetpack Compose integrando Gemini AI Logic com planejador Kotlin offline, vetores 3D pick-and-place, validação determinística de segurança e trilha de auditoria SHA-256 no Firebase Firestore.',
      outcome:
        'Entregue para a etapa Kochi do Startup Buildathon India 2026 (com Google DeepMind e Google Cloud, 20–21 nov 2026) com app Android XR completo, regras Firestore e cadeia de aprovação.',
      linkLabels: ['Demo ao Vivo', 'Repositório GitHub', 'Startup Buildathon India'],
    },
    fraudlens: {
      categoryLabel: 'UX Acessível · Óculos Inteligentes',
      venue: 'Build the Invisible · Hackathon Meta Ray-Ban Display Mumbai',
      summary:
        'Experiência acessível de prevenção a golpes criada para a tela 600 × 600 do Meta Ray-Ban Display, com orientações curtas para identificar táticas de pressão e sinais de alerta.',
      contribution:
        'Codesenvolvido com Manav Rajpurohit (Team Invisible Creator); leitura em voz alta, tamanho de texto ajustável, alto contraste e movimento reduzido.',
      outcome:
        'Aplicativo web publicado e demonstração gravada usando regras locais determinísticas sem depender de verificador de IA.',
      linkLabels: ['App ao Vivo', 'Ver Demo', 'GitHub'],
    },
    'hololens-sewing': {
      title: 'Guia de Manutenção para Máquina de Costura Inteligente',
      categoryLabel: 'HoloLens 2 · RA Industrial',
      venue: 'Bolsa Meta XROS · NIFT-Delhi',
      summary:
        'Guia de realidade mista sem as mãos para manutenção de máquinas industriais de selagem de costura, projetando montagens espaciais manipuláveis diretamente com as mãos.',
      contribution:
        'Codesenvolvido com Vibhanshu Singh Sindhu sob mentoria do NIFT-Delhi em uma bolsa XR open-source de três meses apoiada pela Meta.',
      outcome:
        'Protótipo completo em HoloLens 2 entregue em três meses; reconhecido como Fellow no relatório de resultados do FICCI XROS Fellowship (página 29).',
      linkLabels: ['Repositório GitHub'],
    },
    'khaali-dabba': {
      categoryLabel: 'Snap Spectacles · Narrativa Espacial',
      venue: 'Programa de Residência DJX 2026',
      summary:
        'Experiência interativa de narrativa espacial em miniatura sobre uma vizinhança indiana: explore vielas, descubra pistas sobre três vizinhos, escolha um presente e entregue na porta.',
      contribution:
        'Design e desenvolvimento do protótipo de narrativa espacial para Snap Spectacles com TypeScript e interações ancoradas no mundo.',
      outcome:
        'Protótipo espacial jogável desenvolvido durante a Residência DJX 2026, pronto para validação em hardware.',
      linkLabels: ['Repositório GitHub'],
    },
    'quantumx-alzheimers': {
      title: 'Classificação de Alzheimer QuantumX',
      categoryLabel: 'ML Quântico · Saúde',
      venue: 'Qiskit Fall Fest 2026 × QuantumX · Finalista Top 10',
      summary:
        'Classifica doença de Alzheimer e comprometimento cognitivo leve a partir de 9 atributos clínicos comprimidos em um circuito parametrizado de 4 qubits, com painel explicável em Streamlit.',
      contribution:
        'Contribuição ao pipeline híbrido quântico-clássico em equipe, comparação de benchmarks e ferramentas de explicabilidade clínica.',
      outcome:
        'Finalista Top 10 no Quantum Hack Day Kochi. Atingiu 76,5% de acurácia vs. 77,5% de SVM clássico em 39 sujeitos OASIS-1 (reportado com transparência sem alegar vantagem quântica).',
      linkLabels: ['Repositório GitHub'],
    },
    'protect-safety-ai': {
      categoryLabel: 'Segurança de IA · Kit de Avaliação',
      summary:
        'Toolkit reproduzível em Python para auditar falsos alarmes, detecções perdidas e disparidades de iluminação ou ruído em sistemas automatizados de supervisão.',
      contribution:
        'Criação de diagnósticos de matriz de confusão, validação rigorosa de entradas, análises ambientais e recomendações estruturadas para revisão humana.',
      outcome:
        'Suíte reproduzível de CLI e relatórios JSON com testes unitários em 12 eventos sintéticos de referência.',
      linkLabels: ['Código e Uso'],
    },
    'ml-from-scratch': {
      title: 'Aprendizado de Máquina do Zero',
      categoryLabel: 'Fundamentos de ML · Algoritmos',
      summary:
        'Coleção curada de algoritmos de aprendizado de máquina implementados a partir dos fundamentos sem caixas-pretas: regressão, escalonamento, kernels, codificação e métricas.',
      contribution:
        'Implementação do zero de descida do gradiente, regressão linear por equação normal, regularização ridge e métricas de precisão/revocação/F-score.',
      outcome:
        '11 soluções documentadas e verificadas publicadas com um portfólio web interativo de progresso.',
      linkLabels: ['Portfólio Interativo', 'GitHub'],
    },
  },
  fr: {
    medcaresnap: {
      categoryLabel: 'Snap Spectacles · RA Spatiale',
      venue: 'Finaliste XRCC 2026 · Démo VR Summit 2026',
      summary:
        'Guidage RA mains libres pour les urgences cardiaques affichant la position des mains et le rythme de RCP, associé à un localisateur vocal de DAE avec distance et flèches spatiales.',
      contribution:
        'Prototypage du guidage RCP mains libres et de la recherche de DAE avec Lens Studio, Python, WebSockets, VoiceML et interfaces gestuelles.',
      outcome:
        'Finaliste officiel XRCC 2026 (parmi ~190 candidatures mondiales) et retenu dans le programme officiel des démos du VR Summit 2026.',
      linkLabels: ['Dépôt GitHub', 'Programme VR Summit'],
    },
    'roboxr-ai': {
      categoryLabel: 'XREAL · Android XR · Robotique',
      venue: 'Startup Buildathon India 2026 — Kochi',
      summary:
        'Plateforme XR d’apprentissage robotique, garde-fous déterministes ISO 10218 et reprise d’anomalies CNC en 30 secondes conçue pour XREAL et Android XR au Startup Buildathon India 2026.',
      contribution:
        'Architecture Kotlin & Jetpack Compose en 4 étapes combinant Gemini AI Logic avec un planificateur Kotlin hors ligne, ancres 3D pick-and-place, contrôles de sécurité déterministes et journal d’audit SHA-256 sur Firebase Firestore.',
      outcome:
        'Livré pour la finale de Kochi du Startup Buildathon India 2026 (avec Google DeepMind et Google Cloud, 20–21 nov. 2026) avec application Android XR complète, règles Firestore et chaîne d’audit opérateur.',
      linkLabels: ['Démo en Direct', 'Dépôt GitHub', 'Startup Buildathon India'],
    },
    fraudlens: {
      categoryLabel: 'UX Accessible · Lunettes Connectées',
      venue: 'Build the Invisible · Hackathon Meta Ray-Ban Display Mumbai',
      summary:
        'Expérience accessible de prévention des arnaques conçue pour l’affichage 600 × 600 Meta Ray-Ban Display, avec des repères concis pour détecter les tactiques de pression.',
      contribution:
        'Co-développé avec Manav Rajpurohit (Team Invisible Creator) : lecture vocale, taille de texte réglable, contraste élevé et mode mouvement réduit.',
      outcome:
        'Application web en ligne et démo enregistrée basées sur des règles locales déterministes sans dépendre d’un vérificateur IA.',
      linkLabels: ['App en Ligne', 'Voir la Démo', 'GitHub'],
    },
    'hololens-sewing': {
      title: 'Guide de Maintenance pour Machine à Coudre Intelligente',
      categoryLabel: 'HoloLens 2 · RA Industrielle',
      venue: 'Bourse Meta XROS · NIFT-Delhi',
      summary:
        'Guide de réalité mixte mains libres pour apprendre la maintenance d’une machine industrielle de soudure de coutures grâce à des assemblages 3D manipulables directement à la main.',
      contribution:
        'Co-développé avec Vibhanshu Singh Sindhu sous le mentorat de NIFT-Delhi dans le cadre de la bourse XR open-source de trois mois soutenue par Meta.',
      outcome:
        'Prototype d’équipe complet sur HoloLens 2 livré en trois mois ; distingué comme Fellow dans le rapport de résultats FICCI XROS (page 29).',
      linkLabels: ['Dépôt GitHub'],
    },
    'khaali-dabba': {
      categoryLabel: 'Snap Spectacles · Narration Spatiale',
      venue: 'Programme de Résidence DJX 2026',
      summary:
        'Narration spatiale interactive en miniature dans un quartier indien : explorez les ruelles, découvrez des indices sur trois voisins, choisissez un présent et déposez-le sur leur seuil.',
      contribution:
        'Conception et développement du prototype narratif spatial pour Snap Spectacles en TypeScript avec interactions ancrées dans l’espace.',
      outcome:
        'Prototype spatial jouable créé durant la Résidence DJX 2026, prêt pour validation matérielle sur lunettes.',
      linkLabels: ['Dépôt GitHub'],
    },
    'quantumx-alzheimers': {
      title: 'Classification d’Alzheimer QuantumX',
      categoryLabel: 'ML Quantique · Santé',
      venue: 'Qiskit Fall Fest 2026 × QuantumX · Finaliste Top 10',
      summary:
        'Classifie la maladie d’Alzheimer et les troubles cognitifs légers à partir de 9 variables cliniques compressées dans un circuit paramétré à 4 qubits, avec tableau d’explicabilité Streamlit.',
      contribution:
        'Contribution au pipeline hybride quantique-classique en équipe, aux benchmarks comparatifs et aux outils d’explicabilité clinique.',
      outcome:
        'Finaliste Top 10 au Quantum Hack Day Kochi. Précision de 76,5 % contre 77,5 % pour un SVM classique sur 39 sujets OASIS-1 (rapporté en toute transparence sans revendication d’avantage quantique).',
      linkLabels: ['Dépôt GitHub'],
    },
    'protect-safety-ai': {
      categoryLabel: 'Sûreté IA · Kit d’Évaluation',
      summary:
        'Boîte à outils Python reproductible pour auditer les fausses alertes, détections manquées et disparités d’éclairage ou de bruit dans les systèmes de surveillance automatisés.',
      contribution:
        'Développement de diagnostics de matrice de confusion, validation stricte des entrées, analyses environnementales et recommandations structurées de revue humaine.',
      outcome:
        'Suite reproductible CLI et rapports JSON couverte par des tests unitaires sur 12 événements synthétiques de référence.',
      linkLabels: ['Code & Utilisation'],
    },
    'ml-from-scratch': {
      title: 'Apprentissage Automatique de Zéro',
      categoryLabel: 'Fondamentaux ML · Algorithmes',
      summary:
        'Collection d’algorithmes fondamentaux de machine learning implémentés à partir des premiers principes sans boîtes noires : régression, mise à l’échelle, noyaux et métriques.',
      contribution:
        'Implémentation de zéro de la descente de gradient, régression linéaire par équation normale, régularisation ridge et évaluateurs précision/rappel/F-score.',
      outcome:
        '11 solutions documentées et vérifiées publiées avec un portfolio web interactif de progression.',
      linkLabels: ['Portfolio Interactif', 'GitHub'],
    },
  },
};

export function getLocalizedProject(project: ProjectItem, lang: LanguageCode): ProjectItem {
  if (lang === 'en') return project;
  if (lang === 'en-US') {
    return {
      ...project,
      title: toUsEnglish(project.title),
      categoryLabel: toUsEnglish(project.categoryLabel),
      venue: project.venue ? toUsEnglish(project.venue) : project.venue,
      summary: toUsEnglish(project.summary),
      contribution: toUsEnglish(project.contribution),
      outcome: toUsEnglish(project.outcome),
      links: project.links.map((link) => ({
        ...link,
        label: toUsEnglish(link.label),
      })),
    };
  }
  const loc = PROJECTS_TRANSLATIONS[lang]?.[project.id];
  if (!loc) return project;
  return {
    ...project,
    title: loc.title ?? project.title,
    categoryLabel: loc.categoryLabel,
    venue: loc.venue ?? project.venue,
    summary: loc.summary,
    contribution: loc.contribution,
    outcome: loc.outcome,
    links: project.links.map((link, idx) => ({
      ...link,
      label: loc.linkLabels[idx] ?? link.label,
    })),
  };
}

interface ResearchLocalization {
  title: string;
  location: string;
  summary: string;
  status: string;
  dateNote?: string;
  linkLabel: string;
}

const RESEARCH_TRANSLATIONS: Record<NonEnglishLang, Record<string, ResearchLocalization>> = {
  es: {
    'esa-xr-2026': {
      title: 'Interfaz de Cámara en Realidad Mixta para Recolección Mejorada de Datos en Misiones Análogas Espaciales',
      location: 'EAC, Colonia, Alemania',
      summary:
        'Sistema manos libres en Meta Quest para mapeo espacial, grabación sincronizada y captura activada por gestos o mirada con etiquetado automático de metadatos para investigación en hábitats análogos.',
      status: 'Publicado',
      dateNote: 'Marzo 2026',
      linkLabel: 'Conferencia ESA',
    },
    'aivr-2026': {
      title: 'Descarbonizando el Metaverso: Diseño Sostenible de Sistemas para Entornos Responsivos Multimodales XR, IA e IoT',
      location: 'Kobe, Japón',
      summary:
        'Análisis arquitectónico y marco consciente de energía para reducir la huella computacional y ambiental en ecosistemas multimodales XR, IA e IoT.',
      status: 'Aceptado (Artículo Completo)',
      dateNote: 'Presentación oral con revisiones mayores',
      linkLabel: 'AIVR 2026',
    },
    'icmlai-2026': {
      title: 'Gafas Inteligentes con Sensores Neuronales para la Colaboración Humano–IA e Inteligencia Aumentada',
      location: 'España',
      summary:
        'Investiga interfaces vestibles con sensores neuronales integradas en gafas inteligentes para apoyar el razonamiento humano-en-el-bucle y la colaboración contextual con IA.',
      status: 'Aceptado (Resumen Póster)',
      dateNote: '2026',
      linkLabel: 'Sitio de Conferencia',
    },
    'xrm-2026': {
      title: 'Ideación Aumentada: Un Marco de Realidad Mixta para Mapas Mentales Dinámicos y Generación de Contenido',
      location: 'Estonia',
      summary:
        'Resumen extendido que propone un lienzo espacial de realidad mixta que transforma sesiones de ideación no lineal en mapas mentales dinámicos y contenido generado.',
      status: 'Aceptado (Resumen Extendido)',
      dateNote: '2026',
      linkLabel: 'XRM 2026',
    },
    'vr-summit-2026': {
      title: 'MedCareSnap — Demostración en Vivo de Respuesta Cardíaca en AR Espacial',
      location: 'Rotunde Bochum · Ruhr-Universität Bochum, Alemania',
      summary:
        'Incluido en el programa oficial de VR Demos & Posters (KlaesLab, Ruhr-Universität Bochum) como Ashish Kumar, Investigador Independiente, mostrando guía RCP manos libres y navegación espacial DEA.',
      status: 'Demo Aceptada',
      dateNote: '12–13 de octubre de 2026',
      linkLabel: 'Programa de Demos',
    },
  },
  de: {
    'esa-xr-2026': {
      title: 'Mixed-Reality-Kameraschnittstelle für verbesserte Datenerfassung in Raumfahrt-Analogmissionen',
      location: 'EAC, Köln, Deutschland',
      summary:
        'Freihändiges Meta-Quest-System für räumliches Mapping, synchronisierte Aufzeichnung und Gesten-/Blick-Erfassung mit automatischem Metadaten-Tagging für Analoghabitat-Forschung.',
      status: 'Veröffentlicht',
      dateNote: 'März 2026',
      linkLabel: 'ESA-Konferenz',
    },
    'aivr-2026': {
      title: 'Dekarbonisierung des Metaversums: Nachhaltiges Systemdesign für multimodale XR-, KI- und IoT-Umgebungen',
      location: 'Kobe, Japan',
      summary:
        'Architekturanalyse und energiebewusstes Framework zur Reduzierung des Rechen- und Umwelt-Fußabdrucks in reaktiven multimodalen XR-, KI- und IoT-Ökosystemen.',
      status: 'Angenommen (Full Paper)',
      dateNote: 'Vortrag mit größeren Überarbeitungen',
      linkLabel: 'AIVR 2026',
    },
    'icmlai-2026': {
      title: 'Neuronal-sensierende Smart Glasses für Mensch-KI-Zusammenarbeit und Erweiterte Intelligenz',
      location: 'Spanien',
      summary:
        'Untersucht tragbare neuronale Sensorik kombiniert mit Smart Glasses für unaufdringliches Human-in-the-Loop-Reasoning und kontextuelle KI-Zusammenarbeit.',
      status: 'Angenommen (Poster-Abstract)',
      dateNote: '2026',
      linkLabel: 'Konferenzseite',
    },
    'xrm-2026': {
      title: 'Erweiterte Ideenfindung: Ein Mixed-Reality-Framework für dynamisches Mindmapping und Inhaltsgenerierung',
      location: 'Estland',
      summary:
        'Extended Abstract für eine räumliche Mixed-Reality-Leinwand, die nichtlineares Brainstorming in dynamische Mindmaps und generierte Medien überführt.',
      status: 'Angenommen (Extended Abstract)',
      dateNote: '2026',
      linkLabel: 'XRM 2026',
    },
    'vr-summit-2026': {
      title: 'MedCareSnap — Live-AR-Demonstration für kardiale Notfallhilfe',
      location: 'Rotunde Bochum · Ruhr-Universität Bochum, Deutschland',
      summary:
        'Gelistet im offiziellen VR Demos & Poster Programm (KlaesLab, Ruhr-Universität Bochum) als Ashish Kumar, Unabhängiger Forscher, mit freihändiger HLW-Taktung und räumlicher AED-Navigation.',
      status: 'Angenommene Demo',
      dateNote: '12.–13. Oktober 2026',
      linkLabel: 'Demo-Programm',
    },
  },
  ja: {
    'esa-xr-2026': {
      title: '宇宙アナログミッションのデータ収集を高度化する複合現実カメラインターフェース',
      location: 'ドイツ・ケルン (EAC)',
      summary:
        'アナログ居住施設での研究向けに、空間マッピング、同期記録、ジェスチャー・視線トリガー撮影と自動メタデータ付与を実現するハンズフリーMeta Questシステム。',
      status: '公開済み',
      dateNote: '2026年3月',
      linkLabel: 'ESA 学会ページ',
    },
    'aivr-2026': {
      title: 'メタバースの脱炭素化：マルチモーダルXR・AI・IoT応答環境のための持続可能システム設計',
      location: '日本・神戸',
      summary:
        '応答型マルチモーダルXR・AI・IoTエコシステムにおける計算負荷と環境フットプリントを低減するエネルギー配慮型アーキテクチャの分析とフレームワーク。',
      status: '採択（フルペーパー）',
      dateNote: '口頭発表（主要改訂付き）',
      linkLabel: 'AIVR 2026',
    },
    'icmlai-2026': {
      title: '人間とAIの協働および拡張知能のための神経センシング・スマートグラス',
      location: 'スペイン',
      summary:
        'ウェアラブル神経センシングとスマートグラスを統合し、自然な人間参加型推論と文脈適応的なAI協働を支えるインターフェースを探求。',
      status: '採択（ポスター要旨）',
      dateNote: '2026年',
      linkLabel: '学会サイト',
    },
    'xrm-2026': {
      title: '発想拡張：動的マインドマッピングとコンテンツ生成のための複合現実フレームワーク',
      location: 'エストニア',
      summary:
        '非線形なブレインストーミングを構造化された動的マインドマップおよび生成メディアへと変換する空間MRキャンバスを提案した拡張要旨。',
      status: '採択（拡張要旨）',
      dateNote: '2026年',
      linkLabel: 'XRM 2026',
    },
    'vr-summit-2026': {
      title: 'MedCareSnap — 空間ARによる心停止応急処置ライブデモンストレーション',
      location: 'ドイツ・ボーフム（ルール大学ボーフム）',
      summary:
        'ルール大学ボーフム KlaesLab主催の公式VRデモ＆ポスタープログラムに独立研究者として採択。ハンズフリーCPRペーシングとAED空間誘導を実演。',
      status: 'デモ採択',
      dateNote: '2026年10月12〜13日',
      linkLabel: 'デモプログラム',
    },
  },
  pt: {
    'esa-xr-2026': {
      title: 'Interface de Câmera em Realidade Mista para Coleta Aprimorada de Dados em Missões Análogas Espaciais',
      location: 'EAC, Colônia, Alemanha',
      summary:
        'Sistema sem as mãos no Meta Quest para mapeamento espacial, gravação sincronizada e captura por gestos ou olhar com metadados automáticos para pesquisa em habitats análogos.',
      status: 'Publicado',
      dateNote: 'Março de 2026',
      linkLabel: 'Conferência ESA',
    },
    'aivr-2026': {
      title: 'Descarbonizando o Metaverso: Design Sustentável de Sistemas para Ambientes Responsivos Multimodais de XR, IA e IoT',
      location: 'Kobe, Japão',
      summary:
        'Análise arquitetural e framework consciente de energia para reduzir a pegada computacional e ambiental em ecossistemas multimodais de XR, IA e IoT.',
      status: 'Aceito (Artigo Completo)',
      dateNote: 'Apresentação oral com revisões maiores',
      linkLabel: 'AIVR 2026',
    },
    'icmlai-2026': {
      title: 'Óculos Inteligentes com Sensoriamento Neural para Colaboração Humano–IA e Inteligência Aumentada',
      location: 'Espanha',
      summary:
        'Investiga interfaces vestíveis de sensoriamento neural integradas a óculos inteligentes para apoiar o raciocínio humano-no-ciclo e a colaboração contextual com IA.',
      status: 'Aceito (Resumo Pôster)',
      dateNote: '2026',
      linkLabel: 'Site da Conferência',
    },
    'xrm-2026': {
      title: 'Ampliando a Ideação: Um Framework de Realidade Mista para Mapas Mentais Dinâmicos e Geração de Conteúdo',
      location: 'Estônia',
      summary:
        'Resumo expandido propondo uma tela espacial de realidade mista que transforma brainstorming não linear em mapas mentais dinâmicos e mídia gerada.',
      status: 'Aceito (Resumo Expandido)',
      dateNote: '2026',
      linkLabel: 'XRM 2026',
    },
    'vr-summit-2026': {
      title: 'MedCareSnap — Demonstração ao Vivo de Resposta Cardíaca em RA Espacial',
      location: 'Rotunde Bochum · Ruhr-Universität Bochum, Alemanha',
      summary:
        'Listado no programa oficial de VR Demos & Posters (KlaesLab, Ruhr-Universität Bochum) como Ashish Kumar, Pesquisador Independente, demonstrando ritmo de RCP sem as mãos e navegação espacial para DEA.',
      status: 'Demo Aceita',
      dateNote: '12–13 de outubro de 2026',
      linkLabel: 'Programa de Demos',
    },
  },
  fr: {
    'esa-xr-2026': {
      title: 'Interface Caméra en Réalité Mixte pour une Collecte de Données Améliorée en Missions Spatiales Analogues',
      location: 'EAC, Cologne, Allemagne',
      summary:
        'Système mains libres sur Meta Quest combinant cartographie spatiale, enregistrement synchronisé et capture par gestes ou regard avec balisage automatique de métadonnées pour habitats analogues.',
      status: 'Publié',
      dateNote: 'Mars 2026',
      linkLabel: 'Conférence ESA',
    },
    'aivr-2026': {
      title: 'Décarboner le Métavers : Conception Durable de Systèmes pour Environnements Réactifs Multimodaux XR, IA et IoT',
      location: 'Kobe, Japon',
      summary:
        'Analyse architecturale et cadre éco-énergétique pour réduire l’empreinte calculatoire et environnementale des écosystèmes multimodaux XR, IA et IoT.',
      status: 'Accepté (Article Complet)',
      dateNote: 'Présentation orale avec révisions majeures',
      linkLabel: 'AIVR 2026',
    },
    'icmlai-2026': {
      title: 'Lunettes Connectées à Capteurs Neuronaux pour la Collaboration Humain–IA et l’Intelligence Augmentée',
      location: 'Espagne',
      summary:
        'Étudie des interfaces portables à capteurs neuronaux couplées à des lunettes connectées pour soutenir le raisonnement humain-dans-la-boucle et la collaboration contextuelle avec l’IA.',
      status: 'Accepté (Résumé Poster)',
      dateNote: '2026',
      linkLabel: 'Site de la Conférence',
    },
    'xrm-2026': {
      title: 'Augmenter l’Idéation : Un Cadre de Réalité Mixte pour la Cartographie Mentale Dynamique et la Génération de Contenu',
      location: 'Estonie',
      summary:
        'Résumé étendu proposant un espace de réalité mixte qui transforme le brainstorming non linéaire en cartes mentales dynamiques et médias générés.',
      status: 'Accepté (Résumé Étendu)',
      dateNote: '2026',
      linkLabel: 'XRM 2026',
    },
    'vr-summit-2026': {
      title: 'MedCareSnap — Démonstration en Direct de Réponse Cardiaque en RA Spatiale',
      location: 'Rotunde Bochum · Ruhr-Universität Bochum, Allemagne',
      summary:
        'Inscrit au programme officiel VR Demos & Posters (KlaesLab, Ruhr-Universität Bochum) en tant que Chercheur Indépendant, démontrant le rythme RCP mains libres et la navigation spatiale vers un DAE.',
      status: 'Démo Acceptée',
      dateNote: '12–13 octobre 2026',
      linkLabel: 'Programme des Démos',
    },
  },
};

export function getLocalizedResearch(item: ResearchItem, lang: LanguageCode): ResearchItem {
  if (lang === 'en') return item;
  if (lang === 'en-US') {
    return {
      ...item,
      title: toUsEnglish(item.title),
      summary: toUsEnglish(item.summary),
      status: toUsEnglish(item.status),
      linkLabel: toUsEnglish(item.linkLabel),
    };
  }
  const loc = RESEARCH_TRANSLATIONS[lang]?.[item.id];
  if (!loc) return item;
  return {
    ...item,
    title: loc.title,
    location: loc.location,
    summary: loc.summary,
    status: loc.status,
    dateNote: loc.dateNote ?? item.dateNote,
    linkLabel: loc.linkLabel,
  };
}

interface ExperienceLocalization {
  period: string;
  role: string;
  location: string;
  summary: string;
}

const EXPERIENCES_TRANSLATIONS: Record<NonEnglishLang, Record<string, ExperienceLocalization>> = {
  es: {
    'exp-independent-researcher': {
      period: 'Jul 2024 – Presente',
      role: 'Investigador Independiente en XR e IA',
      location: 'India · Europa · Japón',
      summary:
        'Autor de 4 trabajos internacionales 2026 (ESA XR Alemania, AIVR Kobe, ICMLAI España, XRM Estonia) y demo aceptada en VR Summit Bochum; finalista global XRCC con MedCareSnap y participante en programas financiados por DAAD, NAWA y AI4I.',
    },
    'exp-akiya': {
      period: 'Oct – Dic 2025',
      role: 'Pasante de Desarrollo de Software',
      location: 'Japón · Remoto',
      summary:
        'Contribuí a la recolección automatizada de datos, integración entre múltiples fuentes y flujos de fiabilidad de bases de datos para una plataforma japonesa de propiedades vacantes.',
    },
    'exp-tranquilmind': {
      period: 'Feb – Jun 2025',
      role: 'Ingeniero de Software',
      location: 'Remoto · Bengaluru, India',
      summary:
        'Diseñé entornos VR restaurativos para experiencias de bienestar impulsadas por IA y optimicé la estabilidad de fotogramas e interacciones espaciales en Meta Quest con Unreal Engine y C++.',
    },
    'exp-xros': {
      period: 'Abr – Nov 2023',
      role: 'Desarrollador de Software XR',
      location: 'India',
      summary:
        'Construí un prototipo industrial de guía de mantenimiento AR manos libres bajo mentoría del NIFT como parte de la iniciativa XR open-source apoyada por Meta; reconocido en el informe de FICCI XROS.',
    },
  },
  de: {
    'exp-independent-researcher': {
      period: 'Jul 2024 – Heute',
      role: 'Unabhängiger XR- & KI-Forscher',
      location: 'Indien · Europa · Japan',
      summary:
        'Autor von 4 internationalen 2026-Publikationen (ESA XR Deutschland, AIVR Kobe, ICMLAI Spanien, XRM Estland) sowie angenommener Live-Demo beim VR Summit Bochum; XRCC-Global-Finalist mit MedCareSnap und Teilnehmer geförderter Programme (DAAD, NAWA, AI4I).',
    },
    'exp-akiya': {
      period: 'Okt – Dez 2025',
      role: 'Praktikant Softwareentwicklung',
      location: 'Japan · Remote',
      summary:
        'Mitarbeit an automatisierter Datenerfassung, Multi-Quellen-Integration und Datenbank-Zuverlässigkeitsworkflows für eine japanische Plattform für leerstehende Immobilien.',
    },
    'exp-tranquilmind': {
      period: 'Feb – Jun 2025',
      role: 'Softwareentwickler',
      location: 'Remote · Bengaluru, Indien',
      summary:
        'Gestaltete beruhigende VR-Umgebungen für KI-gestützte Wellness-Erlebnisse und optimierte Meta-Quest-Frametimes sowie räumliche Interaktionen in Unreal Engine und C++.',
    },
    'exp-xros': {
      period: 'Apr – Nov 2023',
      role: 'XR-Softwareentwickler',
      location: 'Indien',
      summary:
        'Entwickelte unter NIFT-Mentoring einen freihändigen industriellen AR-Wartungsprototyp im Rahmen der Meta-geförderten Open-Source-XR-Initiative; im FICCI-XROS-Abschlussbericht gewürdigt.',
    },
  },
  ja: {
    'exp-independent-researcher': {
      period: '2024年7月 – 現在',
      role: '独立XR・AI研究者',
      location: 'インド · 欧州 · 日本',
      summary:
        '2026年国際会議論文4本（ESA XR ドイツ・AIVR 神戸・ICMLAI スペイン・XRM エストニア）およびVR Summit Bochum公式ライブデモ採択。XRCCファイナリスト作品MedCareSnapを開発し、DAAD・NAWA・AI4Iの助成プログラムを修了。',
    },
    'exp-akiya': {
      period: '2025年10月 – 12月',
      role: 'ソフトウェア開発インターン',
      location: '日本 · リモート',
      summary:
        '日本向け空き家情報プラットフォームにおいて、自動データ収集、複数データソース統合、データベース信頼性向上ワークフローに貢献。',
    },
    'exp-tranquilmind': {
      period: '2025年2月 – 6月',
      role: 'ソフトウェアエンジニア',
      location: 'リモート · インド・ベンガルール',
      summary:
        'AIウェルネス体験向けの癒やしVR空間を設計し、Unreal EngineとC++でMeta Questのフレームペーシングと空間インタラクションを最適化。',
    },
    'exp-xros': {
      period: '2023年4月 – 11月',
      role: 'XRソフトウェア開発者',
      location: 'インド',
      summary:
        'Meta支援のオープンソースXRフェローシップにてNIFTの指導のもと産業用ハンズフリーAR保守ガイドを開発。FICCI XROS成果報告書に掲載。',
    },
  },
  pt: {
    'exp-independent-researcher': {
      period: 'Jul 2024 – Atual',
      role: 'Pesquisador Independente em XR e IA',
      location: 'Índia · Europa · Japão',
      summary:
        'Autor de 4 publicações internacionais de 2026 (ESA XR Alemanha, AIVR Kobe, ICMLAI Espanha, XRM Estônia) e demonstração aceita no VR Summit Bochum; finalista global XRCC com MedCareSnap e bolsista em programas DAAD, NAWA e AI4I.',
    },
    'exp-akiya': {
      period: 'Out – Dez 2025',
      role: 'Estagiário de Desenvolvimento de Software',
      location: 'Japão · Remoto',
      summary:
        'Contribuí na coleta automatizada de dados, integração entre múltiplas fontes e fluxos de confiabilidade de banco de dados para uma plataforma japonesa de imóveis vagos.',
    },
    'exp-tranquilmind': {
      period: 'Fev – Jun 2025',
      role: 'Engenheiro de Software',
      location: 'Remoto · Bengaluru, Índia',
      summary:
        'Projetei ambientes de RV restaurativos para experiências de bem-estar com IA e otimizei a taxa de quadros e interações espaciais no Meta Quest com Unreal Engine e C++.',
    },
    'exp-xros': {
      period: 'Abr – Nov 2023',
      role: 'Desenvolvedor de Software XR',
      location: 'Índia',
      summary:
        'Construí um protótipo industrial de guia de manutenção em RA sem as mãos sob mentoria do NIFT na iniciativa XR open-source apoiada pela Meta; reconhecido no relatório FICCI XROS.',
    },
  },
  fr: {
    'exp-independent-researcher': {
      period: 'Juil 2024 – Présent',
      role: 'Chercheur Indépendant XR & IA',
      location: 'Inde · Europe · Japon',
      summary:
        'Auteur de 4 travaux internationaux 2026 (ESA XR Allemagne, AIVR Kobe, ICMLAI Espagne, XRM Estonie) et d’une démo en direct acceptée au VR Summit Bochum ; finaliste mondial XRCC avec MedCareSnap et lauréat de programmes financés (DAAD, NAWA, AI4I).',
    },
    'exp-akiya': {
      period: 'Oct – Déc 2025',
      role: 'Stagiaire Développement Logiciel',
      location: 'Japon · À distance',
      summary:
        'Contribution à la collecte automatisée de données, à l’intégration multi-sources et à la fiabilité des bases de données pour une plateforme japonaise de biens vacants.',
    },
    'exp-tranquilmind': {
      period: 'Fév – Juin 2025',
      role: 'Ingénieur Logiciel',
      location: 'À distance · Bengaluru, Inde',
      summary:
        'Conception d’environnements VR apaisants pour des expériences de bien-être guidées par IA et optimisation du frame pacing et des interactions Meta Quest sous Unreal Engine et C++.',
    },
    'exp-xros': {
      period: 'Avr – Nov 2023',
      role: 'Développeur Logiciel XR',
      location: 'Inde',
      summary:
        'Création d’un prototype industriel de guide de maintenance RA mains libres sous le mentorat de NIFT dans le cadre de la bourse XR open-source soutenue par Meta ; cité dans le rapport FICCI XROS.',
    },
  },
};

export function getLocalizedExperience(exp: ExperienceItem, lang: LanguageCode): ExperienceItem {
  if (lang === 'en') return exp;
  if (lang === 'en-US') {
    return {
      ...exp,
      role: toUsEnglish(exp.role),
      summary: toUsEnglish(exp.summary),
    };
  }
  const loc = EXPERIENCES_TRANSLATIONS[lang]?.[exp.id];
  if (!loc) return exp;
  return { ...exp, ...loc };
}

interface RecognitionLocalization {
  groupLabel: string;
  metaLeft: string;
  title: string;
  description?: string;
  outcome: string;
  tags?: string[];
}

const GROUP_LABELS: Record<NonEnglishLang, Record<RecognitionItem['group'], string>> = {
  es: {
    fellowships: 'Becas y Estipendios',
    schools: 'Escuelas Globales',
    competitions: 'Competencias y Mentoría',
    education: 'Educación y Formación',
  },
  de: {
    fellowships: 'Stipendien & Fellowships',
    schools: 'Internationale Schulen',
    competitions: 'Wettbewerbe & Mentoring',
    education: 'Bildung & Ausbildung',
  },
  ja: {
    fellowships: '奨学金・フェローシップ',
    schools: '国際サマー／ウィンタースクール',
    competitions: '大会・メンタリング・受賞',
    education: '学歴・トレーニング',
  },
  pt: {
    fellowships: 'Becas e Fellowships',
    schools: 'Escolas Globais',
    competitions: 'Competições e Mentoria',
    education: 'Educação e Formação',
  },
  fr: {
    fellowships: 'Bourses & Fellowships',
    schools: 'Écoles Internationales',
    competitions: 'Concours & Mentorat',
    education: 'Formation & Diplômes',
  },
};

const RECOGNITIONS_TRANSLATIONS: Record<
  NonEnglishLang,
  Record<string, Omit<RecognitionLocalization, 'groupLabel'>>
> = {
  es: {
    'rec-xros': {
      metaLeft: 'Meta XROS · India',
      title: 'Top 100 Desarrollador Meta',
      description: 'Seleccionado entre los 100 mejores becarios a nivel nacional en el programa XR open-source apoyado por Meta.',
      outcome: '100 de 2,800+ postulantes',
    },
    'rec-xrbootcamp': {
      metaLeft: 'Unity y Meta · EE. UU.',
      title: 'Beca XR Bootcamp',
      description: 'Beca completa de $8,000 para formación intensiva en ingeniería XR; graduado con Altos Honores.',
      outcome: '$8,000 · Altos Honores',
    },
    'rec-mxr': {
      metaLeft: 'MXR 2026 · EE. UU.',
      title: 'Beca Meaningful XR',
      description: 'Exención de matrícula de conferencia más apoyo planificado de viaje y alojamiento (al menos $300) para asistencia presencial.',
      outcome: 'Beca Otorgada',
    },
    'rec-imt': {
      metaLeft: 'IMT Lucca · Italia',
      title: 'Escuela de Verano de Diseño de Juegos — IMT Lucca',
      description:
        'Financiada por DAAD (Deutscher Akademischer Austauschdienst — Servicio Alemán de Intercambio Académico). Talleres prácticos de diseño de juegos, teoría de juegos, game jams y economía circular.',
      outcome: 'Financiado por DAAD (Servicio Alemán de Intercambio)',
      tags: ['Financiado DAAD', 'Diseño de Juegos', 'Teoría de Juegos', 'Economía Circular'],
    },
    'rec-isaga': {
      metaLeft: 'ISAGA · Polonia',
      title: 'Escuela de Verano ISAGA 2026',
      description: 'Cuota de participación exonerada mediante subvención de la Agencia Nacional Polaca de Intercambio Académico (NAWA).',
      outcome: 'Subvención NAWA · Sin Costo',
    },
    'rec-nyu': {
      metaLeft: 'NYU Abu Dhabi · EAU',
      title: 'Escuela de Invierno en Humanidades Digitales 2024 — Cultura Computacional',
      description: 'Estudio de análisis exploratorio de datos, PLN, visión por computadora, redes neuronales convolucionales y análisis computacional de imágenes.',
      outcome: 'Financiación Completa · NYU Abu Dhabi',
    },
    'rec-ai4i': {
      metaLeft: 'AI4I · Turín, Italia',
      title: 'Escuela de Invierno CSP–IAS 2026 — Criptografía y Aprendizaje Automático',
      description: 'Seleccionado y completado a distancia el programa intensivo organizado por AI4I (Instituto Italiano de IA para la Industria) en Turín (2–5 feb 2026).',
      outcome: 'Seleccionado · Completado',
      tags: ['Criptografía', 'Aprendizaje Automático', 'Seguridad IA'],
    },
    'rec-gamefreak': {
      metaLeft: 'Japón',
      title: 'Desafío de Programación GAME FREAK',
      description: 'Puntuación perfecta en problemas algorítmicos dentro del desafío oficial de GAME FREAK.',
      outcome: '1.º de 33 · 100/100',
    },
    'rec-tracks': {
      metaLeft: 'Tracks Jobs · Japón',
      title: 'Desafío Nacional de Programación',
      description: 'Primer puesto con evaluación perfecta de 100/100 en Tracks Jobs Japón.',
      outcome: '1.er Lugar · 100/100',
    },
    'rec-mit': {
      metaLeft: 'Cambridge, MA · EE. UU.',
      title: 'Reality Hack en el MIT 2026',
      description: 'Seleccionado como mentor técnico voluntario presencial para equipos XR en el MIT (22–26 ene 2026).',
      outcome: 'Mentor Seleccionado',
    },
    'rec-buildathon': {
      metaLeft: 'Kochi, India · 2026',
      title: 'Startup Buildathon India 2026 — Kochi',
      description: 'Preseleccionado para la ronda de Kochi con Google DeepMind y Google Cloud (20–21 nov 2026); desarrollé RoboXR AI para XREAL y Android XR con seguridad ISO 10218.',
      outcome: 'Finalista · RoboXR AI',
    },
    'rec-xrcc': {
      metaLeft: 'XRCC · Alemania',
      title: 'Hackathon XRCC 2026',
      description: 'El equipo avanzó a la final oficial entre aproximadamente 190 propuestas de todo el mundo.',
      outcome: 'Finalista Global',
    },
    'rec-qiskit': {
      metaLeft: 'Kochi, India · 2026',
      title: 'Qiskit Fall Fest 2026 × QuantumX Hack Day',
      description: 'Finalista Top 10 el 1 de noviembre de 2026 con un modelo híbrido cuántico-clásico de clasificación médica.',
      outcome: 'Finalista Top 10',
    },
    'rec-djx': {
      metaLeft: 'DJX · India',
      title: 'DJX Hackathon 2.0 — 1.er Premio y Mentor',
      description: 'Ganó el 1.er Premio (₹50,000) mientras ejercía como mentor, guiando a equipos estudiantiles e independientes en prototipado XR y diseño de interacción.',
      outcome: '1.er Premio · ₹50,000 · Mentor',
      tags: ['1.er Premio', 'Premio ₹50,000', 'Mentoría XR'],
    },
    'rec-interiit': {
      metaLeft: 'IIT Jodhpur · 2023',
      title: 'Inter IIT Tech Meet 12.0 — Desarrollo de Videojuegos',
      description: 'Seleccionado para el contingente de IIT Jodhpur en Desarrollo de Videojuegos del Inter IIT Tech Meet 12.0.',
      outcome: 'Selección Contingente',
    },
    'rec-codechef': {
      metaLeft: 'CodeChef · India',
      title: 'Solucionador de Problemas — Insignia Diamante',
      description: 'Práctica constante en programación competitiva en estructuras de datos, grafos y programación dinámica.',
      outcome: '2,821 Resueltos',
    },
    'rec-science-expo': {
      metaLeft: 'GITAM · India · 2019',
      title: 'Expo Ciencia 2019 — Proyecto de Células Madre',
      description: 'Líder de equipo de I+D, presentado durante el 33.º Día Nacional de la Ciencia.',
      outcome: '1.er Premio',
    },
    'rec-cogjet': {
      metaLeft: 'IIT Kanpur · 2022',
      title: 'COGJET — Examen Conjunto de Ciencia Cognitiva',
      description: 'Examen nacional de ingreso en ciencia cognitiva realizado por IIT Kanpur.',
      outcome: 'Puntaje: 19/40',
    },
    'edu-iitj': {
      metaLeft: 'MSc · 2022–2024',
      title: 'Maestría en Humanidades Digitales — IIT Jodhpur',
      description: 'Plataforma de Investigación Interdisciplinaria (IDRP), IIT Jodhpur. Cursos: DSA, Programación, Android, HCI, Creación AR/VR, Machine Learning, R, Bases de Datos e Ingeniería de Software.',
      outcome: 'Graduado · India',
    },
    'edu-gitam': {
      metaLeft: 'BSc · 2018–2021',
      title: 'Licenciatura en Bioinformática — Universidad GITAM',
      description: 'Facultad de Ciencias, Visakhapatnam. Cursos: DBMS, Analítica de Datos, Unix, Programación, Biología Computacional y Diseño de Fármacos.',
      outcome: 'Graduado · India',
    },
    'edu-fastfutures': {
      metaLeft: '2022 · Avado, Reino Unido',
      title: 'Graduado del Programa FastFutures',
      description: 'Programa de 12 semanas en habilidades digitales empresariales: Emprendimiento, Datos y Tecnología, Marketing, Finanzas y Trabajo en Equipo.',
      outcome: 'Certificado de Graduación',
    },
    'edu-cbse': {
      metaLeft: 'Grado XII · CBSE',
      title: 'Educación Secundaria Superior — Rama Ciencias',
      description: 'Base en Física, Química y Biotecnología.',
      outcome: 'Completado · India',
    },
  },
  de: {
    'rec-xros': {
      metaLeft: 'Meta XROS · Indien',
      title: 'Top 100 Meta-Entwickler',
      description: 'Unter den Top-100-Stipendiaten landesweit für das Meta-geförderte Open-Source-XR-Programm ausgewählt.',
      outcome: '100 von 2.800+ Bewerbern',
    },
    'rec-xrbootcamp': {
      metaLeft: 'Unity & Meta · USA',
      title: 'XR Bootcamp Stipendium',
      description: 'Vollstipendium im Wert von $8.000 für intensives XR-Engineering-Training; Abschluss mit Auszeichnung (High Honors).',
      outcome: '$8.000 · High Honors',
    },
    'rec-mxr': {
      metaLeft: 'MXR 2026 · USA',
      title: 'Meaningful XR Stipendium',
      description: 'Erlass der Konferenzgebühr sowie geplante Reise- und Unterkunftsunterstützung (mindestens $300) für die Präsenzteilnahme.',
      outcome: 'Stipendium verliehen',
    },
    'rec-imt': {
      metaLeft: 'IMT Lucca · Italien',
      title: 'Game Design Summer School — IMT Lucca',
      description:
        'Gefördert durch den DAAD (Deutscher Akademischer Austauschdienst). Projektbasierte Workshops zu Game Design, Spieltheorie, Game Jams und Kreislaufwirtschaft.',
      outcome: 'Gefördert durch den DAAD',
      tags: ['DAAD-gefördert', 'Game Design', 'Spieltheorie', 'Kreislaufwirtschaft'],
    },
    'rec-isaga': {
      metaLeft: 'ISAGA · Polen',
      title: 'ISAGA Summer School 2026',
      description: 'Teilnahmegebühr erlassen durch ein Stipendium der Polnischen Nationalen Agentur für Akademischen Austausch (NAWA).',
      outcome: 'NAWA-Förderung · Gebührenfrei',
    },
    'rec-nyu': {
      metaLeft: 'NYU Abu Dhabi · VAE',
      title: 'Digital Humanities Winter School 2024 — Computing Culture',
      description: 'Schwerpunkte: Explorative Datenanalyse, NLP, Computer Vision, Convolutional Neural Networks und rechnergestützte Bildanalyse.',
      outcome: 'Vollfinanziert · NYU Abu Dhabi',
    },
    'rec-ai4i': {
      metaLeft: 'AI4I · Turin, Italien',
      title: 'CSP–IAS Winter School 2026 — Kryptographie & Maschinelles Lernen',
      description: 'Ausgewählt für die Intensiv-Winterschule des AI4I (Italienisches Institut für KI in der Industrie) in Turin (2.–5. Feb 2026) und remote abgeschlossen.',
      outcome: 'Ausgewählt · Abgeschlossen',
      tags: ['Kryptographie', 'Maschinelles Lernen', 'KI-Sicherheit'],
    },
    'rec-gamefreak': {
      metaLeft: 'Japan',
      title: 'GAME FREAK Programmierwettbewerb',
      description: 'Volle Punktzahl bei algorithmischen Programmieraufgaben in der GAME FREAK Challenge.',
      outcome: '1. von 33 · 100/100',
    },
    'rec-tracks': {
      metaLeft: 'Tracks Jobs · Japan',
      title: 'Nationaler Programmierwettbewerb',
      description: 'Erstplatzierung mit perfekter Bewertung (100/100) auf Tracks Jobs Japan.',
      outcome: 'Platz 1 · 100/100',
    },
    'rec-mit': {
      metaLeft: 'Cambridge, MA · USA',
      title: 'Reality Hack am MIT 2026',
      description: 'Ausgewählt als ehrenamtlicher technischer Mentor vor Ort für XR-Entwickler am MIT (22.–26. Jan 2026).',
      outcome: 'Ausgewählter Mentor',
    },
    'rec-buildathon': {
      metaLeft: 'Kochi, Indien · 2026',
      title: 'Startup Buildathon India 2026 — Kochi',
      description: 'In die engere Auswahl für die Kochi-Runde mit Google DeepMind und Google Cloud aufgenommen (20.–21. Nov 2026); entwickelte RoboXR AI für XREAL & Android XR mit ISO-10218-Sicherheit.',
      outcome: 'Finalist · RoboXR AI',
    },
    'rec-xrcc': {
      metaLeft: 'XRCC · Deutschland',
      title: 'XRCC Hackathon 2026',
      description: 'Team erreichte das offizielle Finale aus rund 190 weltweiten Einreichungen.',
      outcome: 'Globaler Finalist',
    },
    'rec-qiskit': {
      metaLeft: 'Kochi, Indien · 2026',
      title: 'Qiskit Fall Fest 2026 × QuantumX Hack Day',
      description: 'Top-10-Finalist am 1. November 2026 mit einem hybriden Quanten-Klassik-Modell für medizinische Klassifikation.',
      outcome: 'Top-10-Finalist',
    },
    'rec-djx': {
      metaLeft: 'DJX · Indien',
      title: 'DJX Hackathon 2.0 — 1. Preis & Mentor',
      description: 'Gewann den 1. Preis (₹50.000) während der Tätigkeit als Mentor für studentische und Indie-XR-Teams in Spatial Prototyping und Interaktionsdesign.',
      outcome: '1. Preis · ₹50.000 · Mentor',
      tags: ['1. Preis', '₹50.000 Preis', 'XR-Mentoring'],
    },
    'rec-interiit': {
      metaLeft: 'IIT Jodhpur · 2023',
      title: 'Inter IIT Tech Meet 12.0 — Spieleentwicklung',
      description: 'Ausgewählt für das Kontingent des IIT Jodhpur im Bereich Game Development beim Inter IIT Tech Meet 12.0.',
      outcome: 'Kontingent-Auswahl',
    },
    'rec-codechef': {
      metaLeft: 'CodeChef · Indien',
      title: 'Problemlöser — Diamond-Abzeichen',
      description: 'Kontinuierliches Wettkampfprogrammieren in Datenstrukturen, Graphenalgorithmen und dynamischer Programmierung.',
      outcome: '2.821 gelöst',
    },
    'rec-science-expo': {
      metaLeft: 'GITAM · Indien · 2019',
      title: 'Science Expo 2019 — Stammzellenprojekt',
      description: 'Teamleiter F&E, präsentiert im Rahmen des 33. Nationalen Wissenschaftstages.',
      outcome: '1. Preis',
    },
    'rec-cogjet': {
      metaLeft: 'IIT Kanpur · 2022',
      title: 'COGJET — Kognitionswissenschafts-Aufnahmetest',
      description: 'Nationale Aufnahmeprüfung für Kognitionswissenschaft, durchgeführt vom IIT Kanpur.',
      outcome: 'Ergebnis: 19/40',
    },
    'edu-iitj': {
      metaLeft: 'MSc · 2022–2024',
      title: 'MSc Digital Humanities — IIT Jodhpur',
      description: 'Interdisziplinäre Forschungsplattform (IDRP), IIT Jodhpur. Module: DSA, Programmierung, Android, HCI, AR/VR-Erstellung, Machine Learning, R, Datenbanken, Software Engineering.',
      outcome: 'Abschluss · Indien',
    },
    'edu-gitam': {
      metaLeft: 'BSc · 2018–2021',
      title: 'BSc Bioinformatik — GITAM Universität',
      description: 'School of Sciences, Visakhapatnam. Module: DBMS, Datenanalyse, Unix, Programmierung, Computational Biology, Wirkstoffdesign.',
      outcome: 'Abschluss · Indien',
    },
    'edu-fastfutures': {
      metaLeft: '2022 · Avado, UK',
      title: 'Absolvent des FastFutures-Programms',
      description: '12-wöchiges Digital-Business-Programm in Unternehmertum, Daten & Technologie, Marketing, Finanzen und Teamarbeit.',
      outcome: 'Abschlusszertifikat',
    },
    'edu-cbse': {
      metaLeft: 'Klasse XII · CBSE',
      title: 'Oberstufe — Naturwissenschaftlicher Zweig',
      description: 'Grundlagen in Physik, Chemie und Biotechnologie.',
      outcome: 'Abgeschlossen · Indien',
    },
  },
  ja: {
    'rec-xros': {
      metaLeft: 'Meta XROS · インド',
      title: 'Top 100 Meta デベロッパー',
      description: 'Meta支援のオープンソースXRフェローシップにおいて、全国トップ100のフェローに選出。',
      outcome: '2,800名超から100名選出',
    },
    'rec-xrbootcamp': {
      metaLeft: 'Unity & Meta · アメリカ',
      title: 'XR Bootcamp 奨学金',
      description: '集中XRエンジニアリング講座の$8,000全額奨学金を受賞し、最優等（High Honors）で修了。',
      outcome: '$8,000 · 最優等修了',
    },
    'rec-mxr': {
      metaLeft: 'MXR 2026 · アメリカ',
      title: 'Meaningful XR 奨学金',
      description: '会議参加費免除および現地参加に向けた渡航・宿泊支援（最低$300）を受給。',
      outcome: '奨学金採択',
    },
    'rec-imt': {
      metaLeft: 'IMTルッカ · イタリア',
      title: 'ゲームデザイン・サマースクール — IMTルッカ',
      description:
        'DAAD（ドイツ学術交流会 / Deutscher Akademischer Austauschdienst）助成。ゲームデザイン、ゲーム理論、ゲームジャム、循環型経済プロトタイピングの集中ワークショップ。',
      outcome: 'DAAD（ドイツ学術交流会）助成',
      tags: ['DAAD助成', 'ゲームデザイン', 'ゲーム理論', '循環型経済'],
    },
    'rec-isaga': {
      metaLeft: 'ISAGA · ポーランド',
      title: 'ISAGA サマースクール 2026',
      description: 'ポーランド国立学術交流庁（NAWA）の助成により参加費免除。',
      outcome: 'NAWA助成 · 参加費免除',
    },
    'rec-nyu': {
      metaLeft: 'NYUアブダビ · UAE',
      title: 'デジタルヒューマニティーズ・ウィンタースクール 2024',
      description: '探索的データ分析、自然言語処理、コンピュータビジョン、CNN、計算画像解析を履修。',
      outcome: '全額支援 · NYUアブダビ',
    },
    'rec-ai4i': {
      metaLeft: 'AI4I · イタリア・トリノ',
      title: 'CSP–IAS ウィンタースクール 2026 — 暗号学と機械学習',
      description: 'イタリア産業AI研究所（AI4I）主催の集中講座（2026年2月2〜5日・トリノ）に採択されリモート修了。',
      outcome: '採択 · 修了',
      tags: ['暗号学', '機械学習', 'AIセキュリティ'],
    },
    'rec-gamefreak': {
      metaLeft: '日本',
      title: 'ゲームフリーク プログラミングチャレンジ',
      description: 'ゲームフリーク主催アルゴリズム競技プログラミング課題にて満点を獲得。',
      outcome: '33名中1位 · 100/100',
    },
    'rec-tracks': {
      metaLeft: 'Tracks Jobs · 日本',
      title: '全国プログラミングチャレンジ',
      description: 'Tracks Jobs Japan にて評価スコア100/100で1位を獲得。',
      outcome: '1位 · 100/100',
    },
    'rec-mit': {
      metaLeft: 'アメリカ・マサチューセッツ州',
      title: 'Reality Hack at MIT 2026',
      description: 'MIT開催の世界最大級XRハッカソン（2026年1月22〜26日）にて現地技術メンターに選出。',
      outcome: '公式メンター選出',
    },
    'rec-buildathon': {
      metaLeft: 'インド・コチ · 2026',
      title: 'Startup Buildathon India 2026 — コチ大会',
      description: 'Google DeepMindおよびGoogle Cloud参加のコチ市ラウンド（2026年11月20〜21日）に選出。XREAL・Android XR向けロボット教示＆ISO 10218安全基盤「RoboXR AI」を開発。',
      outcome: 'ファイナリスト · RoboXR AI',
    },
    'rec-xrcc': {
      metaLeft: 'XRCC · ドイツ',
      title: 'XRCC ハッカソン 2026',
      description: '世界約190件の応募の中から公式ファイナリストへ進出。',
      outcome: 'グローバルファイナリスト',
    },
    'rec-qiskit': {
      metaLeft: 'インド・コチ · 2026',
      title: 'Qiskit Fall Fest 2026 × QuantumX ハックデイ',
      description: '2026年11月1日、ハイブリッド量子古典医療分類モデルでトップ10ファイナリスト入賞。',
      outcome: 'トップ10ファイナリスト',
    },
    'rec-djx': {
      metaLeft: 'DJX · インド',
      title: 'DJX ハッカソン 2.0 — 最優秀賞＆メンター',
      description: 'メンターとして学生・インディーXRチームの空間プロトタイピングとUI設計を指導しつつ、最優秀賞（賞金₹50,000）を受賞。',
      outcome: '最優秀賞 · ₹50,000 · メンター',
      tags: ['最優秀賞', '賞金₹50,000', 'XRメンタリング'],
    },
    'rec-interiit': {
      metaLeft: 'IITジョードプル · 2023',
      title: 'Inter IIT Tech Meet 12.0 — ゲーム開発部門',
      description: 'IITジョードプル代表のゲーム開発候補メンバーに選出。',
      outcome: '代表メンバー選出',
    },
    'rec-codechef': {
      metaLeft: 'CodeChef · インド',
      title: '競技プログラミング — ダイヤモンドバッジ',
      description: 'データ構造、グラフアルゴリズム、動的計画法にわたる継続的な問題解決実績。',
      outcome: '2,821問解答',
    },
    'rec-science-expo': {
      metaLeft: 'GITAM · インド · 2019',
      title: 'サイエンスエキスポ 2019 — 幹細胞プロジェクト',
      description: '第33回科学の日記念展示において研究開発チームリーダーとして発表。',
      outcome: '1等賞',
    },
    'rec-cogjet': {
      metaLeft: 'IITカンプール · 2022',
      title: 'COGJET — 認知科学合同入学試験',
      description: 'IITカンプール実施の全国認知科学入試。',
      outcome: 'スコア：19/40',
    },
    'edu-iitj': {
      metaLeft: '修士 (MSc) · 2022–2024',
      title: 'デジタルヒューマニティーズ修士 — IITジョードプル',
      description: '学際研究プラットフォーム（IDRP）。履修科目：データ構造とアルゴリズム、プログラミング、Android、HCI、AR/VR制作、機械学習、R、データベース、ソフトウェア工学。',
      outcome: '修了 · インド',
    },
    'edu-gitam': {
      metaLeft: '学士 (BSc) · 2018–2021',
      title: 'バイオインフォマティクス学士 — GITAM大学',
      description: '理学部（ヴィシャーカパトナム）。履修科目：DBMS、データ分析、Unix、プログラミング、計算生物学、創薬設計。',
      outcome: '卒業 · インド',
    },
    'edu-fastfutures': {
      metaLeft: '2022 · Avado（イギリス）',
      title: 'FastFutures プログラム修了',
      description: '起業家精神、データ＆テクノロジー、マーケティング、ファイナンス、チーム協働を学ぶ12週間デジタルビジネス講座。',
      outcome: '修了証取得',
    },
    'edu-cbse': {
      metaLeft: '高校課程 (Class XII) · CBSE',
      title: '高等学校 — 理系コース',
      description: '物理・化学・バイオテクノロジーの基礎課程。',
      outcome: '修了 · インド',
    },
  },
  pt: {
    'rec-xros': {
      metaLeft: 'Meta XROS · Índia',
      title: 'Top 100 Desenvolvedor Meta',
      description: 'Selecionado entre os 100 melhores bolsistas do país para o programa XR open-source apoiado pela Meta.',
      outcome: '100 de 2.800+ candidatos',
    },
    'rec-xrbootcamp': {
      metaLeft: 'Unity e Meta · EUA',
      title: 'Bolsa XR Bootcamp',
      description: 'Bolsa integral de US$ 8.000 para treinamento intensivo em engenharia XR; graduado com Altas Honras.',
      outcome: 'US$ 8.000 · Altas Honras',
    },
    'rec-mxr': {
      metaLeft: 'MXR 2026 · EUA',
      title: 'Bolsa Meaningful XR',
      description: 'Isenção da taxa da conferência mais apoio planejado de viagem e hospedagem (mínimo US$ 300) para participação presencial.',
      outcome: 'Bolsa Concedida',
    },
    'rec-imt': {
      metaLeft: 'IMT Lucca · Itália',
      title: 'Escola de Verão em Design de Jogos — IMT Lucca',
      description:
        'Financiada pelo DAAD (Deutscher Akademischer Austauschdienst — Serviço Alemão de Intercâmbio Acadêmico). Oficinas práticas unindo design de jogos, teoria dos jogos, game jams e economia circular.',
      outcome: 'Financiado pelo DAAD (Intercâmbio Alemão)',
      tags: ['Financiado DAAD', 'Design de Jogos', 'Teoria dos Jogos', 'Economia Circular'],
    },
    'rec-isaga': {
      metaLeft: 'ISAGA · Polônia',
      title: 'Escola de Verão ISAGA 2026',
      description: 'Taxa de participação isenta por bolsa da Agência Nacional Polonesa de Intercâmbio Acadêmico (NAWA).',
      outcome: 'Bolsa NAWA · Isento',
    },
    'rec-nyu': {
      metaLeft: 'NYU Abu Dhabi · EAU',
      title: 'Escola de Inverno em Humanidades Digitais 2024 — Cultura Computacional',
      description: 'Estudo de análise exploratória de dados, PLN, visão computacional, redes neurais convolucionais e análise computacional de imagens.',
      outcome: 'Totalmente Financiado · NYU Abu Dhabi',
    },
    'rec-ai4i': {
      metaLeft: 'AI4I · Turim, Itália',
      title: 'Escola de Inverno CSP–IAS 2026 — Criptografia e Aprendizado de Máquina',
      description: 'Selecionado e concluído remotamente o curso intensivo organizado pelo AI4I (Instituto Italiano de IA para a Indústria) em Turim (2–5 fev 2026).',
      outcome: 'Selecionado · Concluído',
      tags: ['Criptografia', 'Aprendizado de Máquina', 'Segurança de IA'],
    },
    'rec-gamefreak': {
      metaLeft: 'Japão',
      title: 'Desafio de Programação GAME FREAK',
      description: 'Pontuação perfeita em problemas algorítmicos no desafio oficial da GAME FREAK.',
      outcome: '1º de 33 · 100/100',
    },
    'rec-tracks': {
      metaLeft: 'Tracks Jobs · Japão',
      title: 'Desafio Nacional de Programação',
      description: 'Primeiro lugar com nota perfeita 100/100 na plataforma Tracks Jobs Japão.',
      outcome: '1º Lugar · 100/100',
    },
    'rec-mit': {
      metaLeft: 'Cambridge, MA · EUA',
      title: 'Reality Hack no MIT 2026',
      description: 'Selecionado como mentor técnico voluntário presencial para equipes XR no MIT (22–26 jan 2026).',
      outcome: 'Mentor Selecionado',
    },
    'rec-buildathon': {
      metaLeft: 'Kochi, Índia · 2026',
      title: 'Startup Buildathon India 2026 — Kochi',
      description: 'Selecionado para a etapa de Kochi com Google DeepMind e Google Cloud (20–21 nov 2026); criei o RoboXR AI para XREAL e Android XR com segurança ISO 10218.',
      outcome: 'Finalista · RoboXR AI',
    },
    'rec-xrcc': {
      metaLeft: 'XRCC · Alemanha',
      title: 'Hackathon XRCC 2026',
      description: 'Equipe avançou à final oficial entre aproximadamente 190 submissões globais.',
      outcome: 'Finalista Global',
    },
    'rec-qiskit': {
      metaLeft: 'Kochi, Índia · 2026',
      title: 'Qiskit Fall Fest 2026 × QuantumX Hack Day',
      description: 'Finalista Top 10 em 1º de novembro de 2026 com um modelo híbrido quântico-clássico de classificação médica.',
      outcome: 'Finalista Top 10',
    },
    'rec-djx': {
      metaLeft: 'DJX · Índia',
      title: 'DJX Hackathon 2.0 — 1º Prêmio e Mentor',
      description: 'Venceu o 1º Prêmio (₹50.000) atuando como mentor, orientando equipes estudantis e independentes em prototipagem espacial XR e design de interação.',
      outcome: '1º Prêmio · ₹50.000 · Mentor',
      tags: ['1º Prêmio', 'Prêmio ₹50.000', 'Mentoria XR'],
    },
    'rec-interiit': {
      metaLeft: 'IIT Jodhpur · 2023',
      title: 'Inter IIT Tech Meet 12.0 — Desenvolvimento de Jogos',
      description: 'Selecionado para o contingente do IIT Jodhpur na modalidade Desenvolvimento de Jogos.',
      outcome: 'Seleção Contingente',
    },
    'rec-codechef': {
      metaLeft: 'CodeChef · Índia',
      title: 'Solucionador de Problemas — Insígnia Diamante',
      description: 'Prática contínua em programação competitiva com estruturas de dados, grafos e programação dinâmica.',
      outcome: '2.821 Resolvidos',
    },
    'rec-science-expo': {
      metaLeft: 'GITAM · Índia · 2019',
      title: 'Expo Ciência 2019 — Projeto de Células-Tronco',
      description: 'Líder da equipe de P&D, apresentado durante o 33º Dia Nacional da Ciência.',
      outcome: '1º Prêmio',
    },
    'rec-cogjet': {
      metaLeft: 'IIT Kanpur · 2022',
      title: 'COGJET — Exame Conjunto de Ciência Cognitiva',
      description: 'Exame nacional de ingresso em ciência cognitiva realizado pelo IIT Kanpur.',
      outcome: 'Nota: 19/40',
    },
    'edu-iitj': {
      metaLeft: 'Mestrado · 2022–2024',
      title: 'Mestrado em Humanidades Digitais — IIT Jodhpur',
      description: 'Plataforma Interdisciplinar de Pesquisa (IDRP), IIT Jodhpur. Disciplinas: DSA, Programação, Android, IHC, Criação AR/VR, Machine Learning, R, Bancos de Dados e Engenharia de Software.',
      outcome: 'Graduado · Índia',
    },
    'edu-gitam': {
      metaLeft: 'Bacharelado · 2018–2021',
      title: 'Bacharelado em Bioinformática — Universidade GITAM',
      description: 'Escola de Ciências, Visakhapatnam. Disciplinas: DBMS, Análise de Dados, Unix, Programação, Biologia Computacional e Design de Fármacos.',
      outcome: 'Graduado · Índia',
    },
    'edu-fastfutures': {
      metaLeft: '2022 · Avado, Reino Unido',
      title: 'Graduado do Programa FastFutures',
      description: 'Programa de 12 semanas em competências digitais empresariais: Empreendedorismo, Dados e Tecnologia, Marketing, Finanças e Trabalho em Equipe.',
      outcome: 'Certificado de Conclusão',
    },
    'edu-cbse': {
      metaLeft: 'Ensino Médio · CBSE',
      title: 'Ensino Médio — Área de Ciências',
      description: 'Base em Física, Química e Biotecnologia.',
      outcome: 'Concluído · Índia',
    },
  },
  fr: {
    'rec-xros': {
      metaLeft: 'Meta XROS · Inde',
      title: 'Top 100 Développeur Meta',
      description: 'Sélectionné parmi les 100 meilleurs lauréats nationaux du programme XR open-source soutenu par Meta.',
      outcome: '100 sur 2 800+ candidats',
    },
    'rec-xrbootcamp': {
      metaLeft: 'Unity & Meta · États-Unis',
      title: 'Bourse XR Bootcamp',
      description: 'Bourse complète de 8 000 $ pour une formation intensive en ingénierie XR ; diplômé avec Mention Très Bien (High Honors).',
      outcome: '8 000 $ · High Honors',
    },
    'rec-mxr': {
      metaLeft: 'MXR 2026 · États-Unis',
      title: 'Bourse Meaningful XR',
      description: 'Exonération des frais d’inscription à la conférence et aide prévue pour le voyage et l’hébergement (au moins 300 $) en présentiel.',
      outcome: 'Bourse Attribuée',
    },
    'rec-imt': {
      metaLeft: 'IMT Lucca · Italie',
      title: 'École d’Été Game Design — IMT Lucca',
      description:
        'Financée par le DAAD (Deutscher Akademischer Austauschdienst — Office allemand d’échanges universitaires). Ateliers combinant game design, théorie des jeux, game jams et économie circulaire.',
      outcome: 'Financé par le DAAD (Échanges Allemands)',
      tags: ['Financé DAAD', 'Game Design', 'Théorie des Jeux', 'Économie Circulaire'],
    },
    'rec-isaga': {
      metaLeft: 'ISAGA · Pologne',
      title: 'École d’Été ISAGA 2026',
      description: 'Frais de participation exonérés grâce à une subvention de l’Agence nationale polonaise d’échanges académiques (NAWA).',
      outcome: 'Bourse NAWA · Exonéré',
    },
    'rec-nyu': {
      metaLeft: 'NYU Abu Dhabi · ÉAU',
      title: 'École d’Hiver Humanités Numériques 2024 — Culture Computationnelle',
      description: 'Étude de l’analyse exploratoire de données, TAL, vision par ordinateur, réseaux convolutifs et analyse computationnelle d’images.',
      outcome: 'Entièrement Financé · NYU Abu Dhabi',
    },
    'rec-ai4i': {
      metaLeft: 'AI4I · Turin, Italie',
      title: 'École d’Hiver CSP–IAS 2026 — Cryptographie & Machine Learning',
      description: 'Sélectionné et validé à distance pour l’école intensive organisée par AI4I (Institut italien d’IA pour l’industrie) à Turin (2–5 fév 2026).',
      outcome: 'Sélectionné · Validé',
      tags: ['Cryptographie', 'Machine Learning', 'Sécurité IA'],
    },
    'rec-gamefreak': {
      metaLeft: 'Japon',
      title: 'Défi de Programmation GAME FREAK',
      description: 'Score parfait sur les épreuves d’algorithmique du défi officiel GAME FREAK.',
      outcome: '1er sur 33 · 100/100',
    },
    'rec-tracks': {
      metaLeft: 'Tracks Jobs · Japon',
      title: 'Défi National de Programmation',
      description: 'Première place avec une note parfaite de 100/100 sur Tracks Jobs Japon.',
      outcome: '1er Rang · 100/100',
    },
    'rec-mit': {
      metaLeft: 'Cambridge, MA · États-Unis',
      title: 'Reality Hack au MIT 2026',
      description: 'Sélectionné comme mentor technique bénévole sur place pour accompagner les équipes XR au MIT (22–26 jan 2026).',
      outcome: 'Mentor Sélectionné',
    },
    'rec-buildathon': {
      metaLeft: 'Kochi, Inde · 2026',
      title: 'Startup Buildathon India 2026 — Kochi',
      description: 'Présélectionné pour l’étape de Kochi avec Google DeepMind et Google Cloud (20–21 nov 2026) ; conception de RoboXR AI pour XREAL & Android XR avec sécurité ISO 10218.',
      outcome: 'Finaliste · RoboXR AI',
    },
    'rec-xrcc': {
      metaLeft: 'XRCC · Allemagne',
      title: 'Hackathon XRCC 2026',
      description: 'L’équipe a atteint la finale officielle parmi environ 190 propositions internationales.',
      outcome: 'Finaliste Mondial',
    },
    'rec-qiskit': {
      metaLeft: 'Kochi, Inde · 2026',
      title: 'Qiskit Fall Fest 2026 × QuantumX Hack Day',
      description: 'Finaliste Top 10 le 1er novembre 2026 avec un modèle hybride quantique-classique de classification médicale.',
      outcome: 'Finaliste Top 10',
    },
    'rec-djx': {
      metaLeft: 'DJX · Inde',
      title: 'DJX Hackathon 2.0 — 1er Prix & Mentor',
      description: 'Lauréat du 1er Prix (₹50 000) tout en officiant comme mentor auprès d’équipes étudiantes et indépendantes en prototypage spatial XR et design d’interaction.',
      outcome: '1er Prix · ₹50 000 · Mentor',
      tags: ['1er Prix', 'Prix ₹50 000', 'Mentorat XR'],
    },
    'rec-interiit': {
      metaLeft: 'IIT Jodhpur · 2023',
      title: 'Inter IIT Tech Meet 12.0 — Développement de Jeux',
      description: 'Sélectionné dans la délégation de l’IIT Jodhpur en développement de jeux vidéo.',
      outcome: 'Sélection Délégation',
    },
    'rec-codechef': {
      metaLeft: 'CodeChef · Inde',
      title: 'Résolveur de Problèmes — Badge Diamant',
      description: 'Pratique soutenue en programmation compétitive : structures de données, graphes et programmation dynamique.',
      outcome: '2 821 Résolus',
    },
    'rec-science-expo': {
      metaLeft: 'GITAM · Inde · 2019',
      title: 'Expo Science 2019 — Projet Cellules Souches',
      description: 'Chef d’équipe R&D, présenté lors de la 33e Journée nationale de la science.',
      outcome: '1er Prix',
    },
    'rec-cogjet': {
      metaLeft: 'IIT Kanpur · 2022',
      title: 'COGJET — Examen Commun en Sciences Cognitives',
      description: 'Concours national d’entrée en sciences cognitives organisé par l’IIT Kanpur.',
      outcome: 'Score : 19/40',
    },
    'edu-iitj': {
      metaLeft: 'MSc · 2022–2024',
      title: 'Master en Humanités Numériques — IIT Jodhpur',
      description: 'Plateforme de Recherche Interdisciplinaire (IDRP), IIT Jodhpur. Cours : Algorithmique, Programmation, Android, IHM, Création AR/VR, Machine Learning, R, Bases de Données et Génie Logiciel.',
      outcome: 'Diplômé · Inde',
    },
    'edu-gitam': {
      metaLeft: 'BSc · 2018–2021',
      title: 'Licence en Bio-informatique — Université GITAM',
      description: 'Faculté des Sciences, Visakhapatnam. Cours : SGBD, Analyse de Données, Unix, Programmation, Biologie Computationnelle et Conception de Médicaments.',
      outcome: 'Diplômé · Inde',
    },
    'edu-fastfutures': {
      metaLeft: '2022 · Avado, Royaume-Uni',
      title: 'Diplômé du Programme FastFutures',
      description: 'Programme de 12 semaines en compétences numériques d’entreprise : Entrepreneuriat, Données & Technologie, Marketing, Finance et Travail d’Équipe.',
      outcome: 'Certificat de Réussite',
    },
    'edu-cbse': {
      metaLeft: 'Terminale · CBSE',
      title: 'Enseignement Secondaire Supérieur — Filière Sciences',
      description: 'Fondamentaux en Physique, Chimie et Biotechnologie.',
      outcome: 'Validé · Inde',
    },
  },
};

export function getLocalizedRecognition(
  item: RecognitionItem,
  lang: LanguageCode
): RecognitionItem {
  if (lang === 'en') return item;
  if (lang === 'en-US') {
    return {
      ...item,
      title: toUsEnglish(item.title),
      description: item.description ? toUsEnglish(item.description) : item.description,
      outcome: toUsEnglish(item.outcome),
      tags: item.tags?.map(toUsEnglish),
    };
  }
  const loc = RECOGNITIONS_TRANSLATIONS[lang]?.[item.id];
  const groupLabel = GROUP_LABELS[lang]?.[item.group] ?? item.groupLabel;
  if (!loc) return { ...item, groupLabel };
  return {
    ...item,
    groupLabel,
    metaLeft: loc.metaLeft,
    title: loc.title,
    description: loc.description ?? item.description,
    outcome: loc.outcome,
    tags: loc.tags ?? item.tags,
  };
}

const WRITING_BY_LANG: Record<NonEnglishLang, { label: string; title: string }[]> = {
  es: [
    { label: 'Portafolio', title: 'Portafolio XR: Ashish Kumar' },
    { label: 'Escuela de Verano', title: 'Escuela de Verano de Diseño de Juegos en IMT Lucca' },
    { label: 'Escuela de Invierno', title: 'La Escuela de Invierno de Computación totalmente financiada de NYU' },
  ],
  de: [
    { label: 'Portfolio', title: 'XR-Portfolio: Ashish Kumar' },
    { label: 'Sommerschule', title: 'Game Design Summer School an der IMT Lucca' },
    { label: 'Winterschule', title: 'Die vollfinanzierte NYU Winter School in Computing' },
  ],
  ja: [
    { label: 'ポートフォリオ', title: 'XR ポートフォリオ：Ashish Kumar' },
    { label: 'サマースクール', title: 'IMTルッカ ゲームデザイン・サマースクール体験記' },
    { label: 'ウィンタースクール', title: '全額支援 NYU コンピューティング・ウィンタースクール体験記' },
  ],
  pt: [
    { label: 'Portfólio', title: 'Portfólio XR: Ashish Kumar' },
    { label: 'Escola de Verão', title: 'Escola de Verão em Design de Jogos na IMT Lucca' },
    { label: 'Escola de Inverno', title: 'A Escola de Inverno de Computação totalmente financiada da NYU' },
  ],
  fr: [
    { label: 'Portfolio', title: 'Portfolio XR : Ashish Kumar' },
    { label: 'École d’Été', title: 'École d’Été Game Design à l’IMT Lucca' },
    { label: 'École d’Hiver', title: 'L’École d’Hiver en Informatique entièrement financée de NYU' },
  ],
};

export function getLocalizedWriting(items: WritingItem[], lang: LanguageCode): WritingItem[] {
  if (lang === 'en' || lang === 'en-US') return items;
  const loc = WRITING_BY_LANG[lang];
  return items.map((item, i) => (loc[i] ? { ...item, ...loc[i] } : item));
}

const RESOURCES_BY_LANG: Record<NonEnglishLang, { label: string; title: string }[]> = {
  es: [{ label: 'Práctica de IA', title: 'Deep Agnt · Problemas' }],
  de: [{ label: 'KI-Praxis', title: 'Deep Agnt · Aufgaben' }],
  ja: [{ label: 'AI演習', title: 'Deep Agnt · 問題集' }],
  pt: [{ label: 'Prática de IA', title: 'Deep Agnt · Problemas' }],
  fr: [{ label: 'Pratique IA', title: 'Deep Agnt · Problèmes' }],
};

export function getLocalizedResources(items: WritingItem[], lang: LanguageCode): WritingItem[] {
  if (lang === 'en' || lang === 'en-US') return items;
  const loc = RESOURCES_BY_LANG[lang];
  return items.map((item, i) => (loc[i] ? { ...item, ...loc[i] } : item));
}

const PROFILE_LINKS_BY_LANG: Record<NonEnglishLang, { label?: string; detail?: string }[]> = {
  es: [
    { label: 'Correo' },
    { detail: 'github.com/Ashish11828 · Proyectos y código' },
    {},
    { detail: 'Publicaciones y citas' },
    { detail: 'codechef.com/users/ashish_q121 · 2,821 resueltos' },
    { detail: 'Implementaciones de algoritmos ML desde cero' },
    {},
    {},
  ],
  de: [
    { label: 'E-Mail' },
    { detail: 'github.com/Ashish11828 · Projekte & Code' },
    {},
    { detail: 'Publikationen & Zitationen' },
    { detail: 'codechef.com/users/ashish_q121 · 2.821 gelöst' },
    { detail: 'First-Principles-ML-Algorithmenimplementierungen' },
    {},
    {},
  ],
  ja: [
    { label: 'メール' },
    { detail: 'github.com/Ashish11828 · プロジェクト＆コード' },
    {},
    { detail: '論文・引用一覧' },
    { detail: 'codechef.com/users/ashish_q121 · 2,821問解答' },
    { detail: '基礎からの機械学習アルゴリズム実装' },
    {},
    {},
  ],
  pt: [
    { label: 'E-mail' },
    { detail: 'github.com/Ashish11828 · Projetos e código' },
    {},
    { detail: 'Publicações e citações' },
    { detail: 'codechef.com/users/ashish_q121 · 2.821 resolvidos' },
    { detail: 'Implementações de algoritmos de ML do zero' },
    {},
    {},
  ],
  fr: [
    { label: 'E-mail' },
    { detail: 'github.com/Ashish11828 · Projets & code' },
    {},
    { detail: 'Publications & citations' },
    { detail: 'codechef.com/users/ashish_q121 · 2 821 résolus' },
    { detail: 'Implémentations d’algorithmes ML de zéro' },
    {},
    {},
  ],
};

export function getLocalizedProfileLinks(
  links: ProfileLink[],
  lang: LanguageCode
): ProfileLink[] {
  if (lang === 'en' || lang === 'en-US') return links;
  const loc = PROFILE_LINKS_BY_LANG[lang];
  return links.map((link, i) => ({
    ...link,
    label: loc[i]?.label ?? link.label,
    detail: loc[i]?.detail ?? link.detail,
  }));
}

export interface ExtraUiTranslations {
  cvSubtitle: string;
  openToLabel: string;
  openToText: string;
  copyBibtex: string;
  bibtexCopied: string;
  rolePresets: { chip: string; query: string }[];
  voiceLabels: Record<string, string>;
  optgroupPapers: string;
  optgroupProjects: string;
  voiceMetaLabel: string;
  askPaperPrompt: (venue: string, title: string) => string;
  askProjectPrompt: (title: string) => string;
}

export const EXTRA_UI_BY_LANG: Record<LanguageCode, ExtraUiTranslations> = {
  en: {
    cvSubtitle:
      'XR / Spatial Computing Engineer & Researcher · Smart Glasses · Human-Centered AI',
    openToLabel: 'Open to',
    openToText: 'XR / Spatial Computing Engineer & Research Engineer — Europe, Japan & Remote',
    copyBibtex: 'Copy BibTeX',
    bibtexCopied: 'BibTeX Copied',
    rolePresets: [
      {
        chip: 'XR & Smart Glasses Prototyper',
        query: 'XR & Smart Glasses Prototyper (Unity, Lens Studio, C++/TypeScript) in Tokyo or Europe',
      },
      {
        chip: 'AI Safety & Evaluation Engineer',
        query: 'AI Safety & Evaluation Engineer building reliable Python auditing & human-oversight pipelines',
      },
      {
        chip: 'Applied ML & Quantum Research Intern',
        query: 'Applied ML & Quantum Research Intern working on healthcare or spatial computing',
      },
    ],
    voiceLabels: { Kore: 'Kore · Warm', Zephyr: 'Zephyr · Bright', Fenrir: 'Fenrir · Deep' },
    optgroupPapers: '2026 Research Publications',
    optgroupProjects: 'Selected Projects',
    voiceMetaLabel: 'Voice',
    askPaperPrompt: (venue, title) =>
      `Break down Ashish Kumar's ${venue} work "${title}" — what problem does it solve, how does it work, and why does it matter?`,
    askProjectPrompt: (title) =>
      `Explain the technical architecture, contribution, and outcome of "${title}" in detail.`,
  },
  'en-US': {
    cvSubtitle:
      'XR / Spatial Computing Engineer & Researcher · Smart Glasses · Human-Centered AI',
    openToLabel: 'Open to',
    openToText: 'XR / Spatial Computing Engineer & Research Engineer — Europe, Japan & Remote',
    copyBibtex: 'Copy BibTeX',
    bibtexCopied: 'BibTeX Copied',
    rolePresets: [
      {
        chip: 'XR & Smart Glasses Prototyper',
        query: 'XR & Smart Glasses Prototyper (Unity, Lens Studio, C++/TypeScript) in Tokyo or Europe',
      },
      {
        chip: 'AI Safety & Evaluation Engineer',
        query: 'AI Safety & Evaluation Engineer building reliable Python auditing & human-oversight pipelines',
      },
      {
        chip: 'Applied ML & Quantum Research Intern',
        query: 'Applied ML & Quantum Research Intern working on healthcare or spatial computing',
      },
    ],
    voiceLabels: { Kore: 'Kore · Warm', Zephyr: 'Zephyr · Bright', Fenrir: 'Fenrir · Deep' },
    optgroupPapers: '2026 Research Publications',
    optgroupProjects: 'Selected Projects',
    voiceMetaLabel: 'Voice',
    askPaperPrompt: (venue, title) =>
      `Break down Ashish Kumar's ${venue} work "${title}" — what problem does it solve, how does it work, and why does it matter?`,
    askProjectPrompt: (title) =>
      `Explain the technical architecture, contribution, and outcome of "${title}" in detail.`,
  },
  es: {
    cvSubtitle:
      'Ingeniero de Software e Investigador Independiente · Computación Espacial y XR en Gafas Inteligentes · IA Centrada en el Humano · Quantum ML',
    openToLabel: 'Disponible para',
    openToText: 'Ingeniería XR / Computación Espacial, Investigación y Doctorado — Europa, Japón y Remoto',
    copyBibtex: 'Copiar BibTeX',
    bibtexCopied: 'BibTeX Copiado',
    rolePresets: [
      {
        chip: 'Prototipador XR y Gafas Inteligentes',
        query: 'Prototipador XR y Gafas Inteligentes (Unity, Lens Studio, C++/TypeScript) en Tokio o Europa',
      },
      {
        chip: 'Ingeniero de Seguridad y Evaluación IA',
        query: 'Ingeniero de Seguridad y Evaluación de IA construyendo pipelines reproducibles en Python y supervisión humana',
      },
      {
        chip: 'Pasante de Investigación ML y Cuántica',
        query: 'Pasante de Investigación en ML Aplicado y Computación Cuántica en salud o computación espacial',
      },
    ],
    voiceLabels: { Kore: 'Kore · Cálida', Zephyr: 'Zephyr · Clara', Fenrir: 'Fenrir · Grave' },
    optgroupPapers: 'Publicaciones de Investigación 2026',
    optgroupProjects: 'Proyectos Seleccionados',
    voiceMetaLabel: 'Voz',
    askPaperPrompt: (venue, title) =>
      `Explica en detalle el trabajo de Ashish Kumar en ${venue} "${title}": qué problema resuelve, cómo funciona y por qué es relevante.`,
    askProjectPrompt: (title) =>
      `Explica en detalle la arquitectura técnica, contribución y resultados de "${title}".`,
  },
  de: {
    cvSubtitle:
      'Softwareentwickler & Unabhängiger Forscher · Spatial Computing & Smart-Glasses-XR · Menschzentrierte KI · Angewandtes Quanten-ML',
    openToLabel: 'Offen für',
    openToText: 'XR- / Spatial-Computing-Engineering, Research Engineer & Promotion — Europa, Japan & Remote',
    copyBibtex: 'BibTeX kopieren',
    bibtexCopied: 'BibTeX kopiert',
    rolePresets: [
      {
        chip: 'XR- & Smart-Glasses-Prototyper',
        query: 'XR- & Smart-Glasses-Prototyper (Unity, Lens Studio, C++/TypeScript) in Tokio oder Europa',
      },
      {
        chip: 'KI-Sicherheits- & Evaluationsingenieur',
        query: 'KI-Sicherheits- & Evaluationsingenieur für zuverlässige Python-Audit- und Human-Oversight-Pipelines',
      },
      {
        chip: 'Forschungspraktikant ML & Quanten',
        query: 'Forschungspraktikant für angewandtes ML und Quantencomputing im Gesundheitswesen oder Spatial Computing',
      },
    ],
    voiceLabels: { Kore: 'Kore · Warm', Zephyr: 'Zephyr · Klar', Fenrir: 'Fenrir · Tief' },
    optgroupPapers: 'Forschungspublikationen 2026',
    optgroupProjects: 'Ausgewählte Projekte',
    voiceMetaLabel: 'Stimme',
    askPaperPrompt: (venue, title) =>
      `Erkläre Ashish Kumars Arbeit bei ${venue} „${title}“ — welches Problem sie löst, wie sie funktioniert und warum sie wichtig ist.`,
    askProjectPrompt: (title) =>
      `Erkläre die technische Architektur, den Beitrag und die Ergebnisse von „${title}“ im Detail.`,
  },
  ja: {
    cvSubtitle:
      'ソフトウェアエンジニア・独立研究者 · 空間コンピューティング・スマートグラスXR · 人間中心AI · 応用量子ML',
    openToLabel: '募集・連携対象',
    openToText: 'XR・空間コンピューティング開発、リサーチエンジニア、博士課程（欧州・日本・リモート）',
    copyBibtex: 'BibTeXをコピー',
    bibtexCopied: 'コピー済み',
    rolePresets: [
      {
        chip: 'XR・スマートグラス開発者',
        query: '東京または欧州のXR・スマートグラスプロトタイパー（Unity, Lens Studio, C++/TypeScript）',
      },
      {
        chip: 'AI安全性・評価エンジニア',
        query: 'Python監査と人間監視パイプラインを構築するAI安全性・評価エンジニア',
      },
      {
        chip: '応用ML・量子研究インターン',
        query: '医療または空間コンピューティングに取り組む応用ML・量子コンピューティング研究インターン',
      },
    ],
    voiceLabels: { Kore: 'Kore · 温かい', Zephyr: 'Zephyr · 明るい', Fenrir: 'Fenrir · 落ち着いた' },
    optgroupPapers: '2026年 研究論文・発表',
    optgroupProjects: '主なプロジェクト',
    voiceMetaLabel: '音声',
    askPaperPrompt: (venue, title) =>
      `Ashish Kumar の ${venue} での研究「${title}」について、解決する課題・仕組み・意義をわかりやすく解説してください。`,
    askProjectPrompt: (title) =>
      `プロジェクト「${title}」の技術構成、担当した貢献、成果を詳しく解説してください。`,
  },
  pt: {
    cvSubtitle:
      'Engenheiro de Software e Pesquisador Independente · Computação Espacial & XR em Óculos Inteligentes · IA Centrada no Humano · Quantum ML',
    openToLabel: 'Aberto a',
    openToText: 'Engenharia XR / Computação Espacial, Research Engineer & Doutorado — Europa, Japão e Remoto',
    copyBibtex: 'Copiar BibTeX',
    bibtexCopied: 'BibTeX Copiado',
    rolePresets: [
      {
        chip: 'Prototipador XR & Óculos Inteligentes',
        query: 'Prototipador XR e Óculos Inteligentes (Unity, Lens Studio, C++/TypeScript) em Tóquio ou na Europa',
      },
      {
        chip: 'Engenheiro de Segurança & Avaliação IA',
        query: 'Engenheiro de Segurança e Avaliação de IA construindo pipelines reproduzíveis em Python e supervisão humana',
      },
      {
        chip: 'Estagiário de Pesquisa ML & Quântica',
        query: 'Estagiário de Pesquisa em ML Aplicado e Computação Quântica voltado a saúde ou computação espacial',
      },
    ],
    voiceLabels: { Kore: 'Kore · Calorosa', Zephyr: 'Zephyr · Clara', Fenrir: 'Fenrir · Grave' },
    optgroupPapers: 'Publicações de Pesquisa 2026',
    optgroupProjects: 'Projetos Selecionados',
    voiceMetaLabel: 'Voz',
    askPaperPrompt: (venue, title) =>
      `Explique em detalhes o trabalho de Ashish Kumar no ${venue} "${title}": qual problema resolve, como funciona e por que importa.`,
    askProjectPrompt: (title) =>
      `Explique em detalhes a arquitetura técnica, a contribuição e os resultados de "${title}".`,
  },
  fr: {
    cvSubtitle:
      'Ingénieur Logiciel & Chercheur Indépendant · Informatique Spatiale & XR Lunettes Connectées · IA Centrée sur l’Humain · Quantum ML',
    openToLabel: 'Ouvert à',
    openToText: 'Ingénierie XR / Spatial Computing, Research Engineer & Doctorat — Europe, Japon & Télétravail',
    copyBibtex: 'Copier BibTeX',
    bibtexCopied: 'BibTeX Copié',
    rolePresets: [
      {
        chip: 'Prototypeur XR & Lunettes Connectées',
        query: 'Prototypeur XR et Lunettes Connectées (Unity, Lens Studio, C++/TypeScript) à Tokyo ou en Europe',
      },
      {
        chip: 'Ingénieur Sûreté & Évaluation IA',
        query: 'Ingénieur Sûreté et Évaluation IA concevant des pipelines d’audit Python reproductibles et de supervision humaine',
      },
      {
        chip: 'Stagiaire Recherche ML & Quantique',
        query: 'Stagiaire Recherche en ML Appliqué et Informatique Quantique pour la santé ou le calcul spatial',
      },
    ],
    voiceLabels: { Kore: 'Kore · Chaleureuse', Zephyr: 'Zephyr · Claire', Fenrir: 'Fenrir · Grave' },
    optgroupPapers: 'Publications de Recherche 2026',
    optgroupProjects: 'Projets Sélectionnés',
    voiceMetaLabel: 'Voix',
    askPaperPrompt: (venue, title) =>
      `Présente en détail les travaux d’Ashish Kumar à ${venue} « ${title} » : quel problème ils résolvent, comment ils fonctionnent et pourquoi ils comptent.`,
    askProjectPrompt: (title) =>
      `Explique en détail l’architecture technique, la contribution et les résultats de « ${title} ».`,
  },
};
