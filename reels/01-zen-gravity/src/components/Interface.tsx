import { Howl } from 'howler';
import { useState, useRef } from 'react';

const Interface = ({ onVibeSubmit, setIsPlaying, vibeHistory }: any) => {
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(false);
  const [input, setInput] = useState("");
  const soundRef = useRef<Howl | null>(null);

  const start = () => {
    soundRef.current = new Howl({ src: ['/audio/zen.mp3'], loop: true, volume: 0.4 });
    soundRef.current.play();
    setStarted(true);
    setIsPlaying(true);
  };

  const handleSubmit = (e: any) => {
    if (e.key === 'Enter') {
      onVibeSubmit(input);
      setInput("");
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none flex flex-col justify-between p-6 sm:p-10">
      <div className="flex justify-between items-start">
        <div className="text-white">
          <h2 className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-40">Weboreel #01</h2>
          <h1 className="text-3xl font-extralight tracking-tighter">ZEN GRAVITY</h1>
        </div>
        {started && (
          <button onClick={() => { soundRef.current?.mute(!muted); setMuted(!muted); }} className="pointer-events-auto text-[10px] text-white/50 tracking-widest">
            {muted ? "🔈 UNMUTE" : "🔊 MUTE"}
          </button>
        )}
      </div>

      {!started ? (
        <div className="flex items-center justify-center grow">
           <button onClick={start} className="pointer-events-auto bg-white text-black px-10 py-4 rounded-full font-bold text-xs tracking-[0.3em] shadow-xl transition-all">
            BREATHE IN
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6 mb-12">
          <input 
            type="text"
            placeholder="Describe the vibe... (e.g. Neon rain)"
            className="pointer-events-auto bg-white/10 border border-white/20 text-white text-sm px-6 py-3 rounded-full w-full max-w-sm backdrop-blur-md outline-none focus:border-white/50 transition-all shadow-2xl"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleSubmit}
          />
          <div className="flex gap-2">
            {vibeHistory.map((v: string, i: number) => (
              <span key={i} className="text-[10px] text-white/40 bg-white/5 px-3 py-1 rounded-full border border-white/10 animate-fade-in">
                {v}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between items-end text-[9px] text-white/20 uppercase tracking-[0.4em]">
        <div style={{ writingMode: 'vertical-rl' }} className="pb-4">M5 Agentic Logic</div>
        <div>Scroll for gravity • Mouse to attract</div>
      </div>
    </div>
  );
};

export default Interface;