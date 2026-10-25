import React from 'react';
import { Award, Printer, X, Sparkles, Heart } from 'lucide-react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cert-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-in fade-in overflow-y-auto"
    >
      <div className="relative max-w-3xl w-full bg-slate-900 border border-blue-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl text-white glow-blue my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/80 border border-slate-700 transition-colors"
          aria-label="Close certificate"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Outer Border Frame */}
        <div
          id="printable-certificate"
          className="relative rounded-2xl bg-gradient-to-b from-[#0b1329] via-[#060b18] to-[#0b1329] p-8 sm:p-12 border-4 border-double border-amber-500/60 shadow-2xl text-center"
        >
          {/* Subtle Corner Ornaments */}
          <div className="absolute top-3 left-3 text-amber-400 text-xs font-serif">✦ ✦</div>
          <div className="absolute top-3 right-3 text-amber-400 text-xs font-serif">✦ ✦</div>
          <div className="absolute bottom-3 left-3 text-amber-400 text-xs font-serif">✦ ✦</div>
          <div className="absolute bottom-3 right-3 text-amber-400 text-xs font-serif">✦ ✦</div>

          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-500/10 border border-amber-400/40 text-amber-400 mb-4">
            <Award className="w-8 h-8" />
          </div>

          <span className="block text-xs uppercase tracking-[0.25em] text-amber-400 font-semibold mb-2">
            Certificate of Honor & Eternal Appreciation
          </span>

          <h2 id="cert-title" className="text-2xl sm:text-4xl font-serif font-extrabold text-white tracking-wide mb-2">
            ENG. MOHAMED ANWAR
          </h2>

          <p className="text-sm font-medium text-sky-300 font-serif mb-6">
            Distinguished Engineering Mentorship & Lifetime Educational Dedication
          </p>

          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-6" />

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed font-serif">
            Presented in highest recognition and deepest gratitude for your outstanding dedication,
            wisdom, and exemplary engineering mentorship. Your guidance has shaped minds, inspired hearts,
            and illuminated the path toward excellence.
          </p>

          <p className="text-xs sm:text-sm italic text-sky-200 mt-4 max-w-lg mx-auto font-serif">
            "You are more than a teacher — you are a mentor who makes a difference."
          </p>

          {/* Certificate Signatures */}
          <div className="grid grid-cols-2 gap-8 mt-10 pt-6 border-t border-amber-500/20 text-xs text-slate-400">
            <div>
              <div className="font-serif italic text-sm text-amber-300 mb-1">
                With Deepest Respect
              </div>
              <p className="text-xs text-sky-300 font-semibold inline-flex items-center gap-1.5 transition-transform hover:scale-110 hover:-translate-y-1 hover:animate-bounce cursor-pointer">
                Eng.Mariam Bahei El Din 👩🏻‍💻❤️
              </p>
            </div>
            <div>
              <div className="font-serif font-semibold text-sm text-amber-300 mb-1">
                Academic Year 2026
              </div>
              <p className="text-[11px] text-slate-400">Honoring Excellence in Teaching</p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-6">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Official Digital Keepsake</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md glow-blue transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print Certificate</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
