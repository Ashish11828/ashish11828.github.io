import React, { useEffect, useRef } from 'react';

interface SakuraVideoCanvasProps {
  paused: boolean;
  darkMode: boolean;
  /** 'viewport' covers the full screen with cursor-following wind wake; 'player' runs inside the Hero video frame */
  variant?: 'viewport' | 'player';
  className?: string;
}

interface Petal {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  depth: number; // 0 = far, 1 = mid, 2 = foreground bokeh
  angle: number;
  spin: number;
  tilt: number;
  tiltSpeed: number;
  swayPhase: number;
  swayAmp: number;
  alpha: number;
  paletteIndex: number;
  isWake?: boolean;
  life?: number;
  maxLife?: number;
}

interface LightMote {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  phase: number;
  speed: number;
}

const DAY_PALETTE: [string, string][] = [
  ['#FFF2F6', '#ED8FAC'],
  ['#FFF7FA', '#E5799D'],
  ['#FFE6EF', '#D9648C'],
  ['#FFF9FB', '#F3A8C1'],
];

const NIGHT_PALETTE: [string, string][] = [
  ['#FFE8F2', '#EE86AA'],
  ['#FFD9E9', '#DE6E98'],
  ['#FFF0F6', '#F49EBC'],
  ['#FFD1E3', '#CF5D89'],
];

function drawSakuraPetal(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  angle: number,
  tilt: number,
  alpha: number,
  colors: [string, string],
  isForeground: boolean
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  const scaleY = 0.4 + Math.abs(Math.cos(tilt)) * 0.6;
  ctx.scale(1, scaleY);
  ctx.globalAlpha = isForeground ? alpha * 0.75 : alpha;

  const grad = ctx.createLinearGradient(0, -size, 0, size);
  grad.addColorStop(0, colors[0]);
  grad.addColorStop(1, colors[1]);
  ctx.fillStyle = grad;

  // Classic notched sakura blossom petal curve (fast GPU path, no expensive shadowBlur)
  ctx.beginPath();
  ctx.moveTo(0, size * 0.95);
  ctx.bezierCurveTo(
    size * 0.88,
    size * 0.52,
    size * 0.96,
    -size * 0.45,
    size * 0.28,
    -size * 0.95
  );
  ctx.lineTo(0, -size * 0.6);
  ctx.lineTo(-size * 0.28, -size * 0.95);
  ctx.bezierCurveTo(
    -size * 0.96,
    -size * 0.45,
    -size * 0.88,
    size * 0.52,
    0,
    size * 0.95
  );
  ctx.closePath();
  ctx.fill();

  if (size >= 7.5) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.34)';
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(0, size * 0.6);
    ctx.lineTo(0, -size * 0.4);
    ctx.stroke();
  }

  ctx.restore();
}

function drawLightMote(
  ctx: CanvasRenderingContext2D,
  mote: LightMote,
  darkMode: boolean
) {
  const pulse = 0.2 + (Math.sin(mote.phase) * 0.5 + 0.5) * 0.42;
  const r = mote.radius * (darkMode ? 2.6 : 2.2);
  ctx.save();
  ctx.globalAlpha = pulse;
  ctx.fillStyle = darkMode ? '#FFDCE8' : '#FFF1D6';
  ctx.beginPath();
  ctx.arc(mote.x, mote.y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function createPetal(width: number, height: number, scatterY: boolean): Petal {
  const r = Math.random();
  const depth = r < 0.32 ? 0 : r < 0.84 ? 1 : 2;
  const size =
    depth === 0
      ? 4.5 + Math.random() * 2.8
      : depth === 1
        ? 7.5 + Math.random() * 4.4
        : 12 + Math.random() * 5.2;

  return {
    x: Math.random() * (width + 180) - 90,
    y: scatterY ? Math.random() * height : -size * 2 - Math.random() * 60,
    vx: (depth === 0 ? 0.35 : depth === 1 ? 0.72 : 1.15) + Math.random() * 0.42,
    vy: (depth === 0 ? 0.55 : depth === 1 ? 1.0 : 1.5) + Math.random() * 0.5,
    size,
    depth,
    angle: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.026,
    tilt: Math.random() * Math.PI * 2,
    tiltSpeed: 0.018 + Math.random() * 0.028,
    swayPhase: Math.random() * Math.PI * 2,
    swayAmp: 0.46 + Math.random() * 0.82,
    alpha:
      depth === 0
        ? 0.44 + Math.random() * 0.2
        : depth === 1
          ? 0.7 + Math.random() * 0.22
          : 0.5 + Math.random() * 0.22,
    paletteIndex: Math.floor(Math.random() * DAY_PALETTE.length),
  };
}

function createMote(width: number, height: number): LightMote {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.35) * 0.2,
    vy: -0.14 - Math.random() * 0.2,
    radius: 1.1 + Math.random() * 1.4,
    phase: Math.random() * Math.PI * 2,
    speed: 0.016 + Math.random() * 0.022,
  };
}

export const SakuraVideoCanvas: React.FC<SakuraVideoCanvasProps> = ({
  paused,
  darkMode,
  variant = 'viewport',
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pausedRef = useRef(paused);
  const darkRef = useRef(darkMode);
  const resumeRef = useRef<(() => void) | null>(null);

  pausedRef.current = paused;
  darkRef.current = darkMode;

  // Immediately wake RAF loop when unpaused or theme toggled
  useEffect(() => {
    resumeRef.current?.();
  }, [paused, darkMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const resize = () => {
      const rect =
        variant === 'viewport'
          ? { width: window.innerWidth, height: window.innerHeight }
          : canvas.parentElement?.getBoundingClientRect() ?? {
              width: 640,
              height: 420,
            };
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    const baseCount =
      variant === 'player'
        ? 22
        : width < 768
          ? 20
          : 34;

    const moteCount = variant === 'player' ? 8 : width < 768 ? 7 : 12;

    const petals: Petal[] = Array.from({ length: baseCount }, () =>
      createPetal(width, height, true)
    );
    const motes: LightMote[] = Array.from({ length: moteCount }, () =>
      createMote(width, height)
    );

    const pointer = {
      x: -9999,
      y: -9999,
      vx: 0,
      vy: 0,
      active: false,
      lastSpawn: 0,
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (pausedRef.current) return;
      const rect =
        variant === 'viewport'
          ? { left: 0, top: 0 }
          : canvas.getBoundingClientRect();
      const nx = e.clientX - rect.left;
      const ny = e.clientY - rect.top;

      if (nx < -24 || ny < -24 || nx > width + 24 || ny > height + 24) {
        pointer.active = false;
        return;
      }

      if (pointer.active) {
        pointer.vx = Math.max(-20, Math.min(20, nx - pointer.x));
        pointer.vy = Math.max(-20, Math.min(20, ny - pointer.y));
      }
      pointer.x = nx;
      pointer.y = ny;
      pointer.active = true;

      const now = performance.now();
      const speed = Math.hypot(pointer.vx, pointer.vy);
      if (speed > 4 && now - pointer.lastSpawn > 105 && petals.length < baseCount + 18) {
        pointer.lastSpawn = now;
        const p = createPetal(width, height, false);
        p.x = nx + (Math.random() - 0.5) * 18;
        p.y = ny + (Math.random() - 0.5) * 18;
        p.vx = pointer.vx * 0.16 + (Math.random() - 0.3) * 0.85;
        p.vy = pointer.vy * 0.14 + 0.52 + Math.random() * 0.55;
        p.size = 6.5 + Math.random() * 4.2;
        p.depth = 1;
        p.alpha = 0.86;
        p.isWake = true;
        p.life = 0;
        p.maxLife = 135 + Math.random() * 70;
        petals.push(p);
      }
    };

    const handlePointerLeave = () => {
      pointer.active = false;
      pointer.vx = 0;
      pointer.vy = 0;
    };

    let rafId = 0;
    let tick = 0;

    const drawStaticFrame = () => {
      ctx.clearRect(0, 0, width, height);
      const isDark = darkRef.current;
      const palette = isDark ? NIGHT_PALETTE : DAY_PALETTE;
      for (let i = 0; i < motes.length; i++) {
        drawLightMote(ctx, motes[i], isDark);
      }
      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        let drawAlpha = p.alpha;
        if (p.isWake && p.life !== undefined && p.maxLife !== undefined) {
          drawAlpha = p.alpha * (1 - p.life / p.maxLife);
        }
        drawSakuraPetal(
          ctx,
          p.x,
          p.y,
          p.size,
          p.angle,
          p.tilt,
          drawAlpha,
          palette[p.paletteIndex],
          p.depth === 2
        );
      }
    };

    const renderFrame = () => {
      rafId = 0;
      if (document.hidden) return;

      const isPaused = pausedRef.current;
      if (isPaused) {
        drawStaticFrame();
        return;
      }

      ctx.clearRect(0, 0, width, height);
      const isDark = darkRef.current;
      const palette = isDark ? NIGHT_PALETTE : DAY_PALETTE;

      tick += 0.016;
      pointer.vx *= 0.91;
      pointer.vy *= 0.91;

      for (let i = 0; i < motes.length; i++) {
        const m = motes[i];
        m.phase += m.speed;
        m.x += m.vx + Math.sin(m.phase * 0.7) * 0.14;
        m.y += m.vy;
        if (m.y < -10) {
          m.y = height + 10;
          m.x = Math.random() * width;
        }
        if (m.x > width + 10) m.x = -10;
        if (m.x < -10) m.x = width + 10;
        drawLightMote(ctx, m, isDark);
      }

      const gust = Math.sin(tick * 0.55) * 0.45 + Math.cos(tick * 0.23) * 0.28;

      for (let i = petals.length - 1; i >= 0; i--) {
        const p = petals[i];
        p.swayPhase += 0.022;
        p.tilt += p.tiltSpeed;
        p.angle += p.spin + Math.sin(p.swayPhase) * 0.008;

        if (pointer.active) {
          const dx = pointer.x - p.x;
          const dy = pointer.y - p.y;
          const distSq = dx * dx + dy * dy;
          const radius = variant === 'player' ? 150 : 215;
          if (distSq < radius * radius && distSq > 9) {
            const dist = Math.sqrt(distSq);
            const pull = (1 - dist / radius) * 0.06;
            p.vx += (dx / dist) * pull + pointer.vx * pull * 0.3;
            p.vy += (dy / dist) * pull * 0.54 + pointer.vy * pull * 0.22;
          }
        }

        const targetVx = (p.depth === 0 ? 0.35 : p.depth === 1 ? 0.72 : 1.15) + gust;
        const targetVy = p.depth === 0 ? 0.58 : p.depth === 1 ? 1.05 : 1.5;
        p.vx += (targetVx - p.vx) * 0.02;
        p.vy += (targetVy - p.vy) * 0.02;

        p.x += p.vx + Math.sin(p.swayPhase) * p.swayAmp;
        p.y += p.vy;

        if (p.isWake && p.life !== undefined && p.maxLife !== undefined) {
          p.life += 1;
          if (p.life >= p.maxLife) {
            petals.splice(i, 1);
            continue;
          }
        } else {
          if (p.y > height + 30) {
            p.y = -24;
            p.x = Math.random() * (width + 160) - 80;
          }
          if (p.x > width + 50) {
            p.x = -30;
          } else if (p.x < -60) {
            p.x = width + 30;
          }
        }

        let drawAlpha = p.alpha;
        if (p.isWake && p.life !== undefined && p.maxLife !== undefined) {
          drawAlpha = p.alpha * (1 - p.life / p.maxLife);
        }

        drawSakuraPetal(
          ctx,
          p.x,
          p.y,
          p.size,
          p.angle,
          p.tilt,
          drawAlpha,
          palette[p.paletteIndex],
          p.depth === 2
        );
      }

      rafId = window.requestAnimationFrame(renderFrame);
    };

    const startLoop = () => {
      if (!rafId && !document.hidden) {
        rafId = window.requestAnimationFrame(renderFrame);
      }
    };

    resumeRef.current = startLoop;

    const handleVisibilityChange = () => {
      if (document.hidden && rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      } else if (!document.hidden) {
        startLoop();
      }
    };

    const handleResize = () => {
      resize();
      if (pausedRef.current) drawStaticFrame();
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    startLoop();

    return () => {
      resumeRef.current = null;
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none block h-full w-full no-print ${className}`}
    />
  );
};
