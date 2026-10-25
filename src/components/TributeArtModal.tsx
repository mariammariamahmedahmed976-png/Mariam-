import React, { useState } from 'react';
import { Sparkles, Image as ImageIcon, Download, Award, Loader2, X, Check } from 'lucide-react';

interface TributeArtModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TributeArtModal: React.FC<TributeArtModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('2K');
  const [style, setStyle] = useState<'celestial' | 'gold' | 'neon'>('celestial');
  const [prompt, setPrompt] = useState(
    'A majestic commemorative tribute honoring exceptional teacher Eng. Mohamed Anwar, surrounded by celestial sapphire stars, glowing stardust heart, and dignified elegance.'
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/generate-tribute-art', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          imageSize,
          style,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate tribute art.');
      }

      setGeneratedImageUrl(data.imageUrl);
    } catch (err: any) {
      setErrorMessage(err.message || 'Image generation failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="tribute-art-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-in fade-in"
    >
      <div className="relative max-w-2xl w-full max-h-[92vh] overflow-y-auto bg-slate-900 border border-blue-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-white glow-blue">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/80 border border-slate-700 transition-colors"
          aria-label="Close generator modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-400/30 flex items-center justify-center text-sky-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 id="tribute-art-title" className="text-xl sm:text-2xl font-bold tracking-tight">
              Create Tribute Artwork & Keepsake
            </h3>
            <p className="text-xs text-slate-400">
              Generate commemorative artwork dedicated to Mr. Mohamed Anwar
            </p>
          </div>
        </div>

        {/* Configuration */}
        <div className="mt-6 space-y-5">
          {/* Size Affordance (1K, 2K, 4K) - Explicit requirement */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Select Image Resolution (Size Affordance)
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['1K', '2K', '4K'] as const).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setImageSize(size)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 ${
                    imageSize === size
                      ? 'bg-blue-600 border-sky-400 text-white shadow-md glow-blue'
                      : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {imageSize === size && <Check className="w-3.5 h-3.5 text-sky-300" />}
                  <span>{size} Resolution</span>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              Available sizes powered by high-fidelity image models for ultra-crisp display and printing.
            </p>
          </div>

          {/* Artistic Style */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Artistic Theme
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setStyle('celestial')}
                className={`p-3 rounded-xl text-left border transition-all text-xs ${
                  style === 'celestial'
                    ? 'bg-blue-950/80 border-sky-400 text-sky-200 glow-blue'
                    : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span className="font-bold block text-white">Celestial Heart</span>
                <span className="text-[11px] text-slate-400">Deep cosmic navy & sapphire stardust</span>
              </button>

              <button
                type="button"
                onClick={() => setStyle('gold')}
                className={`p-3 rounded-xl text-left border transition-all text-xs ${
                  style === 'gold'
                    ? 'bg-blue-950/80 border-sky-400 text-sky-200 glow-blue'
                    : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span className="font-bold block text-white">Golden Seal</span>
                <span className="text-[11px] text-slate-400">Regal navy & royal gold honor seal</span>
              </button>

              <button
                type="button"
                onClick={() => setStyle('neon')}
                className={`p-3 rounded-xl text-left border transition-all text-xs ${
                  style === 'neon'
                    ? 'bg-blue-950/80 border-sky-400 text-sky-200 glow-blue'
                    : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span className="font-bold block text-white">Electric Luminescence</span>
                <span className="text-[11px] text-slate-400">Glowing neon circuitry & azure glow</span>
              </button>
            </div>
          </div>

          {/* Prompt customizer */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Custom Dedication Prompt
            </label>
            <textarea
              rows={2}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full px-4 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 transition-colors"
            />
          </div>

          {/* Action button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-3 bg-gradient-to-r from-blue-600 via-sky-500 to-blue-600 hover:from-blue-500 hover:to-sky-400 disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-all shadow-lg glow-blue flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Crafting Masterpiece ({imageSize})...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Tribute Artwork ({imageSize})</span>
              </>
            )}
          </button>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-red-950/50 border border-red-800/80 rounded-xl text-xs text-red-300">
              {errorMessage}
            </div>
          )}

          {/* Output Display */}
          {generatedImageUrl && (
            <div className="mt-4 p-4 bg-slate-950 border border-blue-500/40 rounded-2xl flex flex-col items-center">
              <span className="text-xs font-semibold text-sky-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                <span>Generated Artwork ({imageSize})</span>
              </span>
              <img
                src={generatedImageUrl}
                alt="Generated tribute to Mr. Mohamed Anwar"
                className="max-h-72 w-auto object-contain rounded-xl border border-blue-900/60 shadow-xl"
              />
              <a
                href={generatedImageUrl}
                download={`Mr-Mohamed-Anwar-Artwork-${imageSize}.png`}
                className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-xl flex items-center gap-2 shadow-md transition-all glow-blue"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Artwork</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
