export default function Reflection({ calmTime }: { calmTime: number }) {
    const getRank = () => {
      if (calmTime > 60) return { title: "Deep Sea Monk", desc: "Absolute stillness." };
      if (calmTime > 20) return { title: "Urban Fox", desc: "Aware but restless." };
      return { title: "Electric Storm", desc: "A chaotic mind." };
    };
  
    const rank = getRank();
  
    return (
      <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl animate-in fade-in duration-700">
        <div className="text-center p-8">
          <h3 className="text-white/40 text-[10px] tracking-[0.4em] uppercase mb-2">Neural Scan Complete</h3>
          <h2 className="text-5xl text-white font-extralight mb-6 tracking-tighter">{rank.title}</h2>
          <p className="text-white/60 mb-8">{rank.desc}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-white text-black px-8 py-3 rounded-full text-xs font-bold tracking-widest"
          >
            RETRY SCAN
          </button>
        </div>
      </div>
    );
  }