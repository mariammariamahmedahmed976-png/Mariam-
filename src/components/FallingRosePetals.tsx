import React, { useEffect, useRef, useState, useCallback } from 'react';

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  flip: number;
  flipSpeed: number;
  swayPhase: number;
  swaySpeed: number;
  swayRadius: number;
  opacity: number;
  colorType: 'cyan' | 'electric_blue' | 'bright_white' | 'sapphire';
}

export const FallingRosePetals: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const petalsRef = useRef<Petal[]>([]);
  const animationFrameRef = useRef<number>(0);
  const [isEnabled, setIsEnabled] = useState(true);

  // Initialize petals
  const initPetal = useCallback((w: number, h: number, startAtTop = true): Petal => {
    const colorTypes: Petal['colorType'][] = [
      'cyan',
      'cyan',
      'electric_blue',
      'electric_blue',
      'sapphire',
      'bright_white',
    ];
    const colorType = colorTypes[Math.floor(Math.random() * colorTypes.length)];

    const size = 12 + Math.random() * 16;
    return {
      x: Math.random() * w,
      y: startAtTop ? -30 - Math.random() * 50 : Math.random() * h,
      size,
      speedY: 0.6 + Math.random() * 1.2,
      speedX: (Math.random() - 0.5) * 0.6,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      flip: Math.random() * Math.PI * 2,
      flipSpeed: 0.015 + Math.random() * 0.03,
      swayPhase: Math.random() * Math.PI * 2,
      swaySpeed: 0.01 + Math.random() * 0.02,
      swayRadius: 15 + Math.random() * 25,
      opacity: 0.4 + Math.random() * 0.5,
      colorType,
    };
  }, []);

  // Listen for custom "burst-petals" event triggered when user clicks "Send a Rose"
  useEffect(() => {
    const handlePetalBurst = (e: Event) => {
      const customEvent = e as CustomEvent<{ count?: number }>;
      const burstCount = customEvent.detail?.count || 25;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const w = canvas.width;
      const h = canvas.height;

      for (let i = 0; i < burstCount; i++) {
        const petal = initPetal(w, h, false);
        // Start from center-bottom or mouse position
        petal.x = w * 0.5 + (Math.random() - 0.5) * (w * 0.4);
        petal.y = h * 0.6 + (Math.random() - 0.5) * 100;
        petal.speedY = -(1.5 + Math.random() * 3.0); // burst upward
        petal.speedX = (Math.random() - 0.5) * 4.0;
        petalsRef.current.push(petal);
      }
    };

    window.addEventListener('rose-burst', handlePetalBurst);
    return () => {
      window.removeEventListener('rose-burst', handlePetalBurst);
    };
  }, [initPetal]);

  useEffect(() => {
    if (!isEnabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Initial pool of 36 petals distributed smoothly
    const petalPoolSize = 36;
    petalsRef.current = [];
    for (let i = 0; i < petalPoolSize; i++) {
      petalsRef.current.push(initPetal(width, height, false));
    }

    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      // Simulate 3D tumbling/fluttering
      const scaleX = Math.cos(p.flip);
      ctx.scale(scaleX, 1);

      ctx.beginPath();
      // Draw organic curved rose petal silhouette
      const r = p.size;
      ctx.moveTo(0, -r);
      ctx.bezierCurveTo(r * 0.85, -r * 0.5, r * 0.8, r * 0.5, 0, r);
      ctx.bezierCurveTo(-r * 0.8, r * 0.5, -r * 0.85, -r * 0.5, 0, -r);
      ctx.closePath();

      // Create glowing gradient
      const grad = ctx.createRadialGradient(0, -r * 0.2, 0, 0, 0, r);

      if (p.colorType === 'cyan') {
        grad.addColorStop(0, `rgba(224, 247, 250, ${p.opacity * 0.95})`);
        grad.addColorStop(0.3, `rgba(0, 240, 255, ${p.opacity * 0.8})`);
        grad.addColorStop(0.8, `rgba(6, 182, 212, ${p.opacity * 0.5})`);
        grad.addColorStop(1, `rgba(2, 132, 199, 0)`);
      } else if (p.colorType === 'electric_blue') {
        grad.addColorStop(0, `rgba(186, 230, 253, ${p.opacity * 0.95})`);
        grad.addColorStop(0.4, `rgba(56, 189, 248, ${p.opacity * 0.85})`);
        grad.addColorStop(0.8, `rgba(37, 99, 235, ${p.opacity * 0.5})`);
        grad.addColorStop(1, `rgba(29, 78, 216, 0)`);
      } else if (p.colorType === 'bright_white') {
        grad.addColorStop(0, `rgba(255, 255, 255, ${p.opacity})`);
        grad.addColorStop(0.4, `rgba(207, 250, 254, ${p.opacity * 0.8})`);
        grad.addColorStop(0.9, `rgba(56, 189, 248, ${p.opacity * 0.3})`);
        grad.addColorStop(1, `rgba(0, 0, 0, 0)`);
      } else {
        // Sapphire
        grad.addColorStop(0, `rgba(191, 219, 254, ${p.opacity * 0.9})`);
        grad.addColorStop(0.4, `rgba(96, 165, 250, ${p.opacity * 0.75})`);
        grad.addColorStop(0.8, `rgba(30, 58, 138, ${p.opacity * 0.45})`);
        grad.addColorStop(1, `rgba(15, 23, 42, 0)`);
      }

      ctx.fillStyle = grad;
      ctx.shadowColor = 'rgba(0, 240, 255, 0.4)';
      ctx.shadowBlur = 8;
      ctx.fill();

      // Subtle center vein highlight
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.8);
      ctx.quadraticCurveTo(r * 0.05, 0, 0, r * 0.7);
      ctx.strokeStyle = `rgba(255, 255, 255, ${p.opacity * 0.4})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();

      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const petals = petalsRef.current;
      for (let i = petals.length - 1; i >= 0; i--) {
        const p = petals[i];

        // Update physics
        p.swayPhase += p.swaySpeed;
        p.rotation += p.rotationSpeed;
        p.flip += p.flipSpeed;

        p.y += p.speedY;
        // Natural gentle swaying side to side
        p.x += p.speedX + Math.sin(p.swayPhase) * 0.6;

        // If it was a burst upward petal, slow it down and gravity takes over
        if (p.speedY < 0.6) {
          p.speedY += 0.04; // gravity
        }

        drawPetal(p);

        // Respawn when fallen off screen
        if (p.y > height + 40 || p.x < -60 || p.x > width + 60) {
          if (petals.length > 40) {
            // Remove extra burst petals
            petals.splice(i, 1);
          } else {
            petals[i] = initPetal(width, height, true);
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [isEnabled, initPetal]);

  return (
    <>
      {/* Non-blocking background canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-10 transition-opacity duration-700"
        style={{ opacity: isEnabled ? 1 : 0 }}
      />

      {/* Floating Petals Toggle & Counter Badge (Discrete top-right) */}
      <div className="fixed top-20 right-4 z-30 hidden sm:flex items-center gap-2">
        <button
          onClick={() => {
            const newEvent = new CustomEvent('rose-burst', { detail: { count: 20 } });
            window.dispatchEvent(newEvent);
          }}
          className="group px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-cyan-500/40 text-[11px] font-semibold text-cyan-300 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95 cursor-pointer glow-blue"
          title="Shower blooming rose petals across the screen"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span>Shower Petals 🌸</span>
        </button>

        <button
          onClick={() => setIsEnabled(!isEnabled)}
          className="p-1.5 rounded-full bg-slate-900/70 hover:bg-slate-800 border border-slate-700/60 text-slate-400 hover:text-cyan-300 text-xs backdrop-blur-md transition-all cursor-pointer"
          title={isEnabled ? 'Pause falling rose petals' : 'Resume falling rose petals'}
          aria-label={isEnabled ? 'Pause falling rose petals' : 'Resume falling rose petals'}
        >
          {isEnabled ? '🌹' : '🥀'}
        </button>
      </div>
    </>
  );
};
