import React, { useEffect, useRef } from 'react';

interface ParticleHeartCanvasProps {
  isHeartForming?: boolean;
  isBursting?: boolean;
  onHeartFormed?: () => void;
  className?: string;
}

interface FloatParticle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  baseAlpha: number;
  alpha: number;
  color: string;
  glowColor: string;
  sparkleSpeed: number;
  sparkleOffset: number;
  life: number;
  maxLife: number;
}

interface BurstParticle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  controlX: number;
  controlY: number;
  progress: number;
  speed: number;
  color: string;
  size: number;
  trail: { x: number; y: number }[];
}

export const ParticleHeartCanvas: React.FC<ParticleHeartCanvasProps> = ({
  isHeartForming = true,
  isBursting = false,
  onHeartFormed,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const heartBeatTimeRef = useRef(0);
  const floatParticlesRef = useRef<FloatParticle[]>([]);
  const burstParticlesRef = useRef<BurstParticle[]>([]);
  const isBurstingRef = useRef(isBursting);
  const lastBurstTimeRef = useRef(0);

  useEffect(() => {
    isBurstingRef.current = isBursting;
  }, [isBursting]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
      initHeartParticles();
    };

    window.addEventListener('resize', handleResize);

    // Exact BLUE_SHADES from the video
    const BLUE_SHADES = [
      '#38bdf8', // blue-400
      '#60a5fa', // blue-400
      '#93c5fd', // blue-300
      '#2563eb', // blue-600
      '#bfdbfe', // blue-200
      '#1d4ed8', // blue-700
      '#00f0ff', // electric cyan
    ];

    const initHeartParticles = () => {
      const centerX = width / 2;
      // Center heart slightly higher so the glowing pedestal sits nicely underneath
      const centerY = height / 2 - 45;
      const scale = Math.min(width, height) / 36;
      const count = Math.min(Math.floor((width * height) / 2200), 450);

      const particles: FloatParticle[] = [];

      for (let i = 0; i < count; i++) {
        const t = Math.PI * 2 * (i / count);
        // Parametric heart formula
        const heartX = 16 * Math.pow(Math.sin(t), 3);
        const heartY = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

        // Add soft stardust volume
        const jitterX = (Math.random() - 0.5) * (Math.random() < 0.3 ? 20 : 8);
        const jitterY = (Math.random() - 0.5) * (Math.random() < 0.3 ? 20 : 8);

        const targetX = centerX + heartX * scale + jitterX;
        const targetY = centerY + heartY * scale + jitterY;

        const color = BLUE_SHADES[i % BLUE_SHADES.length];

        particles.push({
          x: targetX,
          y: targetY,
          originX: targetX,
          originY: targetY,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          size: Math.random() * 2.5 + 1.2,
          baseAlpha: Math.random() * 0.5 + 0.4,
          alpha: Math.random() * 0.5 + 0.4,
          color,
          glowColor: color,
          sparkleSpeed: Math.random() * 0.04 + 0.02,
          sparkleOffset: Math.random() * Math.PI * 2,
          life: Math.random() * 100,
          maxLife: 100 + Math.random() * 50,
        });
      }

      floatParticlesRef.current = particles;
    };

    initHeartParticles();

    // Spawns electric burst rays shooting from the bottom pedestal into the heart
    const spawnHeartBurst = (count = 140) => {
      const centerX = width / 2;
      const pedestalY = height / 2 + 130;
      const floatParticles = floatParticlesRef.current;
      if (floatParticles.length === 0) return;

      const newBursts: BurstParticle[] = [];

      for (let i = 0; i < count; i++) {
        // Pick random target in the heart
        const target = floatParticles[Math.floor(Math.random() * floatParticles.length)];
        const startX = centerX + (Math.random() - 0.5) * 110;
        const startY = pedestalY + (Math.random() - 0.5) * 15;

        // Curving control point for electric arc
        const controlX = (startX + target.originX) / 2 + (Math.random() - 0.5) * 120;
        const controlY = (startY + target.originY) / 2 + (Math.random() - 0.5) * 60;

        newBursts.push({
          x: startX,
          y: startY,
          targetX: target.originX,
          targetY: target.originY,
          controlX,
          controlY,
          progress: 0,
          speed: Math.random() * 0.035 + 0.02,
          color: Math.random() > 0.4 ? '#00f0ff' : '#38bdf8',
          size: Math.random() * 2.8 + 1.2,
          trail: [],
        });
      }

      burstParticlesRef.current.push(...newBursts);
    };

    let lastTime = performance.now();

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2 - 45;
      const pedestalY = centerY + 175;

      // Heartbeat pulse rhythm
      heartBeatTimeRef.current += 0.035;
      const pulse = Math.sin(heartBeatTimeRef.current);
      const heartScale = 1 + (pulse > 0.65 ? 0.035 * pulse : 0);

      // Periodically trigger bursts if isBursting is active or idle ambient bursts
      if (isBurstingRef.current && time - lastBurstTimeRef.current > 400) {
        spawnHeartBurst(70);
        lastBurstTimeRef.current = time;
      } else if (!isBurstingRef.current && time - lastBurstTimeRef.current > 2400) {
        spawnHeartBurst(25); // Gentle ambient burst
        lastBurstTimeRef.current = time;
      }

      // --- 1. Draw Glowing Elliptical Pedestal (The electric blue lake / platform from the video) ---
      ctx.save();
      // Outer soft radial ambient glow
      const outerGlow = ctx.createRadialGradient(
        centerX,
        pedestalY,
        10,
        centerX,
        pedestalY,
        140
      );
      outerGlow.addColorStop(0, 'rgba(0, 240, 255, 0.35)');
      outerGlow.addColorStop(0.3, 'rgba(37, 99, 235, 0.25)');
      outerGlow.addColorStop(0.7, 'rgba(29, 78, 216, 0.1)');
      outerGlow.addColorStop(1, 'rgba(3, 7, 18, 0)');
      ctx.fillStyle = outerGlow;
      ctx.beginPath();
      ctx.ellipse(centerX, pedestalY, 140, 32, 0, 0, Math.PI * 2);
      ctx.fill();

      // Middle intense cyan reflection ring
      ctx.beginPath();
      ctx.ellipse(centerX, pedestalY, 95, 18, 0, 0, Math.PI * 2);
      ctx.shadowBlur = 25;
      ctx.shadowColor = '#00f0ff';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.85)';
      ctx.lineWidth = 3.5;
      ctx.stroke();

      // Center bright laser pool
      const innerPool = ctx.createRadialGradient(
        centerX,
        pedestalY,
        0,
        centerX,
        pedestalY,
        75
      );
      innerPool.addColorStop(0, '#ffffff');
      innerPool.addColorStop(0.2, '#00f0ff');
      innerPool.addColorStop(0.7, 'rgba(37, 99, 235, 0.8)');
      innerPool.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = innerPool;
      ctx.beginPath();
      ctx.ellipse(centerX, pedestalY, 75, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // --- 2. Draw Floating Heart Particles ---
      const floatParticles = floatParticlesRef.current;
      for (let i = 0; i < floatParticles.length; i++) {
        const p = floatParticles[i];

        // Apply heartbeat scale
        const targetX = centerX + (p.originX - centerX) * heartScale;
        const targetY = centerY + (p.originY - centerY) * heartScale;

        // Subtle organic float
        p.x += (targetX - p.x) * 0.1;
        p.y += (targetY - p.y) * 0.1;

        // Twinkle
        const sparkle = Math.sin(time * 0.003 * p.sparkleSpeed + p.sparkleOffset);
        p.alpha = Math.max(0.2, p.baseAlpha + sparkle * 0.35);

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.glowColor;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.restore();
      }

      // --- 3. Draw Electric Burst Particles (shooting upward from puddle into heart) ---
      const burstParticles = burstParticlesRef.current;
      for (let i = burstParticles.length - 1; i >= 0; i--) {
        const b = burstParticles[i];
        b.progress += b.speed;

        if (b.progress >= 1) {
          burstParticles.splice(i, 1);
          continue;
        }

        // Quadratic Bezier interpolation for organic arcing energy
        const t = b.progress;
        const invT = 1 - t;
        const curX = invT * invT * b.x + 2 * invT * t * b.controlX + t * t * b.targetX;
        const curY = invT * invT * b.y + 2 * invT * t * b.controlY + t * t * b.targetY;

        b.trail.push({ x: curX, y: curY });
        if (b.trail.length > 5) b.trail.shift();

        // Draw lightning/energy trail
        if (b.trail.length > 1) {
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(b.trail[0].x, b.trail[0].y);
          for (let j = 1; j < b.trail.length; j++) {
            ctx.lineTo(b.trail[j].x, b.trail[j].y);
          }
          ctx.strokeStyle = b.color;
          ctx.lineWidth = b.size;
          ctx.shadowBlur = 14;
          ctx.shadowColor = '#00f0ff';
          ctx.stroke();
          ctx.restore();
        }

        // Draw leading spark head
        ctx.save();
        ctx.beginPath();
        ctx.arc(curX, curY, b.size * 1.3, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 16;
        ctx.shadowColor = '#00f0ff';
        ctx.fill();
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
    />
  );
};
