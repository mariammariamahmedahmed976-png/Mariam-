import React, { useState, useRef } from 'react';
import {
  Heart,
  Sparkles,
  Volume2,
  VolumeX,
  Zap,
  Code2,
  Terminal,
  Gift,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ThreeParticleHeart } from './ThreeParticleHeart';

interface HeartExperienceSectionProps {
  onReopenSurpriseIntro?: () => void;
}

export const HeartExperienceSection: React.FC<HeartExperienceSectionProps> = ({
  onReopenSurpriseIntro,
}) => {
  const [isBursting, setIsBursting] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const soundtrackPath = '/assets/aistudio/heart_tribute_soundtrack.mp3';

  const toggleSoundtrack = () => {
    if (!audioRef.current) return;
    if (isPlayingMusic) {
      audioRef.current.pause();
      setIsPlayingMusic(false);
    } else {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(console.warn);
      setIsPlayingMusic(true);
    }
  };

  const triggerShockwave = () => {
    setIsBursting(true);
    if (!isPlayingMusic && audioRef.current) {
      audioRef.current.play().catch(console.warn);
      setIsPlayingMusic(true);
    }
    confetti({
      particleCount: 70,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#00f0ff', '#38bdf8', '#2563eb', '#ffffff'],
    });
    setTimeout(() => {
      setIsBursting(false);
    }, 1200);
  };

  return (
    <section id="heart-experience" className="scroll-mt-24 space-y-6">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={soundtrackPath}
        loop
        onEnded={() => setIsPlayingMusic(false)}
      />

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-left">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 tracking-widest uppercase">
            <Heart className="w-4 h-4 fill-cyan-400/20 text-cyan-400" />
            <span>Exact Recreation · 3D Digital Energy</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight mt-1">
            The Glowing Blue Particle Heart
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl font-light">
            Formed from thousands of luminous electric-blue and cyan particles floating above a swirling energy platform. Move your cursor or touch to rotate in 3D space.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowCode(!showCode)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-blue-900/60 text-sky-300 hover:bg-slate-800 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Code2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>{showCode ? 'Hide Code' : 'Show Code'}</span>
          </button>

          <button
            onClick={toggleSoundtrack}
            className={`px-4 py-2 rounded-xl border text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95 ${
              isPlayingMusic
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 glow-blue'
                : 'bg-slate-900 border-blue-900/60 text-slate-300 hover:text-white'
            }`}
          >
            {isPlayingMusic ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Soundtrack Playing</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                <span>Play Soundtrack</span>
              </>
            )}
          </button>

          {onReopenSurpriseIntro && (
            <button
              onClick={onReopenSurpriseIntro}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-xs transition-all flex items-center gap-2 cursor-pointer glow-blue hover:scale-105 active:scale-95"
            >
              <Gift className="w-3.5 h-3.5 text-cyan-200" />
              <span>Full Screen Surprise</span>
            </button>
          )}
        </div>
      </div>

      {/* The 3D Canvas Viewport */}
      <div className="relative w-full rounded-3xl bg-black border border-cyan-500/40 overflow-hidden shadow-2xl glow-blue-lg flex flex-col items-center justify-between p-4 sm:p-6">
        {/* Top Floating Badge */}
        <div className="relative z-10 w-full flex items-center justify-between text-xs text-slate-400 pointer-events-none mb-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/80 border border-cyan-500/30 text-cyan-300 font-mono text-[11px] backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Interactive 3D Particles · Dual Pulse Rhythm</span>
          </div>

          <div className="hidden sm:inline-flex items-center gap-1.5 text-slate-400 text-[11px]">
            <span>Drag / move cursor to inspect in 3D</span>
          </div>
        </div>

        {/* Three.js Particle Heart Viewport */}
        <div className="relative w-full h-[400px] sm:h-[480px]">
          <div className="absolute inset-0">
            <ThreeParticleHeart isBursting={isBursting} />
          </div>
        </div>

        {/* The Exact Capsule Surprise Button from Video */}
        <div className="relative z-20 w-full max-w-lg mt-4 flex flex-col items-center">
          <div className="absolute -inset-1.5 bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 rounded-full blur-xl opacity-75 animate-pulse" />

          <button
            onClick={triggerShockwave}
            className="group relative w-full flex items-center justify-between p-1.5 sm:p-2 rounded-full bg-black/90 border-2 border-cyan-400/80 hover:border-cyan-300 text-white shadow-[0_0_25px_rgba(0,240,255,0.45)] hover:shadow-[0_0_40px_rgba(0,240,255,0.7)] transition-all duration-300 hover:scale-[1.03] active:scale-95 cursor-pointer backdrop-blur-xl"
          >
            {/* Left Glowing Heart */}
            <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-gradient-to-tr from-blue-950 via-slate-900 to-cyan-950 border border-cyan-400/60 flex items-center justify-center shrink-0 shadow-inner group-hover:rotate-12 transition-transform">
              <Heart className="w-5 h-5 fill-cyan-400 text-cyan-300 animate-pulse drop-shadow-[0_0_8px_#00f0ff]" />
            </div>

            {/* Center Text */}
            <div className="flex-1 px-3 text-center">
              <div className="flex items-center justify-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-300 animate-spin" />
                <span className="text-base sm:text-lg font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-sky-300 uppercase">
                  Press for Particle Shockwave
                </span>
                <Sparkles className="w-4 h-4 text-cyan-300" />
              </div>
              <div className="text-[11px] text-cyan-300 font-semibold mt-0.5">
                Mentor's Surprise · Click to interact with the heart 🎁
              </div>
            </div>

            {/* Right Glowing Heart */}
            <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 border border-cyan-300/80 flex items-center justify-center shrink-0 shadow-lg group-hover:-rotate-12 transition-transform">
              <Heart className="w-5 h-5 fill-white text-white drop-shadow-[0_0_8px_#ffffff]" />
            </div>
          </button>

          {/* Watermark badge */}
          <div className="mt-2.5 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-950/80 border border-blue-900/70 text-[11px] text-slate-300 backdrop-blur-md">
            <span className="text-cyan-400 font-mono">@eng.mohamed_anwar</span>
            <span className="text-slate-600">|</span>
            <span>
              By{' '}
              <span className="text-cyan-300 font-semibold inline-block hover:animate-bounce cursor-pointer">
                Eng.Mariam Bahei El Din 👩🏻‍💻❤️
              </span>
            </span>
          </div>
        </div>

        {/* Video Code Window (Toggleable) */}
        {showCode && (
          <div className="relative z-10 mt-6 w-full max-w-lg rounded-2xl bg-black/90 border border-cyan-500/30 p-3.5 backdrop-blur-md shadow-2xl text-left text-[11px] font-mono glow-blue">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                <span className="text-slate-500 text-[10px] ml-2 font-sans">
                  heart-source-code.ts
                </span>
              </div>
              <span className="text-[10px] text-cyan-400">WebGL · Three.js Shader</span>
            </div>

            <div className="space-y-0.5 text-slate-300">
              <p className="text-slate-500">
                <span className="text-slate-600 select-none mr-2">1</span>
                // Exact 3D volumetric math from reference video
              </p>
              <p>
                <span className="text-slate-600 select-none mr-2">2</span>
                <span className="text-purple-400">const</span>{' '}
                <span className="text-cyan-300">target</span> ={' '}
                <span className="text-amber-300">"Eng. Mohamed Anwar"</span>;
              </p>
              <p>
                <span className="text-slate-600 select-none mr-2">3</span>
                <span className="text-purple-400">const</span>{' '}
                <span className="text-cyan-300">author</span> ={' '}
                <span className="text-amber-300">"Eng.Mariam Bahei El Din 👩🏻‍💻❤️"</span>;
              </p>
              <p>
                <span className="text-slate-600 select-none mr-2">4</span>
                <span className="text-purple-400">function</span>{' '}
                <span className="text-yellow-300">renderHeartParticles</span>() {'{'}
              </p>
              <p className="pl-4">
                <span className="text-slate-600 select-none mr-2">5</span>
                <span className="text-cyan-300">x</span> = 16 * Math.sin(t)**3;
              </p>
              <p className="pl-4">
                <span className="text-slate-600 select-none mr-2">6</span>
                <span className="text-cyan-300">y</span> = 13*cos(t) - 5*cos(2t) - 2*cos(3t);
              </p>
              <p>
                <span className="text-slate-600 select-none mr-2">7</span>
                {'}'}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
