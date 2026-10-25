import React, { useState } from 'react';
import {
  Heart,
  Sparkles,
  MessageSquare,
  Award,
  Image as ImageIcon,
  ScrollText,
  Volume2,
  ChevronRight,
  Shield,
  Star,
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { SurpriseIntroScreen } from './components/SurpriseIntroScreen';
import { TeacherPortraitCard } from './components/TeacherPortraitCard';
import { AudioTributePlayer } from './components/AudioTributePlayer';
import { HeartfeltLetter } from './components/HeartfeltLetter';
import { MentorVirtues } from './components/MentorVirtues';
import { GuestbookWall } from './components/GuestbookWall';
import { TributeChatbot } from './components/TributeChatbot';
import { TributeArtModal } from './components/TributeArtModal';
import { HeartExperienceSection } from './components/HeartExperienceSection';
import { CertificateModal } from './components/CertificateModal';
import { GrandFinaleSurpriseSection } from './components/GrandFinaleSurpriseSection';
import { FallingRosePetals } from './components/FallingRosePetals';
import { RoseHeroSection } from './components/RoseHeroSection';

export default function App() {
  const [showSurpriseIntro, setShowSurpriseIntro] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isArtModalOpen, setIsArtModalOpen] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white relative">
      {/* Ambient Falling Glowing Rose Petals - Always Present Across the Website */}
      <FallingRosePetals />

      {/* Opening Screen with Interactive Surprise Button (Accessible on demand via Surprise Button) */}
      {showSurpriseIntro && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <SurpriseIntroScreen
            onProceedToSite={() => setShowSurpriseIntro(false)}
          />
        </div>
      )}

      {/* Top Bar Navigation */}
      <Navbar
        onReplaySurprise={() => {
          setShowSurpriseIntro(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenCompanion={() => setIsChatbotOpen(true)}
        onOpenArtModal={() => setIsArtModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16 sm:space-y-24 relative z-20">
        {/* HERO SECTION: Front & Center 3D Procedural Blooming Rose Showcase */}
        <div id="rose-hero" className="scroll-mt-24">
          <RoseHeroSection
            onOpenCertificate={() => setIsCertModalOpen(true)}
            onOpenArtModal={() => setIsArtModalOpen(true)}
            onReopenSurpriseIntro={() => {
              setShowSurpriseIntro(true);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </div>

        {/* PORTRAIT SECTION: Split Screen with Typography and Portrait */}
        <section
          id="portrait"
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center"
        >
          {/* Left Column: Typographic Hierarchy */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Kicker with unboxed metadata discipline */}
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 tracking-widest uppercase">
              <Star className="w-4 h-4 fill-sky-400/20 text-sky-400" />
              <span>A Lifetime of Inspiration</span>
              <span aria-hidden="true" className="text-slate-600">
                ·
              </span>
              <span className="text-slate-400">Honoring Eng. Mohamed Anwar</span>
            </div>

            {/* Display Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] text-balance">
              More Than a Teacher, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-300">
                A Lifelong Mentor
              </span>
            </h1>

            {/* Lead Copy */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-light max-w-2xl">
              This tribute website is a personal gift of gratitude and deep appreciation for{' '}
              <strong className="text-white font-semibold">Eng. Mohamed Anwar</strong>. For your
              infinite patience, brilliant engineering insights, generous encouragement, and for believing
              in your students when they needed it most.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#heart-experience"
                className="px-5 py-3 rounded-xl bg-cyan-950/70 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-500/40 font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 glow-blue"
              >
                <Heart className="w-4 h-4 text-cyan-400 fill-cyan-400/20" />
                <span>3D Particle Heart</span>
              </a>

              <a
                href="#audio"
                className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm shadow-lg glow-blue transition-all flex items-center gap-2"
              >
                <Volume2 className="w-4 h-4" />
                <span>Voice Tribute</span>
              </a>

              <a
                href="#letter"
                className="px-5 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-blue-900/60 font-semibold text-xs sm:text-sm transition-all flex items-center gap-2"
              >
                <ScrollText className="w-4 h-4 text-sky-400" />
                <span>Read Gratitude Letter</span>
              </a>

              <a
                href="#rose-surprise"
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-600/40 to-blue-700/40 hover:from-cyan-600/60 hover:to-blue-700/60 text-cyan-200 border border-cyan-400/50 font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 glow-blue"
              >
                <span>🌸 Blooming Rose Finale</span>
              </a>

              <button
                onClick={() => setIsCertModalOpen(true)}
                className="px-5 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-amber-300 hover:text-amber-200 border border-amber-500/30 font-semibold text-xs sm:text-sm transition-all flex items-center gap-2"
              >
                <Award className="w-4 h-4 text-amber-400" />
                <span>Honor Certificate</span>
              </button>
            </div>
          </div>

          {/* Right Column: High-Definition Teacher Portrait */}
          <div className="lg:col-span-5 flex justify-center">
            <TeacherPortraitCard className="w-full max-w-md" />
          </div>
        </section>

        {/* 4-KPI Full-Width Gratitude Strip (adhering to portfolio & frontend design rules) */}
        <section className="rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-blue-900/40 p-6 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center glow-blue">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-sky-400 font-mono tabular-nums">
              100%
            </div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Dedication to Students</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-400 font-mono tabular-nums">
              Countless
            </div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Hours of Patient Guidance</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-sky-300 font-mono tabular-nums">
              Endless
            </div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Encouragement & Support</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-300 font-mono tabular-nums">
              Lifelong
            </div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Impression on Our Hearts</div>
          </div>
        </section>

        {/* 3D PARTICLE HEART SHOWCASE SECTION */}
        <HeartExperienceSection onReopenSurpriseIntro={() => setShowSurpriseIntro(true)} />

        {/* AUDIO PLAYER SECTION */}
        <section id="audio" className="scroll-mt-24 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 tracking-widest uppercase">
            <Volume2 className="w-4 h-4" />
            <span>Spoken Words of Gratitude</span>
          </div>
          <AudioTributePlayer />
        </section>

        {/* HEARTFELT LETTER SECTION */}
        <section id="letter" className="scroll-mt-24">
          <HeartfeltLetter />
        </section>

        {/* MENTORSHIP VIRTUES SECTION */}
        <section id="virtues" className="scroll-mt-24 space-y-6">
          <div className="text-left">
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 tracking-widest uppercase">
              <Shield className="w-4 h-4" />
              <span>Core Values</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
              The Pillars of Eng. Mohamed Anwar's Mentorship
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Virtues that define true educational excellence and touch generations of students.
            </p>
          </div>
          <MentorVirtues />
        </section>

        {/* COMMEMORATIVE KEEPSAKE & CERTIFICATE BANNER */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950/70 via-slate-900/90 to-blue-950/70 border border-blue-500/30 p-8 sm:p-12 shadow-2xl glow-blue text-left flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest">
              <Award className="w-4 h-4" />
              <span>Commemorative Honors</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Certificate of Honor & AI Keepsake Art
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
              Create and download high-resolution commemorative certificates or generate custom
              1K, 2K, or 4K tribute digital artwork celebrating Eng. Mohamed Anwar.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setIsCertModalOpen(true)}
              className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>View Certificate</span>
            </button>

            <button
              onClick={() => setIsArtModalOpen(true)}
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm shadow-md glow-blue transition-all flex items-center gap-2 cursor-pointer"
            >
              <ImageIcon className="w-4 h-4" />
              <span>Generate 4K Tribute Art</span>
            </button>
          </div>
        </section>

        {/* STUDENT MEMORY WALL */}
        <section id="guestbook" className="scroll-mt-24">
          <GuestbookWall />
        </section>

        {/* GRAND FINALE SURPRISE: BLOOMING ROSE SHOWCASE & DEDICATION */}
        <GrandFinaleSurpriseSection
          onReplayHeartSurprise={() => {
            setShowSurpriseIntro(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </main>

      {/* FLOATING ACTION BUTTONS */}
      <div className="fixed bottom-6 left-6 z-30 flex flex-col gap-2.5">
        {/* Tribute Companion Assistant */}
        <button
          onClick={() => setIsChatbotOpen(!isChatbotOpen)}
          className="px-4 py-2.5 rounded-full bg-slate-900/95 hover:bg-blue-950 border border-sky-400/50 text-sky-300 text-xs font-semibold shadow-2xl glow-blue transition-all flex items-center gap-2 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <MessageSquare className="w-4 h-4 text-sky-400" />
          <span>Tribute Companion</span>
        </button>
      </div>

      {/* Floating Direct Surprise Buttons on Bottom Right */}
      <div className="fixed bottom-6 right-6 z-30 flex flex-col items-end gap-2.5">
        <button
          onClick={() => {
            const event = new CustomEvent('rose-burst', { detail: { count: 30 } });
            window.dispatchEvent(event);
          }}
          className="group relative px-4 py-2 rounded-full bg-slate-950/90 hover:bg-slate-900 border border-cyan-400/80 text-cyan-200 text-xs font-bold shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all flex items-center gap-2 hover:scale-105 active:scale-95 cursor-pointer glow-blue backdrop-blur-xl"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>Offer a Rose 🌹</span>
        </button>

        <button
          onClick={() => {
            setShowSurpriseIntro(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="group relative px-4 py-2.5 rounded-full bg-black/90 hover:bg-slate-900 border-2 border-cyan-400 text-white text-xs font-bold shadow-[0_0_20px_rgba(0,240,255,0.6)] transition-all flex items-center gap-2 hover:scale-105 active:scale-95 cursor-pointer glow-blue backdrop-blur-xl"
        >
          <Heart className="w-4 h-4 fill-cyan-400 text-cyan-300 animate-pulse" />
          <span>🎁 Mr. Surprise Button</span>
        </button>
      </div>

      {/* MODALS */}
      <TributeChatbot
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
      />

      <TributeArtModal
        isOpen={isArtModalOpen}
        onClose={() => setIsArtModalOpen(false)}
      />

      <CertificateModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
      />

      {/* FOOTER */}
      <footer className="mt-20 border-t border-blue-950/80 bg-slate-950 py-10 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <Heart className="w-4 h-4 text-sky-400 fill-sky-400/20" />
            <span>Dedicated with eternal gratitude to Eng. Mohamed Anwar</span>
          </div>

          <div className="text-slate-500 flex items-center gap-1.5 flex-wrap justify-center">
            <span>Created with sincere appreciation and reverence by his student,</span>
            <span className="text-sky-300 font-semibold inline-flex items-center gap-1 transition-transform hover:scale-110 hover:-translate-y-1 hover:animate-bounce cursor-pointer glow-text-cyan">
              Eng.Mariam Bahei El Din 👩🏻‍💻❤️
            </span>
            <span>· 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
