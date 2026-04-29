import { useState, useEffect, useCallback, Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { EffectComposer, Bloom, ChromaticAberration, Noise } from '@react-three/postprocessing';
import { CURRENT_THEME } from './theme';
import Experience from './components/Experience';
import Interface from './components/Interface';
import Reflection from './components/Reflection';
import { getVibePhysics } from './utils/ai-agent'; // Ensure this utility exists
import { Howl } from 'howler';

export type AppState = 'splash' | 'active' | 'tuning' | 'reflection';

function App() {
  const [state, setState] = useState<AppState>('splash');
  const [chaos, setChaos] = useState(0);
  const [calmTime, setCalmTime] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [physics, setPhysics] = useState({ color: CURRENT_THEME.colors.primary, bloom: 1.5 });

  const soundRef = useRef<Howl | null>(null);

  // Initialize Audio
  useEffect(() => {
    soundRef.current = new Howl({
      src: [CURRENT_THEME.audioUrl],
      loop: true,
      volume: 0.5,
      html5: true
    });
    return () => soundRef.current?.unload();
  }, []);

  // Timer & Chaos Decay
  useEffect(() => {
    const loop = setInterval(() => {
      setChaos((c) => Math.max(0, c - CURRENT_THEME.physics.decayRate));
      if (state === 'active') {
        if (chaos < 0.15) setCalmTime((t) => t + 0.1);
        setTimeLeft((prev) => (prev <= 0.1 ? 0 : prev - 0.1));
        if (timeLeft <= 0.1) setState('reflection');
      }
    }, 100);
    return () => clearInterval(loop);
  }, [chaos, state, timeLeft]);

  const handleStart = () => {
    soundRef.current?.play();
    setState('active');
  };

  const onVibeSubmit = async (vibe: string) => {
    setState('tuning');
    const aiData = await getVibePhysics(vibe);
    console.log("AI Response:", aiData); // CHECK YOUR CONSOLE FOR THIS
    if (aiData) {
      setPhysics({ color: aiData.color, bloom: aiData.bloom });
    }
    setState('active');
  };

  return (
    <main className="fixed inset-0 bg-black touch-none overflow-hidden"
      onPointerDown={() => state === 'active' && setChaos(c => Math.min(1, c + CURRENT_THEME.physics.chaosSensitivity))}>
      <Canvas camera={{ position: [0, 0, 8] }}>
        <color attach="background" args={[CURRENT_THEME.colors.background]} />
        <Suspense fallback={null}>
          <Physics gravity={[0, 0, 0]}>
            <Experience
              chaos={chaos}
              theme={{
                ...CURRENT_THEME,
                colors: {
                  ...CURRENT_THEME.colors,
                  primary: physics.color
                }
              }}
            />
          </Physics>
          <EffectComposer>
            <Bloom intensity={physics.bloom + (chaos * 3)} mipmapBlur />
            <ChromaticAberration offset={[0.002 * chaos, 0.002 * chaos]} />
            <Noise opacity={0.05 + (chaos * 0.15)} />
          </EffectComposer>
        </Suspense>
      </Canvas>

      <Interface
        state={state}
        onStart={handleStart}
        onVibeSubmit={onVibeSubmit}
        chaos={chaos}
        calmTime={Math.floor(calmTime)}
        progress={(timeLeft / 45) * 100}
        soundRef={soundRef}
      />

      {state === 'reflection' && <Reflection calmTime={calmTime} />}
    </main>
  );
}
export default App;