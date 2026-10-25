import React from 'react';
import { Heart, Flower2, Sparkles } from 'lucide-react';

interface NavbarProps {
  onReplaySurprise: () => void;
  onOpenCompanion: () => void;
  onOpenArtModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onReplaySurprise,
  onOpenCompanion,
  onOpenArtModal,
}) => {
  const handleShowerPetals = () => {
    const event = new CustomEvent('rose-burst', { detail: { count: 30 } });
    window.dispatchEvent(event);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/85 border-b border-blue-900/40">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 sm:gap-8 px-4 sm:px-8 py-3.5">
        {/* Zone 1: Wordmark with Rose & Tribute */}
        <a
          href="#"
          className="text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 flex items-center gap-2 group"
        >
          <Flower2 className="w-5 h-5 text-cyan-400 animate-spin group-hover:rotate-45 transition-transform" />
          <span className="hidden sm:inline">The Eternal Rose Tribute · Eng. Mohamed Anwar</span>
          <span className="sm:hidden">Eng. Mohamed Anwar 🌹</span>
        </a>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-5 text-xs sm:text-sm font-medium text-slate-300">
          <a
            href="#rose-hero"
            className="hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0 text-cyan-300 font-semibold flex items-center gap-1"
          >
            <Flower2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Blooming Rose</span>
          </a>
          <a
            href="#heart-experience"
            className="hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1"
          >
            <Heart className="w-3.5 h-3.5 fill-cyan-400/30 text-cyan-400" />
            <span>3D Particle Heart</span>
          </a>
          <a
            href="#portrait"
            className="hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0"
          >
            Portrait
          </a>
          <a
            href="#audio"
            className="hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0"
          >
            Audio Tribute
          </a>
          <a
            href="#letter"
            className="hover:text-sky-300 transition-colors whitespace-nowrap shrink-0"
          >
            Letter
          </a>
          <a
            href="#virtues"
            className="hover:text-sky-300 transition-colors whitespace-nowrap shrink-0"
          >
            Virtues
          </a>
          <a
            href="#guestbook"
            className="hover:text-sky-300 transition-colors whitespace-nowrap shrink-0"
          >
            Memory Wall
          </a>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={handleShowerPetals}
            className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-sm glow-blue"
            title="Shower floating rose petals"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Send Rose</span>
            <span>🌹</span>
          </button>

          <button
            onClick={onReplaySurprise}
            className="group relative px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 rounded-xl transition-all shadow-md glow-blue whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
          >
            <Heart className="w-3.5 h-3.5 fill-current text-cyan-200 animate-pulse" />
            <span className="hidden sm:inline">Surprise Experience</span>
            <span className="sm:hidden">Surprise 🎁</span>
          </button>
        </div>
      </div>
    </header>
  );
};
