import { useState, type MutableRefObject } from 'react';
import { CURRENT_THEME } from '../theme';
import type { AppState } from '../App';

interface InterfaceProps {
  state: AppState;
  onStart: () => void;
  onVibeSubmit: (v: string) => void;
  chaos: number;
  calmTime: number;
  progress: number;
  soundRef: MutableRefObject<any>;
}

const Interface = ({ state, onStart, onVibeSubmit, chaos, calmTime, progress, soundRef }: InterfaceProps) => {
  const [input, setInput] = useState("");
  const [muted, setMuted] = useState(false);
  const [copied, setCopied] = useState(false);
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextMute = !muted;
    soundRef.current?.mute(nextMute);
    setMuted(nextMute);
  };
  const handleShare = () => {
    const url = new URL(window.location.href);
    // Grab the last vibe from history or state to share it
    if (input) url.searchParams.set('vibe', input);

    navigator.clipboard.writeText(url.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-50 flex flex-col justify-between p-8 sm:p-12">
      <div className="flex justify-between items-start">
        <div className="text-white drop-shadow-lg">
          <h1 className="text-3xl font-extralight tracking-tighter uppercase">{CURRENT_THEME.title}</h1>
        </div>
        <div className="flex flex-col items-end gap-3 pointer-events-auto">
            <button
              onClick={handleShare}
              className="text-[10px] text-white/50 hover:text-white tracking-widest uppercase transition-colors flex items-center gap-2"
            >
              {copied ? "✓ Copied" : "🔗 Share Vibe"}
            </button>
          <button onClick={toggleMute} className="text-[10px] text-white/50 uppercase tracking-widest">{muted ? "🔇 Unmute" : "🔊 Mute"}</button>
          {state === 'active' && <div className="text-right text-white"><p className="text-[9px] opacity-30">STILLNESS</p><p className="text-2xl font-mono">{calmTime}s</p></div>}
        </div>
      </div>

      {state === 'splash' ? (
        <div className="flex flex-col items-center justify-center grow gap-6 text-center">
          <p className="text-white/40 text-[11px] uppercase tracking-[0.4em] max-w-xs leading-relaxed">{CURRENT_THEME.purpose}</p>
          <button onClick={onStart} className="pointer-events-auto bg-white text-black px-12 py-5 rounded-full font-bold text-[10px] tracking-[0.4em] hover:scale-105 transition-all">START SESSION</button>
        </div>
      ) : (
        <div className="flex flex-col items-center grow justify-center gap-6">
          <p className="text-white text-[10px] tracking-[0.3em] uppercase opacity-40">{state === 'tuning' ? "Distilling Vibe..." : "The mind is a mirror"}</p>
          
          {/* THE INPUT TAG (Interactive Layer) */}
          <div className="pointer-events-auto w-full max-w-xs">
            <input 
              className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-3 text-[10px] text-white tracking-widest text-center focus:border-white/40 outline-none transition-all"
              placeholder="Describe a new vibe..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (onVibeSubmit(input), setInput(""))}
            />
          </div>
        </div>
      )}

      <div className="w-full">
        {state === 'active' && (
          <div className="w-full h-[2px] bg-white/10 mb-8 overflow-hidden"><div className="h-full bg-white/60" style={{ width: `${progress}%` }} /></div>
        )}
        <div className="flex justify-between text-[8px] text-white/20 uppercase tracking-[0.4em]">
          <div>Entropy {Math.floor(chaos * 100)}%</div>
          <div>Zen Gravity Engine</div>
        </div>
      </div>
    </div>
  );
};

export default Interface;