import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Mic,
  Square,
  Upload,
  Music,
  CheckCircle2,
  Sparkles,
  Radio,
  Loader2,
} from 'lucide-react';
import { audioTributeEngine } from '../utils/audioSynthesizer';

interface AudioTributePlayerProps {
  className?: string;
}

export const AudioTributePlayer: React.FC<AudioTributePlayerProps> = ({
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(42); // Estimated duration of speech
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);
  const [selectedVoiceStyle, setSelectedVoiceStyle] = useState<'elegant-uk' | 'warm-us' | 'studio-ai'>('elegant-uk');
  const [isGeneratingAiAudio, setIsGeneratingAiAudio] = useState(false);
  const [aiAudioUrl, setAiAudioUrl] = useState<string | null>(null);

  // Recorder state
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [showRecorderModal, setShowRecorderModal] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [activeSource, setActiveSource] = useState<'default' | 'custom'>('default');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);
  const playbackIntervalRef = useRef<any>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const defaultAudioElementRef = useRef<HTMLAudioElement | null>(null);
  const soundtrackAudioRef = useRef<HTMLAudioElement | null>(null);
  const soundtrackPath = '/assets/aistudio/heart_tribute_soundtrack.mp3';
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Words of praise dedicated to Eng. Mohamed Anwar (Mr. B)
  const defaultSpeechText =
    "To our esteemed teacher and mentor, Eng. Mohamed Anwar — words can scarcely capture the depth of our admiration and gratitude. You are not only an extraordinary educator, but a brilliant engineer whose clarity of thought, boundless patience, and inspiring wisdom have transformed how we learn. You never just taught lessons; you engineered confidence, simplified the hardest challenges with grace, and showed us that true excellence is achieved through dedication and integrity. Thank you, Eng. Mohamed Anwar, for your generous mentorship, your endless support, and the everlasting positive influence you have gifted to our lives.";

  // Load custom recording from localStorage if present
  useEffect(() => {
    const saved = localStorage.getItem('tribute_custom_voice');
    if (saved) {
      setRecordedAudioUrl(saved);
      setActiveSource('custom');
    }
  }, []);

  // Sync volume with audio elements
  useEffect(() => {
    if (audioElementRef.current) {
      audioElementRef.current.volume = isMuted ? 0 : volume;
    }
    if (defaultAudioElementRef.current) {
      defaultAudioElementRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Generate or retrieve Studio AI Voice from backend
  const fetchAiAudio = async () => {
    if (aiAudioUrl) return aiAudioUrl;
    setIsGeneratingAiAudio(true);
    try {
      const res = await fetch('/api/generate-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: defaultSpeechText,
          voiceName: 'Charon',
        }),
      });
      const data = await res.json();
      if (data.audio) {
        setAiAudioUrl(data.audio);
        return data.audio;
      }
    } catch (e) {
      console.warn('AI Voice fallback to browser synthesis:', e);
    } finally {
      setIsGeneratingAiAudio(false);
    }
    return null;
  };

  // Handle Play/Pause
  const togglePlay = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  const playAudio = async () => {
    setIsPlaying(true);

    if (activeSource === 'custom' && recordedAudioUrl && audioElementRef.current) {
      audioElementRef.current.play().catch(console.warn);
      return;
    }

    // Default source: check if studio audio or speech synthesis is requested
    if (selectedVoiceStyle === 'studio-ai') {
      const audioUrl = await fetchAiAudio();
      if (audioUrl && defaultAudioElementRef.current) {
        defaultAudioElementRef.current.src = audioUrl;
        defaultAudioElementRef.current.play().catch(console.warn);
        return;
      }
    }

    // Play using browser's most elegant English voice
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(defaultSpeechText);
      utterance.rate = 0.90; // Slightly measured, elegant pace
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      let chosenVoice: SpeechSynthesisVoice | undefined;

      if (selectedVoiceStyle === 'elegant-uk') {
        chosenVoice =
          voices.find((v) => v.lang === 'en-GB' && (v.name.includes('Natural') || v.name.includes('Neural') || v.name.includes('Oliver') || v.name.includes('Kate'))) ||
          voices.find((v) => v.lang === 'en-GB') ||
          voices.find((v) => v.lang.startsWith('en'));
      } else {
        chosenVoice =
          voices.find((v) => v.lang === 'en-US' && (v.name.includes('Natural') || v.name.includes('Neural') || v.name.includes('Samantha') || v.name.includes('Guy'))) ||
          voices.find((v) => v.lang === 'en-US') ||
          voices.find((v) => v.lang.startsWith('en'));
      }

      if (chosenVoice) utterance.voice = chosenVoice;

      utterance.onend = () => {
        setIsPlaying(false);
        setCurrentTime(0);
        if (playbackIntervalRef.current) clearInterval(playbackIntervalRef.current);
      };

      speechSynthesisRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }

    // Simulate progress bar timer if using Web Speech
    if (playbackIntervalRef.current) clearInterval(playbackIntervalRef.current);
    playbackIntervalRef.current = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= duration) {
          clearInterval(playbackIntervalRef.current);
          setIsPlaying(false);
          return 0;
        }
        return prev + 0.25;
      });
    }, 250);
  };

  const pauseAudio = () => {
    setIsPlaying(false);
    if (activeSource === 'custom' && audioElementRef.current) {
      audioElementRef.current.pause();
    } else if (defaultAudioElementRef.current) {
      defaultAudioElementRef.current.pause();
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (playbackIntervalRef.current) clearInterval(playbackIntervalRef.current);
  };

  const restartAudio = () => {
    pauseAudio();
    setCurrentTime(0);
    if (audioElementRef.current) audioElementRef.current.currentTime = 0;
    if (defaultAudioElementRef.current) defaultAudioElementRef.current.currentTime = 0;
    setTimeout(() => {
      playAudio();
    }, 150);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (activeSource === 'custom' && audioElementRef.current) {
      audioElementRef.current.currentTime = newTime;
    } else if (defaultAudioElementRef.current && defaultAudioElementRef.current.src) {
      defaultAudioElementRef.current.currentTime = newTime;
    }
  };

  const toggleAmbientMusic = () => {
    if (soundtrackAudioRef.current) {
      if (isAmbientPlaying) {
        soundtrackAudioRef.current.pause();
        setIsAmbientPlaying(false);
      } else {
        soundtrackAudioRef.current.volume = (isMuted ? 0 : volume) * 0.45;
        soundtrackAudioRef.current.play().catch(console.warn);
        setIsAmbientPlaying(true);
      }
    } else {
      const newState = audioTributeEngine.toggleAmbientMusic();
      setIsAmbientPlaying(newState);
    }
  };

  // Recording methods
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64data = reader.result as string;
          setRecordedAudioUrl(base64data);
          setActiveSource('custom');
          try {
            localStorage.setItem('tribute_custom_voice', base64data);
          } catch (e) {
            console.warn('LocalStorage limit:', e);
          }
        };
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      alert('Microphone access was denied or is not supported in this browser.');
      console.error('Mic error:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setRecordedAudioUrl(url);
        setActiveSource('custom');
        try {
          localStorage.setItem('tribute_custom_voice', url);
        } catch (err) {
          console.warn('Storage size limit', err);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900/95 via-slate-950/98 to-slate-900/95 border border-blue-500/30 p-6 md:p-8 backdrop-blur-xl shadow-2xl glow-blue ${className}`}
    >
      {/* Background ambient glow circles */}
      <div className="absolute -top-16 -right-16 w-56 h-56 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Hidden audio element for custom recordings */}
      {recordedAudioUrl && (
        <audio
          ref={audioElementRef}
          src={recordedAudioUrl}
          onTimeUpdate={() => {
            if (audioElementRef.current) {
              setCurrentTime(audioElementRef.current.currentTime);
              setDuration(audioElementRef.current.duration || 30);
            }
          }}
          onEnded={() => {
            setIsPlaying(false);
            setCurrentTime(0);
          }}
        />
      )}

      {/* Hidden audio element for Studio AI TTS */}
      <audio
        ref={defaultAudioElementRef}
        onTimeUpdate={() => {
          if (defaultAudioElementRef.current) {
            setCurrentTime(defaultAudioElementRef.current.currentTime);
            setDuration(defaultAudioElementRef.current.duration || 42);
          }
        }}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentTime(0);
        }}
      />

      {/* Hidden audio element for original video soundtrack */}
      <audio ref={soundtrackAudioRef} src={soundtrackPath} loop />

      {/* Header with Title & Source Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 uppercase tracking-widest">
            <Radio className="w-3.5 h-3.5" />
            <span>Praise & Voice Dedication</span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight mt-1">
            Words of Praise for Eng. Mohamed Anwar
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Narrated in an elegant English voice honoring our beloved mentor
          </p>
        </div>

        {/* Source switch tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 border border-slate-800 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => {
              pauseAudio();
              setActiveSource('default');
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeSource === 'default'
                ? 'bg-blue-600 text-white shadow-sm glow-blue'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Praise Narration
          </button>
          <button
            onClick={() => {
              pauseAudio();
              if (!recordedAudioUrl) {
                setShowRecorderModal(true);
              } else {
                setActiveSource('custom');
              }
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
              activeSource === 'custom'
                ? 'bg-blue-600 text-white shadow-sm glow-blue'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mic className="w-3 h-3" />
            <span>{recordedAudioUrl ? 'My Voice Note' : 'Record My Voice'}</span>
          </button>
        </div>
      </div>

      {/* Voice Selection Chips (for Elegant Voice) */}
      {activeSource === 'default' && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Voice Elegance:</span>
          <button
            onClick={() => {
              pauseAudio();
              setSelectedVoiceStyle('elegant-uk');
            }}
            className={`px-2.5 py-1 text-xs rounded-lg border transition-all ${
              selectedVoiceStyle === 'elegant-uk'
                ? 'bg-sky-950 border-sky-400 text-sky-300 font-semibold'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            🇬🇧 Elegant British Accent
          </button>
          <button
            onClick={() => {
              pauseAudio();
              setSelectedVoiceStyle('warm-us');
            }}
            className={`px-2.5 py-1 text-xs rounded-lg border transition-all ${
              selectedVoiceStyle === 'warm-us'
                ? 'bg-sky-950 border-sky-400 text-sky-300 font-semibold'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            🇺🇸 Calm American Voice
          </button>
          <button
            onClick={() => {
              pauseAudio();
              setSelectedVoiceStyle('studio-ai');
            }}
            className={`px-2.5 py-1 text-xs rounded-lg border transition-all flex items-center gap-1 ${
              selectedVoiceStyle === 'studio-ai'
                ? 'bg-sky-950 border-sky-400 text-sky-300 font-semibold'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3 h-3 text-sky-400" />
            <span>Studio AI Audio</span>
          </button>
        </div>
      )}

      {/* Animated Waveform Visualizer */}
      <div className="bg-slate-950/80 border border-blue-900/40 rounded-2xl p-4 mb-6">
        <div className="flex items-end justify-between gap-1 h-14 w-full px-2">
          {Array.from({ length: 36 }).map((_, i) => {
            const isActive = isPlaying;
            const barHeight = isActive
              ? Math.max(15, Math.sin(i * 0.45 + currentTime * 5) * 45 + 50)
              : Math.max(10, Math.sin(i * 0.3) * 15 + 20);

            return (
              <div
                key={i}
                className="w-full rounded-full transition-all duration-150"
                style={{
                  height: `${barHeight}%`,
                  backgroundColor:
                    i / 36 <= currentTime / duration
                      ? '#38bdf8'
                      : i % 2 === 0
                      ? '#1e3a8a'
                      : '#172554',
                  boxShadow:
                    isActive && i / 36 <= currentTime / duration
                      ? '0 0 10px rgba(56, 189, 248, 0.75)'
                      : 'none',
                }}
              />
            );
          })}
        </div>

        {/* Progress Bar & Timestamps */}
        <div className="mt-3">
          <input
            type="range"
            min={0}
            max={duration || 42}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            aria-label="Audio progress"
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
          />
          <div className="flex justify-between items-center text-xs font-mono text-slate-400 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {/* Player Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Play / Restart Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            disabled={isGeneratingAiAudio}
            className="w-13 h-13 rounded-full bg-gradient-to-tr from-blue-600 via-sky-500 to-blue-500 text-white flex items-center justify-center shadow-lg shadow-sky-500/30 hover:scale-105 active:scale-95 transition-all glow-blue cursor-pointer disabled:opacity-50"
            title={isPlaying ? 'Pause' : 'Play voice message'}
            aria-label={isPlaying ? 'Pause' : 'Play voice message'}
          >
            {isGeneratingAiAudio ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          <button
            onClick={restartAudio}
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/60 transition-all cursor-pointer"
            title="Restart message"
            aria-label="Restart message"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Peaceful Ambient Piano Toggle */}
          <button
            onClick={toggleAmbientMusic}
            className={`px-3 py-2 rounded-xl text-xs font-medium border flex items-center gap-2 transition-all cursor-pointer ${
              isAmbientPlaying
                ? 'bg-sky-500/20 border-sky-400/50 text-sky-300 glow-blue'
                : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-slate-200'
            }`}
            title="Play gentle ambient piano harmony"
          >
            <Music className={`w-3.5 h-3.5 ${isAmbientPlaying ? 'animate-spin' : ''}`} />
            <span>{isAmbientPlaying ? 'Soundtrack Music On' : 'Play Soundtrack Music'}</span>
          </button>
        </div>

        {/* Volume & Record Actions */}
        <div className="flex items-center gap-4">
          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-red-400" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                setIsMuted(false);
              }}
              aria-label="Volume slider"
              className="w-18 sm:w-24 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
            />
          </div>

          {/* Record button modal launcher */}
          <button
            onClick={() => setShowRecorderModal(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800/90 hover:bg-slate-700 text-sky-300 border border-blue-500/30 flex items-center gap-1.5 transition-all hover:border-sky-400/60 cursor-pointer"
          >
            <Mic className="w-3.5 h-3.5 text-sky-400" />
            <span>Microphone Recorder</span>
          </button>
        </div>
      </div>

      {/* Transcript of the Praise */}
      <div className="mt-6 pt-5 border-t border-slate-800/80">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-xs font-semibold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Spoken Praise Transcript</span>
          </p>
          <span className="text-[11px] text-slate-500 font-medium">Dedicated to Eng. Mohamed Anwar</span>
        </div>
        <blockquote className="text-sm sm:text-base italic text-slate-200 leading-relaxed font-serif bg-slate-950/50 p-4 rounded-xl border border-slate-800/60">
          "{defaultSpeechText}"
        </blockquote>
      </div>

      {/* Recorder Modal */}
      {showRecorderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-blue-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-white relative glow-blue">
            <h4 className="text-lg font-bold text-sky-300 flex items-center gap-2">
              <Mic className="w-5 h-5 text-sky-400" />
              <span>Record Your Personal Voice Tribute</span>
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Speak directly in your own voice to express your praise for Eng. Mohamed Anwar.
            </p>

            {/* Recording Controls */}
            <div className="my-6 flex flex-col items-center justify-center p-6 bg-slate-950/80 rounded-2xl border border-slate-800">
              {isRecording ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="relative">
                    <span className="w-16 h-16 rounded-full bg-red-600/30 animate-ping absolute inset-0" />
                    <button
                      onClick={stopRecording}
                      className="relative w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-lg hover:bg-red-500 transition-colors cursor-pointer"
                      title="Stop recording"
                    >
                      <Square className="w-6 h-6 fill-current text-white" />
                    </button>
                  </div>
                  <span className="text-sm font-mono text-red-400 font-semibold animate-pulse">
                    Recording: {formatTime(recordingSeconds)}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <button
                    onClick={startRecording}
                    className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 glow-blue cursor-pointer"
                    title="Start recording"
                  >
                    <Mic className="w-7 h-7 text-white" />
                  </button>
                  <span className="text-xs text-slate-400">
                    Click microphone to start recording your voice
                  </span>
                </div>
              )}
            </div>

            {/* Audio File Upload Alternative */}
            <div className="border-t border-slate-800 pt-4 mt-2">
              <label className="text-xs text-slate-400 mb-2 block font-medium">
                Or upload your existing voice audio file (.mp3, .wav, .m4a):
              </label>
              <label className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-xl cursor-pointer text-xs font-medium text-slate-200 transition-colors">
                <Upload className="w-4 h-4 text-sky-400" />
                <span>Upload Voice File</span>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Status if recording exists */}
            {recordedAudioUrl && (
              <div className="mt-4 p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl flex items-center gap-2 text-xs text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Custom voice note saved and ready to play!</span>
              </div>
            )}

            {/* Modal actions */}
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowRecorderModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
