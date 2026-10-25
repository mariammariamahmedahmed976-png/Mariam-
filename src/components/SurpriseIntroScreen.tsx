import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Gift,
  Sparkles,
  ArrowDown,
  Heart,
  Volume2,
  VolumeX,
  Award,
  Minimize2,
  Eye,
  Code2,
  Terminal,
  X,
} from 'lucide-react';
import { ThreeParticleHeart } from './ThreeParticleHeart';

interface SurpriseIntroScreenProps {
  onProceedToSite: () => void;
}

export const SurpriseIntroScreen: React.FC<SurpriseIntroScreenProps> = ({
  onProceedToSite,
}) => {
  // Step state:
  // 0 = Initial heart with Capsule Surprise Button + Code Window
  // 1 = Particle shockwave burst + "SURPRISE!"
  // 2 = "Mr. Surprise" (Mentor Tribute: Eng. Mohamed Anwar)
  // 3 = The Special Gift Box (ready to open / opened)
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [isGiftOpened, setIsGiftOpened] = useState(false);
  const [isBursting, setIsBursting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPureViewMode, setIsPureViewMode] = useState(false);
  const [showCodePanel, setShowCodePanel] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const soundtrackPath = '/assets/aistudio/heart_tribute_soundtrack.mp3';
  const portraitPath = '/assets/aistudio/IMG-20261024-WA0006_efcbd352.jpg';

  const handleStartSurprise = () => {
    setIsBursting(true);

    // Play soundtrack extracted from the user's video
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(console.warn);
    }

    // Trigger celebratory starlight confetti
    confetti({
      particleCount: 90,
      spread: 110,
      origin: { y: 0.6 },
      colors: ['#00f0ff', '#38bdf8', '#2563eb', '#ffffff', '#93c5fd'],
    });

    // Step 1: "SURPRISE!"
    setStep(1);

    // Re-gather burst particles smoothly
    setTimeout(() => {
      setIsBursting(false);
    }, 1200);

    // Step 2: "Mr. Surprise" (Mentor Tribute) after 1.6s
    setTimeout(() => {
      setStep(2);
      confetti({
        particleCount: 100,
        spread: 120,
        origin: { y: 0.5 },
        colors: ['#38bdf8', '#60a5fa', '#ffd700', '#ffffff'],
      });
    }, 1600);

    // Step 3: The Gift Box after 3.6s
    setTimeout(() => {
      setStep(3);
    }, 3600);
  };

  const handleOpenGift = () => {
    setIsGiftOpened(true);

    confetti({
      particleCount: 160,
      spread: 140,
      origin: { y: 0.4 },
      colors: ['#00f0ff', '#38bdf8', '#2563eb', '#ffd700', '#ffffff'],
    });
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between overflow-x-hidden overflow-y-auto bg-black px-4 py-4 sm:py-6 text-white select-none">
      {/* Hidden audio element playing the video soundtrack */}
      <audio ref={audioRef} src={soundtrackPath} loop preload="auto" />

      {/* 1. Exact 3D Volumetric Blue Particle Heart & Swirling Energy Platform */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <ThreeParticleHeart isBursting={isBursting} />
      </div>

      {/* Top Header Bar */}
      <header className="relative z-20 w-full max-w-5xl flex items-center justify-between text-xs text-slate-300 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse glow-blue" />
          <span className="font-semibold text-slate-200 uppercase tracking-widest text-[11px]">
            Surprise Tribute · Eng. Mohamed Anwar
          </span>
        </div>

        {/* Action Controls: Code toggle, Audio & Pure View */}
        <div className="flex items-center gap-2">
          {step === 0 && (
            <button
              onClick={() => setShowCodePanel(!showCodePanel)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-sky-300 border border-blue-900/60 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer text-xs"
              title="Toggle code editor view from video"
            >
              <Code2 className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">
                {showCodePanel ? 'Hide Code' : 'Show Code'}
              </span>
            </button>
          )}

          <button
            onClick={() => setIsPureViewMode(!isPureViewMode)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-sky-300 border border-blue-900/60 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer text-xs"
            title={isPureViewMode ? 'Exit pure heart mode' : 'View pure heart animation without UI'}
          >
            {isPureViewMode ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Show UI</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Pure View</span>
              </>
            )}
          </button>

          <button
            onClick={toggleMute}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-sky-300 border border-blue-900/60 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer text-xs"
            title={isMuted ? 'Unmute music' : 'Mute music'}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-red-400" />
                <span>Unmute</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Music</span>
              </>
            )}
          </button>

          <button
            onClick={onProceedToSite}
            className="px-2.5 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 hover:text-white border border-cyan-500/50 transition-all flex items-center gap-1 shadow-sm cursor-pointer text-xs"
            title="Close surprise overlay and view website"
          >
            <X className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Close</span>
          </button>
        </div>
      </header>

      {/* CENTER STAGE: THE HEART & SURPRISE STEPS */}
      {!isPureViewMode && (
        <div className="relative z-10 max-w-2xl w-full flex flex-col items-center text-center my-auto py-2 pointer-events-auto">
          {/* ================= STEP 0: EXACT CAPSULE SURPRISE BUTTON + CODE PANEL ================= */}
          {step === 0 && (
            <div className="w-full flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
              {/* Dedication Header Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-semibold tracking-wider uppercase mb-3 glow-blue">
                <Award className="w-3.5 h-3.5 text-cyan-400" />
                <span>Dedicated to Eng. Mohamed Anwar</span>
              </div>

              {/* Spacer so the 3D heart is gracefully visible above the button */}
              <div className="h-44 sm:h-52 w-full pointer-events-none" />

              {/* === THE ICONIC CAPSULE SURPRISE BUTTON (Exact shape from video with glowing hearts & watermark) === */}
              <div className="relative w-full max-w-lg px-2 flex flex-col items-center">
                {/* Outer animated neon glow aura */}
                <div className="absolute -inset-1.5 bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition duration-500 animate-pulse" />

                {/* The Capsule Button */}
                <button
                  onClick={handleStartSurprise}
                  className="group relative w-full flex items-center justify-between p-1.5 sm:p-2 rounded-full bg-black/90 border-2 border-cyan-400/80 hover:border-cyan-300 text-white shadow-[0_0_25px_rgba(0,240,255,0.45)] hover:shadow-[0_0_40px_rgba(0,240,255,0.7)] transition-all duration-300 hover:scale-[1.03] active:scale-95 cursor-pointer backdrop-blur-xl"
                >
                  {/* Left Side: Glowing Heart Icon Badge */}
                  <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-blue-950 via-slate-900 to-cyan-950 border border-cyan-400/60 flex items-center justify-center shrink-0 shadow-inner group-hover:rotate-12 transition-transform">
                    <Heart className="w-5 h-5 sm:w-6 sm:h-6 fill-cyan-400 text-cyan-300 animate-pulse drop-shadow-[0_0_8px_#00f0ff]" />
                  </div>

                  {/* Center Text Area: Capsule Label */}
                  <div className="flex-1 px-3 sm:px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                      <Sparkles className="w-4 h-4 text-cyan-300 animate-spin" />
                      <span className="text-base sm:text-xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-sky-300 uppercase">
                        Press for Surprise
                      </span>
                      <Sparkles className="w-4 h-4 text-cyan-300" />
                    </div>
                    <div className="text-[11px] sm:text-xs text-cyan-300 font-semibold mt-0.5 tracking-wider">
                      Click for Mentor's Surprise 🎁
                    </div>
                  </div>

                  {/* Right Side: Glowing Heart + Music/Spark Icon Badge */}
                  <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 border border-cyan-300/80 flex items-center justify-center shrink-0 shadow-lg group-hover:-rotate-12 transition-transform">
                    <Heart className="w-5 h-5 sm:w-6 sm:h-6 fill-white text-white drop-shadow-[0_0_8px_#ffffff]" />
                  </div>
                </button>

                {/* Dedication Watermark Pill (Reminiscent of @ frontiend from the video, customized for the mentor) */}
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

              {/* === THE SYNTAX-HIGHLIGHTED CODE WINDOW (Exact from video frame 8) === */}
              {showCodePanel && (
                <div className="mt-4 w-full max-w-lg rounded-2xl bg-black/85 border border-cyan-500/30 p-3.5 backdrop-blur-md shadow-2xl text-left text-[11px] font-mono transition-all animate-in fade-in duration-300 glow-blue">
                  {/* Window Bar with red, yellow, green dots */}
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                      <span className="text-slate-500 text-[10px] ml-2 font-sans">
                        heart-tribute-engine.ts
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-cyan-400">
                      <Terminal className="w-3 h-3" />
                      <span>Ready to execute</span>
                    </div>
                  </div>

                  {/* Code lines reproducing video aesthetic */}
                  <div className="space-y-0.5 leading-relaxed text-slate-300">
                    <p className="text-slate-500">
                      <span className="text-slate-600 select-none mr-2">1</span>
                      // Tribute for Eng. Mohamed Anwar from Eng.Mariam Bahei El Din 👩🏻‍💻❤️
                    </p>
                    <p>
                      <span className="text-slate-600 select-none mr-2">2</span>
                      <span className="text-purple-400">const</span>{' '}
                      <span className="text-cyan-300">floatParticles</span> = [];
                    </p>
                    <p>
                      <span className="text-slate-600 select-none mr-2">3</span>
                      <span className="text-purple-400">const</span>{' '}
                      <span className="text-cyan-300">burstParticles</span> = [];
                    </p>
                    <p>
                      <span className="text-slate-600 select-none mr-2">4</span>
                      <span className="text-purple-400">function</span>{' '}
                      <span className="text-yellow-300">spawnHeartBurst</span>(x, y) {'{'}
                    </p>
                    <p className="pl-4">
                      <span className="text-slate-600 select-none mr-2">5</span>
                      <span className="text-cyan-300">burstParticles</span>.push(
                      <span className="text-purple-400">new</span>{' '}
                      <span className="text-green-300">Particle</span>(x, y,{' '}
                      <span className="text-amber-300">"tribute-glow"</span>));
                    </p>
                    <p>
                      <span className="text-slate-600 select-none mr-2">6</span>
                      {'}'}
                    </p>
                    <p className="text-slate-400">
                      <span className="text-slate-600 select-none mr-2">7</span>
                      <span className="text-cyan-400">BLUE_SHADES</span> = [
                      <span className="text-amber-300">"#00f0ff"</span>,{' '}
                      <span className="text-amber-300">"#3b82f6"</span>,{' '}
                      <span className="text-amber-300">"#60a5fa"</span>];
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= STEP 1: "SURPRISE!" ================= */}
          {step === 1 && (
            <div className="flex flex-col items-center animate-in zoom-in-75 duration-300 py-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 mb-4 glow-blue-lg animate-bounce">
                <Sparkles className="w-8 h-8 text-cyan-400" />
              </div>

              <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white mb-2 glow-text-cyan uppercase">
                Surprise!
              </h1>
              <p className="text-xl sm:text-2xl font-serif text-cyan-200 font-bold mb-2">
                An Unforgettable Tribute!
              </p>
              <p className="text-xs text-slate-300 animate-pulse">
                Unveiling an extraordinary tribute for our mentor...
              </p>
            </div>
          )}

          {/* ================= STEP 2: "MR. SURPRISE" ================= */}
          {step === 2 && (
            <div className="flex flex-col items-center animate-in zoom-in-90 duration-400 py-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-900/70 border border-cyan-400/50 text-cyan-300 text-xs font-semibold tracking-wider uppercase mb-3 glow-blue">
                <Gift className="w-4 h-4 text-cyan-400" />
                <span>Mr. Surprise · Mentor Tribute</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-1.5 glow-text-cyan">
                Eng. Mohamed Anwar
              </h2>

              <p className="text-base sm:text-xl font-serif text-cyan-200 font-bold mb-3">
                A Special Surprise for Our Esteemed Mentor, Eng. Mohamed Anwar
              </p>

              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-blue-500/30 text-xs text-slate-300 max-w-md glow-blue">
                From your grateful student:{' '}
                <span className="text-cyan-300 font-bold inline-block hover:animate-bounce cursor-pointer">
                  Eng.Mariam Bahei El Din 👩🏻‍💻❤️
                </span>
              </div>
            </div>
          )}

          {/* ================= STEP 3: THE GIFT ================= */}
          {step === 3 && (
            <div className="flex flex-col items-center animate-in zoom-in-95 duration-500 w-full py-4">
              {!isGiftOpened ? (
                /* Unopened Glowing Gift Box */
                <div
                  onClick={handleOpenGift}
                  className="group relative cursor-pointer flex flex-col items-center p-6 sm:p-8 rounded-3xl bg-slate-900/95 border-2 border-cyan-400/60 backdrop-blur-xl shadow-2xl glow-blue-lg hover:scale-105 transition-all duration-300"
                >
                  <div className="relative mb-4">
                    <div className="absolute -inset-3 bg-gradient-to-r from-cyan-400 via-blue-500 to-amber-400 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition-opacity" />
                    <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-tr from-blue-700 via-cyan-600 to-blue-800 border-2 border-amber-400/80 flex items-center justify-center text-amber-300 shadow-2xl group-hover:rotate-6 transition-transform">
                      <Gift className="w-12 h-12 fill-amber-400/20 text-amber-300 animate-pulse" />
                    </div>
                  </div>

                  <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold mb-1">
                    Special Gift Box · Mentor Keepsake
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Click to Unwrap Your Gift!
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Click to reveal this token of appreciation and honor
                  </p>

                  <div className="mt-4 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md glow-blue">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Open Gift Now</span>
                  </div>
                </div>
              ) : (
                /* Opened Gift Box revealing Eng. Mohamed Anwar's Tribute */
                <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/95 border border-cyan-400/60 backdrop-blur-2xl shadow-2xl glow-blue-lg max-w-lg w-full flex flex-col items-center animate-in zoom-in-90 duration-500">
                  <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-cyan-400 shadow-xl mb-4 glow-blue">
                    <img
                      src={portraitPath}
                      alt="Eng. Mohamed Anwar"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end justify-center pb-1">
                      <Heart className="w-4 h-4 fill-cyan-400 text-cyan-400" />
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-semibold uppercase tracking-wider mb-1">
                    <Award className="w-4 h-4" />
                    <span>The Gift of Eternal Appreciation</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Eng. Mohamed Anwar
                  </h3>

                  <p className="text-xs sm:text-sm text-cyan-200 mt-1 font-serif italic text-center">
                    "You are more than a teacher — you are a mentor who makes a difference."
                  </p>

                  <div className="w-16 h-0.5 bg-cyan-400/60 my-3" />

                  <p className="text-xs text-slate-300 text-center leading-relaxed">
                    Dedicated with heartfelt love and utmost respect by your student:
                    <br />
                    <span className="text-cyan-300 font-bold inline-block mt-1">
                      Eng.Mariam Bahei El Din 👩🏻‍💻❤️
                    </span>
                  </p>

                  {/* Action buttons */}
                  <div className="mt-6 w-full flex flex-col gap-2.5">
                    <button
                      onClick={() => {
                        onProceedToSite();
                        setTimeout(() => {
                          const roseElem = document.getElementById('rose-surprise');
                          if (roseElem) {
                            roseElem.scrollIntoView({ behavior: 'smooth' });
                          }
                        }, 100);
                      }}
                      className="w-full py-3 bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-xl glow-blue flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-95"
                    >
                      <span>🌸 Experience the Blooming Rose Finale</span>
                    </button>

                    <button
                      onClick={onProceedToSite}
                      className="w-full py-2.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-blue-900/60 font-medium text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Explore Full Tribute, Voice Recording & Letter</span>
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* BOTTOM FOOTER BAR */}
      <footer className="relative z-20 w-full max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 border-t border-blue-900/40 pt-3 shrink-0">
        <span>
          Dedicated to <strong className="text-slate-200">Eng. Mohamed Anwar</strong>
        </span>

        <button
          onClick={onProceedToSite}
          className="text-xs text-slate-400 hover:text-cyan-300 transition-colors flex items-center gap-1.5 underline decoration-slate-700 underline-offset-4 cursor-pointer"
        >
          <span>Skip directly to tribute website</span>
          <ArrowDown className="w-3.5 h-3.5" />
        </button>

        <span>
          By{' '}
          <span className="text-cyan-300 font-semibold inline-block hover:animate-bounce cursor-pointer">
            Eng.Mariam Bahei El Din 👩🏻‍💻❤️
          </span>
        </span>
      </footer>
    </div>
  );
};
