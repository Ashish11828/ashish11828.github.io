import React, { useEffect, useState } from 'react';
import type { DomainSymbolKey } from './OrgSymbol';

export interface AnimeReelScene {
  id: string;
  index: string;
  focusKey: DomainSymbolKey;
  shortLabel: string;
  title: string;
  caption: string;
  src: string;
  alt: string;
  motionClass: string;
}

export const ANIME_REEL_SCENES: AnimeReelScene[] = [
  {
    id: 'focus-xr',
    index: '01',
    focusKey: 'xr',
    shortLabel: 'XR',
    title: 'Extended Reality & Smart Glasses',
    caption: 'Designing hands-free spatial optics, mixed-reality HUDs, and smart glasses prototypes.',
    src: '/src/assets/images/anime_reel_lab_ashish_1795329090793.jpg',
    alt: 'Anime illustration of a researcher wearing smart glasses sketching spatial XR optical diagrams in a sunlit lab',
    motionClass: 'anime-kenburns-1',
  },
  {
    id: 'focus-ai',
    index: '02',
    focusKey: 'ai',
    shortLabel: 'AI',
    title: 'Human-Centered & Agentic AI',
    caption: 'Building trustworthy, interpretable, and human-in-the-loop intelligent systems.',
    src: '/src/assets/images/focus_human_ai_1795330412685.jpg',
    alt: 'Anime illustration of a researcher interacting with glowing golden and rose human-centered AI neural constellations by tall sunlit windows',
    motionClass: 'anime-kenburns-2',
  },
  {
    id: 'focus-ml',
    index: '03',
    focusKey: 'ml',
    shortLabel: 'ML',
    title: 'Machine Learning & Computer Vision',
    caption: 'Crafting reproducible learning pipelines, depth perception models, and first-principles algorithms.',
    src: '/src/assets/images/focus_ml_vision_1795330413100.jpg',
    alt: 'Anime illustration of an engineer exploring holographic computer-vision depth meshes and glowing regression curves with cherry blossoms outside',
    motionClass: 'anime-kenburns-3',
  },
  {
    id: 'focus-quantum',
    index: '04',
    focusKey: 'quantum',
    shortLabel: 'Quantum',
    title: 'Quantum Computing & QML',
    caption: 'Exploring hybrid quantum-classical circuits, parameterized qubits, and clinical classification with Qiskit and PennyLane.',
    src: '/src/assets/images/focus_quantum_circuits_1795330414656.jpg',
    alt: 'Anime illustration of a researcher observing glowing Bloch-sphere qubit rings inside a starry twilight observatory with blooming cherry blossoms',
    motionClass: 'anime-kenburns-4',
  },
  {
    id: 'focus-robotics',
    index: '05',
    focusKey: 'robotics',
    shortLabel: 'Robotics',
    title: 'Embodied Robotics & Kinematics',
    caption: 'Bridging spatial sensing, precision motion arcs, and interactive embodied machines.',
    src: '/src/assets/images/focus_robotics_lab_1795330413520.jpg',
    alt: 'Anime illustration of a robotics engineer calibrating an articulated robotic arm with glowing kinematic trajectory arcs beside a blooming courtyard',
    motionClass: 'anime-kenburns-1',
  },
  {
    id: 'focus-space',
    index: '06',
    focusKey: 'space',
    shortLabel: 'Space',
    title: 'Space Science & Analog Missions',
    caption: 'Engineering hands-free mixed-reality mission interfaces for planetary analog habitats.',
    src: '/src/assets/images/focus_space_analog_1795330412969.jpg',
    alt: 'Anime illustration of a space researcher wearing smart glasses inside a panoramic analog habitat dome overlooking orbital contours and a nebula sky',
    motionClass: 'anime-kenburns-2',
  },
];

interface AnimeBackgroundReelProps {
  activeIndex: number;
  paused: boolean;
}

export const AnimeBackgroundReel: React.FC<AnimeBackgroundReelProps> = ({
  activeIndex,
  paused,
}) => {
  // Progressive loading: render current scene immediately and quietly preload next scene
  const [loadedIndices, setLoadedIndices] = useState<Set<number>>(() => new Set([0]));

  useEffect(() => {
    const nextIndex = (activeIndex + 1) % ANIME_REEL_SCENES.length;
    setLoadedIndices((prev) => {
      if (prev.has(activeIndex) && prev.has(nextIndex)) return prev;
      const next = new Set(prev);
      next.add(activeIndex);
      next.add(nextIndex);
      return next;
    });
  }, [activeIndex]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-0 overflow-hidden no-print ${
        paused ? 'motion-paused' : ''
      }`}
    >
      {ANIME_REEL_SCENES.map((scene, idx) => {
        if (!loadedIndices.has(idx)) return null;
        const isActive = idx === activeIndex;
        return (
          <div
            key={scene.id}
            className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${
              isActive ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={scene.src}
              alt=""
              referrerPolicy="no-referrer"
              decoding="async"
              fetchPriority={idx === 0 ? 'high' : 'low'}
              className={`h-full w-full object-cover contrast-[1.05] saturate-[1.08] ${
                isActive ? scene.motionClass : ''
              }`}
            />
          </div>
        );
      })}

      {/* Ultra-light cinema vignette so the Focus Area anime video stays crystal clear and sharp */}
      <div className="absolute inset-0 bg-[#FCFBF8]/22 dark:bg-[#070B15]/20 transition-colors duration-300" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#FCFBF8]/30 via-transparent to-[#FCFBF8]/38 dark:from-[#070B15]/34 dark:via-transparent dark:to-[#070B15]/44" />
    </div>
  );
};
