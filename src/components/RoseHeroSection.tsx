import React, { useState } from 'react';
import {
  Flower2,
  Heart,
  Sparkles,
  Volume2,
  ScrollText,
  Award,
  Crown,
  Share2,
  Send,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BloomingRoseParticleCanvas } from './BloomingRoseParticleCanvas';
import { TeacherPortraitCard } from './TeacherPortraitCard';

interface RoseHeroSectionProps {
  onOpenCertificate: () => void;
  onOpenArtModal: () => void;
  onReopenSurpriseIntro?: () => void;
}

export const RoseHeroSection: React.FC<RoseHeroSectionProps> = ({
  onOpenCertificate,
  onOpenArtModal,
  onReopenSurpriseIntro,
}) => {
  const [roseCount, setRoseCount] = useState<number>(1842);
  const [hasSentRose, setHasSentRose] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const handleSendRose = () => {
    setRoseCount((prev) => prev + 1);
    setHasSentRose(true);

    // Dispatch custom event to trigger falling rose petal burst
    const event = new CustomEvent('rose-burst', { detail: { count: 35 } });
    window.dispatchEvent(event);

    // Starlight & blue confetti
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#00f0ff', '#38bdf8', '#2563eb', '#ffffff', '#a5f3fc'],
    });

    setTimeout(() => {
      setHasSentRose(false);
    }, 3000);
  };

  const handleShareTribute = () => {
    const text = `A Living Rose of Eternal Gratitude for Eng. Mohamed Anwar 🌹
"To the mentor who taught us how to innovate, and patiently guided our steps until we stood tall... you have our eternal reverence and praise."
Honoring Eng. Mohamed Anwar | Dedicated by Eng.Mariam Bahei El Din 👩🏻‍💻❤️`;
    navigator.clipboard.writeText(text);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-950 via-[#030c20] to-slate-950 border-2 border-cyan-500/40 p-6 sm:p-10 lg:p-12 shadow-[0_0_60px_rgba(6,182,212,0.22)]">
      {/* Background ambient lighting */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* TOP KICKER & DEDICATION RIBBON */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto space-y-4 mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 text-xs sm:text-sm font-bold shadow-[0_0_25px_rgba(6,182,212,0.35)]">
          <Flower2 className="w-4 h-4 text-cyan-300 animate-spin" />
          <span>The Eternal Blooming Rose Tribute</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span>Honoring Eng. Mohamed Anwar</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] text-balance">
          A Living Rose of Eternal Gratitude <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-400 drop-shadow-sm">
            For Eng. Mohamed Anwar
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 font-light max-w-2xl leading-relaxed">
          From the depths of sincere reverence and admiration, this eternal 3D particle rose blooms continuously in tribute to{' '}
          <strong className="text-white font-semibold">Eng. Mohamed Anwar</strong> — for your infinite patience, brilliant engineering mentorship, and indelible impact on our lives.
        </p>

        {/* Dedication Subtitle */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
          <span>Dedicated with utmost reverence by his student,</span>
          <span className="text-cyan-300 font-bold inline-flex items-center gap-1 hover:animate-bounce cursor-pointer glow-text-cyan">
            Eng.Mariam Bahei El Din 👩🏻‍💻❤️
          </span>
        </div>
      </div>

      {/* CENTERPIECE: 3D PROCEDURAL PARTICLE ROSE CANVAS (The Rose Front & Center) */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* Left Column: 3D Blooming Rose Interactive Canvas */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          <div className="w-full relative rounded-2xl bg-black/70 border border-cyan-500/40 overflow-hidden shadow-[0_0_40px_rgba(6,182,212,0.25)]">
            {/* Top Indicator */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/85 border border-cyan-500/30 text-cyan-300 text-xs backdrop-blur-md">
              <Flower2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>3D Procedural Particle Rose · Always Blooming</span>
            </div>

            {/* The 3D Blooming Rose */}
            <BloomingRoseParticleCanvas className="w-full" autoPlayBloom={true} />
          </div>

          <p className="text-xs text-slate-400 mt-3 text-center flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Drag in any direction to rotate in 3D · Adjust bloom slider or listen to tribute music</span>
          </p>
        </div>

        {/* Right Column: Interactive Dedication & Live Rose Offering */}
        <div className="lg:col-span-5 space-y-6 text-left">
          {/* Live Rose Offering Widget */}
          <div className="rounded-2xl bg-slate-900/90 border border-cyan-500/30 p-6 shadow-xl backdrop-blur-md glow-border space-y-4">
            <div className="flex items-center justify-between border-b border-blue-900/60 pb-3">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <Crown className="w-4 h-4 text-cyan-400" />
                <span>The Garden of Appreciation</span>
              </div>
              <span className="text-xs font-mono font-bold text-sky-400 bg-sky-950/80 px-2.5 py-0.5 rounded-full border border-sky-500/30">
                {roseCount.toLocaleString()} Roses Planted 🌹
              </span>
            </div>

            <blockquote className="text-slate-200 font-serif italic text-sm sm:text-base leading-relaxed border-l-2 border-cyan-400 pl-3">
              "To the mentor who taught us how to innovate, and patiently guided our steps until we stood tall... you have our eternal reverence and praise."
            </blockquote>

            <p className="text-xs text-slate-300 leading-relaxed font-light">
              Offer a blooming digital rose to <strong className="text-white font-semibold">Eng. Mohamed Anwar</strong>. Each rose blooms with electric cyan energy, cascading stardust and petals across the website.
            </p>

            {/* Interactive Rose Button */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={handleSendRose}
                className="w-full sm:w-auto flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg glow-blue transition-all flex items-center justify-center gap-2 hover:scale-[1.03] active:scale-95 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{hasSentRose ? 'Rose Offered with Gratitude! 🌹' : 'Offer a Rose 🌹'}</span>
              </button>

              <button
                onClick={handleShareTribute}
                className="px-4 py-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                title="Copy tribute dedication"
              >
                {copiedShare ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-cyan-400" />
                    <span>Share</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Navigation into Other Exhibits */}
          <div className="space-y-2.5">
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Explore More of the Tribute:
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <a
                href="#heart-experience"
                className="p-3 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-cyan-500/30 hover:border-cyan-400 text-left transition-all group flex items-center gap-2.5 glow-blue"
              >
                <Heart className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-cyan-300">
                    3D Particle Heart
                  </div>
                  <div className="text-[10px] text-slate-400">Exact video replica</div>
                </div>
              </a>

              <a
                href="#audio"
                className="p-3 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-blue-900/60 hover:border-blue-500 text-left transition-all group flex items-center gap-2.5"
              >
                <Volume2 className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-sky-300">
                    Voice Tribute
                  </div>
                  <div className="text-[10px] text-slate-400">Spoken words & music</div>
                </div>
              </a>

              <a
                href="#letter"
                className="p-3 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-blue-900/60 hover:border-blue-500 text-left transition-all group flex items-center gap-2.5"
              >
                <ScrollText className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-sky-300">
                    Gratitude Letter
                  </div>
                  <div className="text-[10px] text-slate-400">Written with reverence</div>
                </div>
              </a>

              <button
                onClick={onOpenCertificate}
                className="p-3 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-amber-500/30 hover:border-amber-400 text-left transition-all group flex items-center gap-2.5 cursor-pointer"
              >
                <Award className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-amber-300">
                    Honor Certificate
                  </div>
                  <div className="text-[10px] text-slate-400">Downloadable keepsake</div>
                </div>
              </button>
            </div>
          </div>

          {/* Commemorative Portrait Mini Card Integration */}
          <div className="rounded-2xl bg-black/60 border border-blue-900/50 p-4 flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden border border-cyan-400/60 shrink-0">
              <img
                src="/assets/aistudio/IMG-20261024-WA0006_efcbd352.jpg"
                alt="Eng. Mohamed Anwar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Eng. Mohamed Anwar</span>
                <Crown className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Inspiring Teacher · Dedicated Mentor
              </div>
              <a
                href="#portrait"
                className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold underline mt-1 inline-block"
              >
                View Full Portrait & Keepsake →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
