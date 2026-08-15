import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Loader2, Sparkles } from 'lucide-react';

interface AudioBriefingProps {
  text: string;
  title: string;
}

export const AudioBriefing: React.FC<AudioBriefingProps> = ({ text, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Clean markdown for speech
  const cleanSpeechText = (raw: string) => {
    return raw
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[#*_`]/g, '')
      .slice(0, 300);
  };

  const handleGenerateAudio = async () => {
    if (audioUrl) {
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          audioRef.current.play();
          setIsPlaying(true);
        }
      }
      return;
    }

    setIsLoading(true);

    try {
      // 1. Attempt server-side Gemini TTS
      const res = await fetch('/api/generate-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice: 'Kore' })
      });

      const data = await res.json();
      if (data.audioBase64) {
        const binary = atob(data.audioBase64);
        const array = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          array[i] = binary.charCodeAt(i);
        }
        // Gemini TTS raw PCM or audio
        const blob = new Blob([array], { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setHasGenerated(true);
        setIsLoading(false);
        setIsPlaying(true);
        return;
      }
    } catch (err) {
      console.warn("Server TTS not available, falling back to Web Speech API:", err);
    }

    // Fallback: Web Speech API
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleanSpeechText(text));
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      
      utterance.onstart = () => {
        setIsPlaying(true);
        setIsLoading(false);
        setHasGenerated(true);
      };

      utterance.onend = () => {
        setIsPlaying(false);
      };

      utterance.onerror = () => {
        setIsPlaying(false);
        setIsLoading(false);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      setIsLoading(false);
    }
  };

  const handleToggleSpeech = () => {
    if ('speechSynthesis' in window && !audioUrl) {
      if (isPlaying) {
        window.speechSynthesis.pause();
        setIsPlaying(false);
      } else if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsPlaying(true);
      } else {
        handleGenerateAudio();
      }
    } else if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else {
      handleGenerateAudio();
    }
  };

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  return (
    <div className="p-3.5 bg-slate-900 text-slate-100 rounded-lg border border-slate-800 flex flex-col gap-3">
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Volume2 size={15} />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-200">AI Audio Briefing</div>
            <div className="text-[10px] text-slate-400 font-mono">Neural voice synthesis</div>
          </div>
        </div>

        <button
          onClick={handleToggleSpeech}
          disabled={isLoading}
          className="px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 size={13} className="animate-spin" />
              <span>Synthesizing...</span>
            </>
          ) : isPlaying ? (
            <>
              <Pause size={13} />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play size={13} fill="currentColor" />
              <span>{hasGenerated ? 'Resume' : 'Listen Briefing'}</span>
            </>
          )}
        </button>
      </div>

      {/* Waveform indicator */}
      {isPlaying && (
        <div className="flex items-center justify-center gap-1 py-1.5 px-3 bg-slate-950/60 rounded border border-slate-800">
          {[40, 75, 100, 60, 90, 45, 80, 100, 70, 30, 85, 60, 95, 50, 70, 100, 40].map((h, i) => (
            <div
              key={i}
              className="w-1 bg-indigo-400 rounded-full animate-pulse"
              style={{
                height: `${Math.max(4, h * 0.2)}px`,
                animationDelay: `${(i * 0.08).toFixed(2)}s`
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
