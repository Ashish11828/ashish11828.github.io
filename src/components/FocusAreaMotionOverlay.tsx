import React from 'react';
import { motion } from 'motion/react';
import type { DomainSymbolKey } from './OrgSymbol';

interface FocusAreaMotionOverlayProps {
  focusKey: DomainSymbolKey;
  paused: boolean;
}

/**
 * Domain-authentic animated SVG motion overlay synchronized to the active Focus Area scene.
 * Uses compositor-friendly transforms & opacity and freezes cleanly when paused.
 */
export const FocusAreaMotionOverlay: React.FC<FocusAreaMotionOverlayProps> = ({
  focusKey,
  paused,
}) => {
  const easeLinear = 'linear' as const;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[4] overflow-hidden opacity-85"
    >
      {focusKey === 'xr' && (
        <svg viewBox="0 0 640 420" className="h-full w-full" fill="none">
          {/* Rotating outer spatial calibration ring */}
          <motion.g
            style={{ originX: '320px', originY: '165px' }}
            animate={paused ? { rotate: 0 } : { rotate: 360 }}
            transition={{ duration: 28, repeat: Infinity, ease: easeLinear }}
          >
            <circle
              cx="320"
              cy="165"
              r="96"
              stroke="rgba(255, 200, 218, 0.36)"
              strokeWidth="1.2"
              strokeDasharray="10 8"
            />
            <circle
              cx="320"
              cy="165"
              r="72"
              stroke="rgba(165, 226, 255, 0.42)"
              strokeWidth="1"
              strokeDasharray="3 9"
            />
          </motion.g>
          {/* Counter-rotating inner optics arcs */}
          <motion.g
            style={{ originX: '320px', originY: '165px' }}
            animate={paused ? { rotate: 0 } : { rotate: -360 }}
            transition={{ duration: 18, repeat: Infinity, ease: easeLinear }}
          >
            <path
              d="M275 165a45 45 0 0 1 90 0"
              stroke="rgba(255, 255, 255, 0.55)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M365 165a45 45 0 0 1-90 0"
              stroke="rgba(244, 114, 146, 0.65)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </motion.g>
          {/* Subtle HUD focus brackets */}
          <motion.g
            animate={paused ? { scale: 1, opacity: 0.6 } : { scale: [0.97, 1.03, 0.97], opacity: [0.45, 0.8, 0.45] }}
            style={{ originX: '320px', originY: '165px' }}
            transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
            stroke="rgba(255,255,255,0.65)"
            strokeWidth="1.4"
            strokeLinecap="round"
          >
            <path d="M235 120h16M235 120v16" />
            <path d="M405 120h-16M405 120v16" />
            <path d="M235 210h16M235 210v-16" />
            <path d="M405 210h-16M405 210v-16" />
          </motion.g>
        </svg>
      )}

      {focusKey === 'ai' && (
        <svg viewBox="0 0 640 420" className="h-full w-full" fill="none">
          {/* Flowing neural-agent pathways */}
          <motion.path
            d="M110 140 Q215 90 315 145 T520 120"
            stroke="rgba(255, 198, 218, 0.52)"
            strokeWidth="1.4"
            strokeDasharray="8 8"
            animate={paused ? { strokeDashoffset: 0 } : { strokeDashoffset: [-64, 0] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: easeLinear }}
          />
          <motion.path
            d="M140 200 Q260 155 370 190 T540 165"
            stroke="rgba(255, 224, 168, 0.48)"
            strokeWidth="1.2"
            strokeDasharray="6 10"
            animate={paused ? { strokeDashoffset: 0 } : { strokeDashoffset: [64, 0] }}
            transition={{ duration: 4.1, repeat: Infinity, ease: easeLinear }}
          />
          {[
            { cx: 170, cy: 118, delay: 0 },
            { cx: 315, cy: 145, delay: 0.4 },
            { cx: 455, cy: 132, delay: 0.8 },
            { cx: 255, cy: 176, delay: 1.1 },
            { cx: 385, cy: 185, delay: 1.5 },
          ].map((node, i) => (
            <motion.g
              key={i}
              animate={paused ? { opacity: 0.7 } : { opacity: [0.35, 0.95, 0.35], scale: [0.9, 1.25, 0.9] }}
              style={{ originX: `${node.cx}px`, originY: `${node.cy}px` }}
              transition={{ duration: 3.2, delay: node.delay, repeat: Infinity, ease: 'easeInOut' }}
            >
              <circle cx={node.cx} cy={node.cy} r="9" stroke="rgba(255, 195, 215, 0.5)" strokeWidth="1" />
              <circle cx={node.cx} cy={node.cy} r="3" fill="rgba(255, 240, 225, 0.92)" />
            </motion.g>
          ))}
        </svg>
      )}

      {focusKey === 'ml' && (
        <svg viewBox="0 0 640 420" className="h-full w-full" fill="none">
          {/* Animated gradient-descent wave trace */}
          <motion.path
            d="M80 215 C165 110, 235 235, 325 148 C410 72, 470 185, 565 112"
            stroke="rgba(165, 226, 255, 0.65)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeDasharray="12 6"
            animate={paused ? { strokeDashoffset: 0 } : { strokeDashoffset: [-72, 0] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: easeLinear }}
          />
          <motion.path
            d="M80 225 C175 165, 260 205, 355 158 C445 114, 505 165, 565 135"
            stroke="rgba(255, 212, 152, 0.55)"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeDasharray="6 8"
            animate={paused ? { strokeDashoffset: 0 } : { strokeDashoffset: [56, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: easeLinear }}
          />
          {/* Subtle vertical computer-vision scan line */}
          <motion.line
            x1="0"
            y1="45"
            x2="0"
            y2="245"
            stroke="rgba(165, 226, 255, 0.32)"
            strokeWidth="1.2"
            animate={paused ? { x: 320 } : { x: [120, 520, 120] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </svg>
      )}

      {focusKey === 'quantum' && (
        <svg viewBox="0 0 640 420" className="h-full w-full" fill="none">
          {/* Concentric tilted Bloch-sphere quantum orbital rings */}
          <motion.g
            style={{ originX: '320px', originY: '155px' }}
            animate={paused ? { rotate: 0 } : { rotate: 360 }}
            transition={{ duration: 22, repeat: Infinity, ease: easeLinear }}
          >
            <ellipse
              cx="320"
              cy="155"
              rx="108"
              ry="40"
              stroke="rgba(255, 218, 156, 0.55)"
              strokeWidth="1.3"
            />
            <circle cx="428" cy="155" r="3.6" fill="#FFE6B8" />
          </motion.g>
          <motion.g
            style={{ originX: '320px', originY: '155px' }}
            animate={paused ? { rotate: 60 } : { rotate: [60, 420] }}
            transition={{ duration: 17, repeat: Infinity, ease: easeLinear }}
          >
            <ellipse
              cx="320"
              cy="155"
              rx="108"
              ry="40"
              stroke="rgba(166, 214, 255, 0.52)"
              strokeWidth="1.2"
            />
            <circle cx="212" cy="155" r="3.2" fill="#C4E6FF" />
          </motion.g>
          <motion.g
            style={{ originX: '320px', originY: '155px' }}
            animate={paused ? { rotate: -60 } : { rotate: [-60, -420] }}
            transition={{ duration: 26, repeat: Infinity, ease: easeLinear }}
          >
            <ellipse
              cx="320"
              cy="155"
              rx="108"
              ry="40"
              stroke="rgba(255, 182, 206, 0.48)"
              strokeWidth="1.2"
              strokeDasharray="6 6"
            />
            <circle cx="320" cy="115" r="3.2" fill="#FFD1E1" />
          </motion.g>
        </svg>
      )}

      {focusKey === 'robotics' && (
        <svg viewBox="0 0 640 420" className="h-full w-full" fill="none">
          {/* Articulated kinematic sweep arc & LiDAR pulses */}
          <motion.g
            style={{ originX: '290px', originY: '170px' }}
            animate={paused ? { rotate: 0 } : { rotate: [-14, 18, -14] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <path
              d="M210 170 A80 80 0 0 1 370 170"
              stroke="rgba(165, 226, 255, 0.58)"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <path
              d="M235 170 A55 55 0 0 1 345 170"
              stroke="rgba(255, 210, 148, 0.62)"
              strokeWidth="1.4"
              strokeDasharray="5 5"
            />
          </motion.g>
          {[0, 1.3].map((delay, i) => (
            <motion.circle
              key={i}
              cx="290"
              cy="170"
              r="34"
              stroke="rgba(255, 205, 220, 0.55)"
              strokeWidth="1.2"
              style={{ originX: '290px', originY: '170px' }}
              animate={paused ? { scale: 1, opacity: 0.4 } : { scale: [0.6, 2.3], opacity: [0.7, 0] }}
              transition={{ duration: 3.4, delay, repeat: Infinity, ease: 'easeOut' }}
            />
          ))}
        </svg>
      )}

      {focusKey === 'space' && (
        <svg viewBox="0 0 640 420" className="h-full w-full" fill="none">
          {/* Space analog orbital arc & satellite telemetry sweep */}
          <ellipse
            cx="330"
            cy="165"
            rx="145"
            ry="52"
            transform="rotate(-14 330 165)"
            stroke="rgba(176, 232, 255, 0.42)"
            strokeWidth="1.2"
            strokeDasharray="6 7"
          />
          <motion.g
            style={{ originX: '330px', originY: '165px' }}
            animate={paused ? { rotate: 0 } : { rotate: 360 }}
            transition={{ duration: 24, repeat: Infinity, ease: easeLinear }}
          >
            <circle cx="472" cy="148" r="4" fill="#FFE6B8" />
            <circle cx="472" cy="148" r="10" stroke="rgba(255, 230, 184, 0.45)" strokeWidth="1" />
          </motion.g>
          <motion.circle
            cx="330"
            cy="165"
            r="68"
            stroke="rgba(255, 186, 210, 0.32)"
            strokeWidth="1"
            strokeDasharray="3 8"
            style={{ originX: '330px', originY: '165px' }}
            animate={paused ? { rotate: 0 } : { rotate: -360 }}
            transition={{ duration: 32, repeat: Infinity, ease: easeLinear }}
          />
        </svg>
      )}
    </div>
  );
};
