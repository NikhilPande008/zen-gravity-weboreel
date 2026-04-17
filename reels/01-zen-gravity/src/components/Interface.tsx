import { Howl } from 'howler';
import { useState } from 'react';

interface InterfaceProps {
  vibe: string;
  setVibe: (v: string) => void;
  setIsPlaying: (p: boolean) => void;
}

const Interface = ({ vibe, setVibe, setIsPlaying }: InterfaceProps) => {
  const [started, setStarted] = useState(false);

  const startExperience = () => {
    const sound = new Howl({
      src: ['/audio/zen.mp3'], 
      loop: true,
      volume: 0.4,
    });
    sound.play();
    setStarted(true);
    setIsPlaying(true);
  };

  return (
    <div className="fixed inset-0 pointer-events-none flex flex-col justify-between p-8">
      <div className="flex justify-between items-start">
        <div className="text-white">
          <h2 className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-40">Weboreel #01</h2>
          <h1 className="text-3xl font-extralight tracking-tighter">ZEN GRAVITY</h1>
        </div>
        {started && (
          <div className="pointer-events-auto">
            <input 
              type="text"
              placeholder="Enter a vibe..."
              className="bg-white/5 border border-white/10 text-white text-xs p-3 rounded-lg w-48 backdrop-blur-md outline-none focus:border-blue-500/50 transition-all"
              value={vibe}
              onChange={(e) => setVibe(e.target.value)}
            />
          </div>
        )}
      </div>
      {!started && (
        <div className="flex flex-col items-center justify-center grow">
           <button 
            onClick={startExperience}
            className="pointer-events-auto bg-white text-black px-12 py-5 rounded-full font-bold text-sm tracking-[0.2em] shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 transition-all"
          >
            BREATHE IN
          </button>
        </div>
      )}
      <div className="flex justify-between items-end text-[10px] text-white/20 uppercase tracking-[0.3em]">
        <div style={{ writingMode: 'vertical-rl' }} className="pb-4">M5 Engine v1.0</div>
        <div>Scroll for gravity • Mouse to attract</div>
      </div>
    </div>
  );
};

export default Interface;