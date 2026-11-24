import React from 'react';
import { motion } from 'motion/react';

export type ResearchPaperId =
  | 'esa-xr-2026'
  | 'aivr-2026'
  | 'icmlai-2026'
  | 'xrm-2026'
  | 'vr-summit-2026';

interface ResearchPaperAnimationProps {
  paperId: string;
  paused: boolean;
}

/**
 * Compact, domain-authentic animated schematic preview tailored to each of Ashish's
 * 2026 research papers and demonstrations. Uses smooth compositor animations and
 * respects the global Play/Pause reel control.
 */
export const ResearchPaperAnimation: React.FC<ResearchPaperAnimationProps> = ({
  paperId,
  paused,
}) => {
  return (
    <div
      aria-hidden="true"
      className="relative mt-3 h-[112px] w-full max-w-[240px] overflow-hidden rounded-xl border border-[#D8CFC2]/90 bg-gradient-to-br from-[#0B1224] via-[#121D37] to-[#1A223B] shadow-inner transition-colors duration-200 group-hover:border-[#C83E4D]/65 dark:border-white/14 dark:group-hover:border-[#F47292]/65"
    >
      {/* Subtle architectural grid backdrop */}
      <svg
        viewBox="0 0 240 112"
        className="absolute inset-0 h-full w-full opacity-20"
        fill="none"
      >
        <defs>
          <pattern
            id={`grid-${paperId}`}
            width="16"
            height="16"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M16 0H0V16"
              stroke="rgba(220,232,255,0.35)"
              strokeWidth="0.6"
            />
          </pattern>
        </defs>
        <rect width="240" height="112" fill={`url(#grid-${paperId})`} />
      </svg>

      {/* 1. ESA XR 2026: Mixed-Reality Camera Interface for Space Analog Missions */}
      {paperId === 'esa-xr-2026' && (
        <svg viewBox="0 0 240 112" className="relative z-10 h-full w-full" fill="none">
          {/* Planetary analog terrain horizon */}
          <path
            d="M0 88 Q42 72 86 80 T174 74 T240 84 L240 112 L0 112 Z"
            fill="rgba(56, 114, 178, 0.22)"
          />
          <path
            d="M0 88 Q42 72 86 80 T174 74 T240 84"
            stroke="rgba(130, 212, 255, 0.65)"
            strokeWidth="1.2"
          />
          {/* Subtle analog dome silhouette */}
          <path
            d="M162 76 A18 14 0 0 1 198 76 Z"
            stroke="rgba(255, 216, 168, 0.7)"
            fill="rgba(255, 216, 168, 0.12)"
            strokeWidth="1"
          />
          {/* MR Camera viewfinder frame */}
          <g stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" strokeLinecap="round">
            <path d="M18 22h11M18 22v11" />
            <path d="M222 22h-11M222 22v11" />
            <path d="M18 92h11M18 92v-11" />
            <path d="M222 92h-11M222 92v-11" />
          </g>
          {/* Gaze-tracking capture reticle gliding across analog terrain */}
          <motion.g
            animate={
              paused
                ? { x: 0, y: 0 }
                : { x: [-26, 36, 10, -26], y: [4, -10, 8, 4] }
            }
            transition={{ duration: 6.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <circle
              cx="116"
              cy="54"
              r="14"
              stroke="rgba(255, 164, 188, 0.9)"
              strokeWidth="1.3"
              strokeDasharray="4 3"
            />
            <circle cx="116" cy="54" r="3" fill="#FFD1E0" />
            <path
              d="M116 35v5M116 68v5M97 54h5M130 54h5"
              stroke="rgba(255, 200, 218, 0.85)"
              strokeWidth="1.1"
            />
            {/* Expanding shutter capture pulse */}
            <motion.circle
              cx="116"
              cy="54"
              r="14"
              stroke="rgba(148, 224, 255, 0.85)"
              strokeWidth="1"
              style={{ originX: '116px', originY: '54px' }}
              animate={
                paused
                  ? { scale: 1, opacity: 0.35 }
                  : { scale: [0.9, 1.85], opacity: [0.85, 0] }
              }
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
            />
          </motion.g>
          {/* Auto-metadata tag lines */}
          <motion.g
            animate={paused ? { opacity: 0.8 } : { opacity: [0.45, 1, 0.45] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <rect x="28" y="28" width="44" height="3.5" rx="1.75" fill="rgba(148, 224, 255, 0.78)" />
            <rect x="28" y="35" width="30" height="3" rx="1.5" fill="rgba(255, 198, 215, 0.65)" />
          </motion.g>
        </svg>
      )}

      {/* 2. AIVR 2026: Decarbonizing the Metaverse (XR + AI + IoT Sustainable System) */}
      {paperId === 'aivr-2026' && (
        <svg viewBox="0 0 240 112" className="relative z-10 h-full w-full" fill="none">
          {/* Circular sustainable energy-loop orbit linking XR, AI, and IoT */}
          <motion.circle
            cx="120"
            cy="56"
            r="34"
            stroke="rgba(98, 214, 168, 0.65)"
            strokeWidth="1.4"
            strokeDasharray="7 5"
            style={{ originX: '120px', originY: '56px' }}
            animate={paused ? { rotate: 0 } : { rotate: 360 }}
            transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
          />
          <motion.circle
            cx="120"
            cy="56"
            r="22"
            stroke="rgba(255, 206, 148, 0.45)"
            strokeWidth="1.1"
            strokeDasharray="4 4"
            style={{ originX: '120px', originY: '56px' }}
            animate={paused ? { rotate: 0 } : { rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          />
          {/* Leaf / decarbonized core */}
          <motion.path
            d="M120 43 C129 47 131 58 120 68 C109 58 111 47 120 43 Z"
            fill="rgba(98, 214, 168, 0.3)"
            stroke="#7AE7BC"
            strokeWidth="1.3"
            style={{ originX: '120px', originY: '56px' }}
            animate={paused ? { scale: 1 } : { scale: [0.95, 1.07, 0.95] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <path d="M120 48 V65" stroke="#B7F7DC" strokeWidth="1" />

          {/* Coupled multi-modal nodes: XR, AI, IoT */}
          {[
            { cx: 64, cy: 36, label: 'XR', color: '#FFA3BC' },
            { cx: 176, cy: 36, label: 'AI', color: '#9BD7FF' },
            { cx: 176, cy: 78, label: 'IoT', color: '#7AE7BC' },
          ].map((node, i) => (
            <g key={node.label}>
              <motion.line
                x1={node.cx}
                y1={node.cy}
                x2="120"
                y2="56"
                stroke={node.color}
                strokeOpacity="0.45"
                strokeWidth="1.1"
                strokeDasharray="4 4"
                animate={paused ? { strokeDashoffset: 0 } : { strokeDashoffset: [-24, 0] }}
                transition={{ duration: 2.6 + i * 0.4, repeat: Infinity, ease: 'linear' }}
              />
              <circle
                cx={node.cx}
                cy={node.cy}
                r="11"
                fill="rgba(11, 18, 36, 0.9)"
                stroke={node.color}
                strokeWidth="1.2"
              />
              <text
                x={node.cx}
                y={node.cy + 3.2}
                textAnchor="middle"
                fill="#EEF4FF"
                fontSize="8"
                fontFamily="monospace"
                fontWeight="600"
              >
                {node.label}
              </text>
            </g>
          ))}
          {/* Downward carbon-reduction curve */}
          <motion.path
            d="M28 66 Q48 70 62 82 T92 92"
            stroke="#7AE7BC"
            strokeWidth="1.5"
            strokeLinecap="round"
            animate={paused ? { opacity: 0.85 } : { opacity: [0.45, 1, 0.45] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </svg>
      )}

      {/* 3. ICMLAI 2026: Neural-Sensing Smart Glasses for Human-AI Collaboration */}
      {paperId === 'icmlai-2026' && (
        <svg viewBox="0 0 240 112" className="relative z-10 h-full w-full" fill="none">
          {/* Flowing EEG / neural waveform behind glasses */}
          <motion.path
            d="M14 56 Q28 32 42 56 T70 56 T98 56 T126 56 T154 56 T182 56 T210 56 T228 56"
            stroke="rgba(255, 163, 188, 0.72)"
            strokeWidth="1.4"
            strokeDasharray="10 5"
            animate={paused ? { strokeDashoffset: 0 } : { strokeDashoffset: [-45, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
          />
          <motion.path
            d="M14 62 Q32 82 50 62 T86 62 T122 62 T158 62 T194 62 T228 62"
            stroke="rgba(148, 220, 255, 0.55)"
            strokeWidth="1.1"
            strokeDasharray="6 6"
            animate={paused ? { strokeDashoffset: 0 } : { strokeDashoffset: [36, 0] }}
            transition={{ duration: 3.1, repeat: Infinity, ease: 'linear' }}
          />
          {/* Sleek smart-glasses optical silhouette */}
          <rect
            x="56"
            y="36"
            width="52"
            height="36"
            rx="11"
            fill="rgba(13, 21, 42, 0.72)"
            stroke="rgba(232, 240, 255, 0.85)"
            strokeWidth="1.6"
          />
          <rect
            x="132"
            y="36"
            width="52"
            height="36"
            rx="11"
            fill="rgba(13, 21, 42, 0.72)"
            stroke="rgba(232, 240, 255, 0.85)"
            strokeWidth="1.6"
          />
          <path
            d="M108 50 Q120 44 132 50"
            stroke="rgba(232, 240, 255, 0.85)"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          {/* Right lens augmented-intelligence focus ring */}
          <motion.circle
            cx="158"
            cy="54"
            r="10"
            stroke="#9BD7FF"
            strokeWidth="1.2"
            strokeDasharray="4 3"
            style={{ originX: '158px', originY: '54px' }}
            animate={paused ? { rotate: 0 } : { rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          />
          {/* Left lens neural pulse core */}
          <motion.circle
            cx="82"
            cy="54"
            r="5"
            fill="#FFA3BC"
            style={{ originX: '82px', originY: '54px' }}
            animate={paused ? { scale: 1 } : { scale: [0.8, 1.35, 0.8], opacity: [0.55, 1, 0.55] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </svg>
      )}

      {/* 4. XRM 2026: Augmenting Ideation — Dynamic MR Mind Mapping & Content Generation */}
      {paperId === 'xrm-2026' && (
        <svg viewBox="0 0 240 112" className="relative z-10 h-full w-full" fill="none">
          {/* Dynamic spatial branches radiating from central ideation core */}
          {[
            { x2: 52, y2: 30, color: '#FFA3BC', delay: 0 },
            { x2: 186, y2: 28, color: '#9BD7FF', delay: 0.35 },
            { x2: 46, y2: 84, color: '#FFE09E', delay: 0.7 },
            { x2: 192, y2: 82, color: '#99E6C4', delay: 1.05 },
          ].map((branch, idx) => (
            <g key={idx}>
              <motion.path
                d={`M120 56 Q${(120 + branch.x2) / 2} 56 ${branch.x2} ${branch.y2}`}
                stroke={branch.color}
                strokeOpacity="0.65"
                strokeWidth="1.3"
                strokeDasharray="5 4"
                animate={paused ? { strokeDashoffset: 0 } : { strokeDashoffset: [-27, 0] }}
                transition={{ duration: 2.8, delay: branch.delay, repeat: Infinity, ease: 'linear' }}
              />
              {/* Floating generated spatial node */}
              <motion.g
                animate={paused ? { y: 0 } : { y: [-2.5, 2.5, -2.5] }}
                transition={{ duration: 3.4, delay: branch.delay, repeat: Infinity, ease: 'easeInOut' }}
              >
                <rect
                  x={branch.x2 - 14}
                  y={branch.y2 - 9}
                  width="28"
                  height="18"
                  rx="5"
                  fill="rgba(13, 21, 42, 0.9)"
                  stroke={branch.color}
                  strokeWidth="1.2"
                />
                <line
                  x1={branch.x2 - 7}
                  y1={branch.y2 - 2}
                  x2={branch.x2 + 7}
                  y2={branch.y2 - 2}
                  stroke={branch.color}
                  strokeOpacity="0.85"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
                <line
                  x1={branch.x2 - 7}
                  y1={branch.y2 + 3}
                  x2={branch.x2 + 3}
                  y2={branch.y2 + 3}
                  stroke="rgba(255,255,255,0.55)"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                />
              </motion.g>
            </g>
          ))}
          {/* Central MR ideation core */}
          <motion.circle
            cx="120"
            cy="56"
            r="14"
            fill="rgba(244, 114, 146, 0.22)"
            stroke="#FFB5C8"
            strokeWidth="1.4"
            style={{ originX: '120px', originY: '56px' }}
            animate={paused ? { scale: 1 } : { scale: [0.94, 1.08, 0.94] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <circle cx="120" cy="56" r="4.5" fill="#FFF0F5" />
        </svg>
      )}

      {/* 5. VR Summit 2026: MedCareSnap — Live Spatial AR Cardiac Response Demo */}
      {paperId === 'vr-summit-2026' && (
        <svg viewBox="0 0 240 112" className="relative z-10 h-full w-full" fill="none">
          {/* Live ECG cardiac waveform trace */}
          <motion.path
            d="M16 62 H56 L66 42 L74 78 L84 30 L92 68 L100 62 H142"
            stroke="#FF8EA8"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="160"
            animate={paused ? { strokeDashoffset: 0 } : { strokeDashoffset: [160, 0] }}
            transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Hands-free CPR rhythm pacing rings */}
          <motion.circle
            cx="182"
            cy="56"
            r="16"
            stroke="rgba(122, 231, 188, 0.85)"
            strokeWidth="1.4"
            style={{ originX: '182px', originY: '56px' }}
            animate={paused ? { scale: 1, opacity: 0.7 } : { scale: [0.85, 1.45], opacity: [0.9, 0] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: 'easeOut' }}
          />
          <circle
            cx="182"
            cy="56"
            r="15"
            fill="rgba(13, 21, 42, 0.82)"
            stroke="#7AE7BC"
            strokeWidth="1.3"
          />
          <text
            x="182"
            y="59"
            textAnchor="middle"
            fill="#E8FFF5"
            fontSize="8.5"
            fontFamily="monospace"
            fontWeight="700"
          >
            AED
          </text>
          {/* Directional spatial guidance chevron */}
          <motion.path
            d="M148 50 L156 56 L148 62"
            stroke="#9BD7FF"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={paused ? { x: 0 } : { x: [-2, 4, -2], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </svg>
      )}
    </div>
  );
};
