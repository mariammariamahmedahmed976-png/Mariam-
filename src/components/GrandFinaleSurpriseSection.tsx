import React, { useState } from 'react';
import {
  Sparkles,
  Heart,
  Flower2,
  Gift,
  Share2,
  Check,
  Crown,
  Quote,
} from 'lucide-react';
import { BloomingRoseParticleCanvas } from './BloomingRoseParticleCanvas';

interface GrandFinaleSurpriseSectionProps {
  onReplayHeartSurprise?: () => void;
}

export const GrandFinaleSurpriseSection: React.FC<GrandFinaleSurpriseSectionProps> = ({
  onReplayHeartSurprise,
}) => {
  const [copiedTribute, setCopiedTribute] = useState(false);

  const handleCopyTributeText = () => {
    const textToCopy = `A Rose of Eternal Gratitude for our esteemed mentor, Eng. Mohamed Anwar 🌸
"To the mentor who taught us how to innovate, and patiently guided our steps until we stood tall... you have our eternal reverence and praise."
Dedicated with deepest love, highest admiration, and gratitude by: Eng.Mariam Bahei El Din 👩🏻‍💻❤️`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedTribute(true);
    setTimeout(() => setCopiedTribute(false), 2500);
  };

  return (
    <section
      id="rose-surprise"
      dir="ltr"
      className="scroll-mt-24 relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-950 via-[#030d22] to-slate-950 border-2 border-cyan-500/40 p-6 sm:p-10 lg:p-12 shadow-[0_0_50px_rgba(6,182,212,0.25)]"
    >
      {/* Background Ambient Glows */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Badge */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 text-xs sm:text-sm font-bold shadow-[0_0_20px_rgba(6,182,212,0.35)]">
          <Gift className="w-4 h-4 text-cyan-300 animate-bounce" />
          <span>Special Grand Finale</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span>Digital Rose of Gratitude</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
          A Rose of Eternal Gratitude for <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-400 drop-shadow-sm">
            Eng. Mohamed Anwar
          </span>
        </h2>

        <p className="text-sm sm:text-base text-slate-300 font-normal max-w-2xl leading-relaxed">
          A living 3D particle rose blooming with luminous blue and electric cyan energy, symbolizing boundless appreciation for your guidance and the unforgettable impact you have left on our minds and hearts.
        </p>
      </div>

      {/* Main Grid: Rose Canvas & English Dedication Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Rose 3D Particle Visualizer (Without any code, pure interactive beauty) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          <div className="w-full relative rounded-2xl bg-black/60 border border-cyan-500/30 overflow-hidden shadow-[0_0_35px_rgba(6,182,212,0.2)]">
            {/* Top Indicator */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-cyan-500/30 text-cyan-300 text-xs backdrop-blur-md">
              <Flower2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>3D Procedural Particle Blooming Rose</span>
            </div>

            {/* High fidelity 3D Blooming Rose Canvas */}
            <BloomingRoseParticleCanvas className="w-full" autoPlayBloom={true} />
          </div>

          <p className="text-xs text-slate-400 mt-3 text-center flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Drag to rotate in 3D, customize bloom with the slider, or listen to the soundtrack</span>
          </p>
        </div>

        {/* Dedication Content Card */}
        <div className="lg:col-span-5 space-y-6 text-left">
          {/* Main Dedication Box */}
          <div className="rounded-2xl bg-slate-900/80 border border-blue-500/30 p-6 sm:p-7 shadow-xl space-y-5 backdrop-blur-md glow-border">
            {/* Quote Header */}
            <div className="flex items-center justify-between border-b border-blue-900/60 pb-3">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <Crown className="w-4 h-4 text-cyan-400" />
                <span>Message of Honor & Reverence</span>
              </div>
              <Quote className="w-6 h-6 text-cyan-400/40" />
            </div>

            {/* Poetic English Quote */}
            <blockquote className="text-slate-100 font-serif italic text-base sm:text-lg leading-relaxed border-l-2 border-cyan-400 pl-3">
              "To the mentor who taught us how to innovate, and patiently guided our steps until we stood tall... you have our eternal reverence and praise."
            </blockquote>

            <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
              <p>
                To our revered teacher and mentor, <strong className="text-white font-semibold">Eng. Mohamed Anwar</strong>:
                we present this blooming digital rose in the sky of appreciation, a glowing symbol of your limitless generosity, and your steadfast devotion to instilling engineering passion in our minds and spirits.
              </p>
              <p className="text-slate-400 text-xs">
                Thank you for every encouraging word, and every hour of patient guidance that shaped the future of your students. Knowledge is illumination, and your engineering legacy is a beacon lighting our paths.
              </p>
            </div>

            {/* Dedication Signature */}
            <div className="pt-4 border-t border-blue-900/60 flex flex-col gap-1">
              <div className="text-xs text-cyan-400 font-semibold uppercase tracking-wider">
                Dedicated with heartfelt gratitude by your student:
              </div>
              <div className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-sky-400">
                  Eng.Mariam Bahei El Din 👩🏻‍💻❤️
                </span>
              </div>
              <div className="text-xs text-slate-400">
                Eng. Mariam Bahei El Din · With Highest Respect & Honor
              </div>
            </div>
          </div>

          {/* Quick Interactive Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleCopyTributeText}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-md"
            >
              {copiedTribute ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Tribute Copied Successfully</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-cyan-400" />
                  <span>Copy Tribute Text</span>
                </>
              )}
            </button>

            {onReplayHeartSurprise && (
              <button
                onClick={onReplayHeartSurprise}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg glow-blue"
              >
                <Heart className="w-4 h-4 fill-white/30" />
                <span>Watch Blue Heart Surprise 🎁</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
