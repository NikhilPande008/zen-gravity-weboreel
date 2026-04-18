import { Howl } from 'howler';
import { useState, useRef } from 'react';

interface InterfaceProps {
  onVibeSubmit: (v: string) => void;
  setIsPlaying: (p: boolean) => void;
  vibeHistory: string[];
}

const Interface = ({ onVibeSubmit, setIsPlaying, vibeHistory }: InterfaceProps) => {
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(false);
  const [input, setInput] = useState("");
  const soundRef = useRef<Howl | null>(null);

  const start = () => {
    soundRef.current = new Howl({
      src: ['/audio/zen.mp3'],
      loop: true,
      volume: 0.4,
      html5: true // Better for mobile/browser autoplay policies
    });
    soundRef.current.play();
    setStarted(true);
    setIsPlaying(true);
  };

  // This is the "Better Job" fix: A dedicated, type-safe handler
  const handleMute = () => {
    const sound = soundRef.current;
    if (sound) {
      const nextMutedState = !muted;
      sound.mute(nextMutedState);
      setMuted(nextMutedState);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input.trim()) {
      onVibeSubmit(input);
      setInput("");
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none flex flex-col justify-between p-6 sm:p-10">
      <div className="flex justify-between items-start">
        <div className="text-white">
          <h2 className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-40">Weboreel #01</h2>
          <h1 className="text-3xl font-extralight tracking-tighter leading-none">ZEN GRAVITY</h1>
        </div>
        
        {started && (
          <button 
            onClick={handleMute} 
            className="pointer-events-auto text-[10px] text-white/50 hover:text-white tracking-widest uppercase transition-colors"
          >
            {muted ? "🔇 Unmute" : "🔊 Mute"}
          </button>
        )}
      </div>

      {!started ? (
        <div className="flex flex-col items-center justify-center grow">
           <button 
             onClick={start} 
             className="pointer-events-auto bg-white text-black px-12 py-5 rounded-full font-bold text-xs tracking-[0.3em] shadow-2xl active:scale-95 transition-all hover:bg-gray-100"
           >
            BREATHE IN
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6 mb-12">
          <input 
            type="text"
            placeholder="Describe a vibe..."
            className="pointer-events-auto bg-white/10 border border-white/20 text-white text-sm px-6 py-4 rounded-full w-full max-w-md backdrop-blur-xl outline-none focus:border-white/50 transition-all shadow-2xl"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="flex flex-wrap justify-center gap-2 max-w-lg">
            {vibeHistory.map((v, i) => (
              <span key={i} className="text-[10px] text-white/30 bg-white/5 px-3 py-1 rounded-full border border-white/5 animate-in fade-in duration-500">
                {v}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between items-end text-[9px] text-white/20 uppercase tracking-[0.4em]">
        <div style={{ writingMode: 'vertical-rl' }} className="pb-4">M5 Agentic Logic</div>
        <div className="hidden sm:block text-right">
          Scroll for gravity<br/>
          Mouse to attract
        </div>
      </div>
    </div>
  );
};

export default Interface;