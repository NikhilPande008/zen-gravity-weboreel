import { useState, useRef } from 'react';
import { Howl } from 'howler';
import type { SessionState } from '../App';

interface InterfaceProps {
  state: SessionState;
  setState: (s: SessionState) => void;
  chaos: number;
  calmTime: number;
  onVibeSubmit: (v: string) => void;
}

const Interface = ({ state, setState, chaos, calmTime, onVibeSubmit }: InterfaceProps) => {
  const [input, setInput] = useState("");
  const soundRef = useRef<Howl | null>(null);

  const start = () => {
    const sound = new Howl({ src: ['/audio/zen.mp3'], loop: true, volume: 0.4, html5: true });
    soundRef.current = sound;
    sound.play();
    setState('active');
  };

  const message = chaos > 0.7 
    ? "Your mind is a storm..." 
    : chaos > 0.2 
    ? "The noise of the day..." 
    : "Your mind behaves like this.";

  return (
    <div className="fixed inset-0 pointer-events-none flex flex-col justify-between p-8 sm:p-12 z-50">
      <div className="flex justify-between items-start">
        <div className="text-white">
          <h2 className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-30">Weboreel #01</h2>
          <h1 className="text-4xl font-extralight tracking-tighter">ZEN GRAVITY</h1>
        </div>
        {state === 'active' && (
          <div className="text-right">
            <p className="text-[10px] text-white/40 uppercase tracking-widest">Stillness Found</p>
            <p className="text-2xl font-mono text-white">{calmTime}s</p>
          </div>
        )}
      </div>

      {state === 'idle' ? (
        <div className="flex flex-col items-center justify-center grow gap-4">
          <button onClick={start} className="pointer-events-auto bg-white text-black px-10 py-4 rounded-full font-bold text-xs tracking-[0.3em] hover:scale-105 transition-all">
            BREATHE IN
          </button>
          <p className="text-white/30 text-[9px] uppercase tracking-widest animate-pulse">Touch to enter</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-8 mb-10 text-center">
          <p className="text-white text-sm font-light tracking-[0.2em] transition-opacity duration-1000 uppercase opacity-60">
            {state === 'tuning' ? "AI is distilling stillness..." : message}
          </p>
          
          <div className="w-full max-w-md flex flex-col gap-4">
            <input 
              type="text"
              placeholder="Change the vibe..."
              className="pointer-events-auto bg-black/40 border border-white/20 text-white text-sm px-8 py-5 rounded-full backdrop-blur-3xl outline-none focus:border-white/50 transition-all text-center"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (onVibeSubmit(input), setInput(""))}
            />
          </div>
        </div>
      )}

      <div className="flex justify-between items-end text-[9px] text-white/20 uppercase tracking-[0.4em]">
        <div className="pb-2">Interaction generates entropy</div>
        <div className="text-right">Stillness restores peace</div>
      </div>
    </div>
  );
};

export default Interface;