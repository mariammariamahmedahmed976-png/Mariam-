import React, { useState } from 'react';
import { Maximize2, Download, Heart, Sparkles, X, Award, ShieldCheck } from 'lucide-react';

interface TeacherPortraitCardProps {
  className?: string;
}

export const TeacherPortraitCard: React.FC<TeacherPortraitCardProps> = ({
  className = '',
}) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const imagePath = '/assets/aistudio/IMG-20261024-WA0006_efcbd352.jpg';

  return (
    <>
      <div
        className={`relative group rounded-3xl p-1 bg-gradient-to-b from-blue-500/30 via-sky-500/20 to-blue-900/40 shadow-2xl transition-all duration-300 ${className}`}
      >
        {/* Subtle decorative outer ambient glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-sky-400 to-blue-700 rounded-3xl blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-500 pointer-events-none" />

        <div className="relative overflow-hidden rounded-[22px] bg-slate-950 border border-blue-400/30 flex flex-col items-center">
          {/* Top subtle badge header */}
          <div className="w-full px-5 py-3.5 bg-slate-900/90 border-b border-blue-900/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-semibold tracking-wider text-slate-200 uppercase">
                Commemorative Portrait
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-sky-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Honoring Excellence</span>
            </div>
          </div>

          {/* Portrait Container */}
          <div className="relative w-full overflow-hidden bg-slate-950 flex items-center justify-center p-3 sm:p-5">
            <div className="relative max-w-md w-full rounded-2xl overflow-hidden shadow-2xl border border-blue-500/30 transition-transform duration-500 group-hover:scale-[1.01]">
              <img
                src={imagePath}
                alt="Commemorative portrait of Mr. Mohamed Anwar surrounded by celestial starlight and glowing heart"
                className="w-full h-auto object-contain block transition-transform duration-700"
                referrerPolicy="no-referrer"
              />

              {/* Hover overlay with quick actions */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                <span className="text-xs font-medium text-sky-200 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                  Eng. Mohamed Anwar
                </span>
                <button
                  onClick={() => setIsLightboxOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-blue-600/90 hover:bg-blue-500 text-white text-xs font-medium flex items-center gap-1.5 backdrop-blur-sm shadow-md transition-all"
                  title="View full screen"
                  aria-label="View full screen"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Enlarge</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Card Footer */}
          <div className="w-full p-5 bg-gradient-to-b from-slate-900/90 to-slate-950 border-t border-blue-900/40 text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center justify-center gap-2">
              <span>Eng. Mohamed Anwar</span>
              <Heart className="w-4 h-4 text-sky-400 fill-sky-400/30 inline" />
            </h3>
            <p className="text-xs sm:text-sm text-sky-300/90 font-medium mt-1">
              Inspiring Teacher · Dedicated Mentor · Guiding Light
            </p>
            <p className="text-xs text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
              "You are more than a teacher — you are a mentor who makes a difference."
            </p>

            <div className="flex items-center justify-center gap-3 mt-4">
              <button
                onClick={() => setIsLightboxOpen(true)}
                className="px-4 py-2 text-xs font-medium text-sky-300 bg-blue-950/60 hover:bg-blue-900/60 border border-blue-800/60 rounded-xl transition-all flex items-center gap-1.5"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Examine Portrait</span>
              </button>
              <a
                href={imagePath}
                download="Eng-Mohamed-Anwar-Tribute.jpg"
                className="px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-md flex items-center gap-1.5 glow-blue"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save Keepsake</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Eng. Mohamed Anwar Tribute Poster"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-200"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div
            className="relative max-w-3xl w-full max-h-[92vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute -top-12 right-0 p-2 text-slate-400 hover:text-white bg-slate-900/80 rounded-full border border-slate-700 transition-colors"
              title="Close viewer"
              aria-label="Close viewer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* High-res Image Display */}
            <div className="relative rounded-2xl overflow-hidden border border-blue-500/40 shadow-2xl glow-blue-lg max-h-[82vh] bg-slate-950">
              <img
                src={imagePath}
                alt="Commemorative portrait of Eng. Mohamed Anwar"
                className="w-full h-full max-h-[82vh] object-contain block"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="mt-3 flex items-center justify-between w-full px-2 text-xs text-slate-400">
              <span>Commemorative Digital Tribute · Eng. Mohamed Anwar</span>
              <a
                href={imagePath}
                download="Eng-Mohamed-Anwar-Tribute.jpg"
                className="text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download full size</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
