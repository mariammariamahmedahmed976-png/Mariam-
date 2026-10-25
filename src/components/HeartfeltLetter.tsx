import React, { useState } from 'react';
import { Heart, Sparkles, BookOpen, Quote, Copy, Check } from 'lucide-react';

export const HeartfeltLetter: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const englishLetter = {
    title: 'A Letter of Eternal Gratitude',
    subtitle: 'To my inspiring teacher and mentor, Eng. Mohamed Anwar',
    paragraphs: [
      'There are teachers who teach from books, and then there are visionary mentors like you, Eng. Mohamed Anwar, who teach with brilliant precision, genuine heart, and boundless wisdom. From the very first day, your classroom was not merely a room for lessons, but a sanctuary where curiosity was nurtured, complex concepts were engineered into clarity, and dreams were ignited.',
      'Thank you for your infinite patience during the times when understanding came slowly. You never rushed, you never lost faith, and you always found a unique, intuitive way to illuminate the path forward. When doubts clouded my progress, your quiet words of encouragement rekindled my confidence and reminded me that I was capable of achieving what once felt impossible.',
      'You are more than a teacher — you are a true mentor who leads by example. Through your professional integrity, your kindness, and your passion for learning, you have taught me lessons that reach far beyond textbooks: lessons of perseverance, intellectual discipline, humility, and the courage to strive for excellence in everything I do.',
      'This website is only a modest reflection of the immense gratitude that lives in my heart. Thank you, Eng. Mohamed Anwar, for every sacrifice, every hour spent preparing, and every moment of guidance you so generously shared. May life reward you with as much joy, health, and fulfillment as you have given to each of your students.',
    ],
    closing: 'With deepest respect, highest appreciation, and lifelong gratitude,',
    signature: 'Eng.Mariam Bahei El Din 👩🏻‍💻❤️',
  };

  const handleCopy = () => {
    const fullText = `${englishLetter.title}\n${englishLetter.subtitle}\n\n${englishLetter.paragraphs.join(
      '\n\n'
    )}\n\n${englishLetter.closing}\n${englishLetter.signature}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-3xl bg-gradient-to-b from-slate-900/95 via-slate-950/98 to-slate-900/95 border border-blue-500/25 p-6 sm:p-10 backdrop-blur-xl shadow-2xl glow-blue overflow-hidden">
      {/* Decorative ambient background flares */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar with Copy button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-900/40 pb-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-400/30 flex items-center justify-center text-sky-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-sky-400 tracking-wider uppercase">
              Heartfelt Message
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {englishLetter.title}
            </h3>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700 transition-all flex items-center gap-1.5 text-xs font-medium cursor-pointer"
            title="Copy letter to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300">Copied to Clipboard</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-400" />
                <span>Copy Full Letter</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Subtitle dedication */}
      <div className="mb-6">
        <p className="text-sm sm:text-base font-medium text-sky-300/90 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
          <span>{englishLetter.subtitle}</span>
        </p>
      </div>

      {/* Letter Body */}
      <div className="space-y-5 text-slate-200 leading-relaxed font-light text-base sm:text-lg">
        <Quote className="w-8 h-8 text-blue-500/40 mb-2" />
        {englishLetter.paragraphs.map((p, idx) => (
          <p key={idx} className="relative z-10 text-slate-200/95 font-normal">
            {p}
          </p>
        ))}
      </div>

      {/* Formal Signature Lockup */}
      <div className="mt-10 pt-6 border-t border-blue-900/30 flex flex-col items-start text-left">
        <p className="text-xs text-sky-400 uppercase tracking-widest font-semibold">
          {englishLetter.closing}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <Heart className="w-4 h-4 text-sky-400 fill-sky-400/30" />
          <span className="text-lg font-bold text-white tracking-tight inline-flex items-center gap-1.5 transition-transform hover:scale-110 hover:-translate-y-1 hover:animate-bounce cursor-pointer glow-text-cyan">
            {englishLetter.signature}
          </span>
        </div>
      </div>
    </div>
  );
};
