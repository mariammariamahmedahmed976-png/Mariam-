import React from 'react';
import { Compass, Lightbulb, HeartHandshake, Milestone } from 'lucide-react';

export const MentorVirtues: React.FC = () => {
  const virtues = [
    {
      icon: Compass,
      title: 'Guiding Light & Direction',
      subtitle: 'Wisdom & Leadership',
      desc: 'Navigating complex ideas with calm wisdom, always steering students toward academic clarity and moral integrity.',
    },
    {
      icon: Lightbulb,
      title: 'Patience & Clear Insight',
      subtitle: 'Selfless Dedication',
      desc: 'Dedication that never tires, breaking down obstacles until every student discovers their inner "Eureka!" moment.',
    },
    {
      icon: HeartHandshake,
      title: 'Unwavering Belief in Students',
      subtitle: 'Fostering Confidence',
      desc: 'Recognizing hidden talents and fostering confidence when self-doubt threatened to dim our ambition.',
    },
    {
      icon: Milestone,
      title: 'Everlasting Inspiration',
      subtitle: 'Enduring Legacy',
      desc: 'Imparting life lessons of discipline, curiosity, and kindness that stay with us long after leaving the classroom.',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {virtues.map((v, i) => {
        const Icon = v.icon;
        return (
          <div
            key={i}
            className="group relative rounded-2xl bg-slate-900/80 border border-blue-900/40 p-6 transition-all duration-300 hover:border-sky-500/50 hover:bg-slate-900/95 hover:-translate-y-1 glow-blue"
          >
            {/* Subtle top indicator glow */}
            <div className="w-10 h-10 rounded-xl bg-blue-600/15 border border-blue-400/25 flex items-center justify-center text-sky-400 mb-4 group-hover:scale-110 transition-transform">
              <Icon className="w-5 h-5" />
            </div>

            <h4 className="text-base font-bold text-white tracking-tight group-hover:text-sky-300 transition-colors">
              {v.title}
            </h4>
            <span className="text-xs text-sky-400/80 font-medium block mt-0.5">
              {v.subtitle}
            </span>
            <p className="text-xs sm:text-sm text-slate-400 mt-2.5 leading-relaxed">
              {v.desc}
            </p>
          </div>
        );
      })}
    </div>
  );
};
