import { useState, Suspense, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import Experience from './components/Experience';
import Interface from './components/Interface';
import { getVibePhysics } from './utils/ai-agent';

export type SessionState = 'idle' | 'tuning' | 'active' | 'reflection';

function App() {
  const [state, setState] = useState<SessionState>('idle');
  const [chaos, setChaos] = useState(0);
  const [calmTime, setCalmTime] = useState(0);
  const [physics, setPhysics] = useState({
    color: "#60a5fa", emissive: "#1d4ed8", speed: 1.0, baseG: 0, bloom: 1.5
  });

  // 1. Chaos Decay Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setChaos((prev) => Math.max(0, prev - 0.02));
      if (chaos < 0.1 && state === 'active') {
        setCalmTime((prev) => prev + 0.1);
      }
    }, 100);
    return () => clearInterval(timer);
  }, [chaos, state]);

  // 2. Device Orientation (The Mobile Hook)
  useEffect(() => {
    const handleMotion = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity;
      if (acc) {
        const totalMotion = Math.abs(acc.x || 0) + Math.abs(acc.y || 0);
        if (totalMotion > 15) setChaos((prev) => Math.min(1, prev + 0.2));
      }
    };
    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, []);

  const handleVibeSubmit = async (vibe: string) => {
    setState('tuning');
    const aiData = await getVibePhysics(vibe);
    if (aiData) setPhysics(aiData);
    setState('active');
  };

  const handleInteraction = useCallback(() => {
    if (state === 'active') setChaos((prev) => Math.min(1, prev + 0.05));
  }, [state]);

  return (
    <main className="fixed inset-0 bg-black overflow-hidden font-sans" onClick={handleInteraction}>
      <div className="absolute inset-0 z-0">
        <Canvas shadows camera={{ position: [0, 0, 8], fov: 35 }}>
          <color attach="background" args={['#000000']} />
          <Suspense fallback={null}>
            <Physics gravity={[0, 0, 0]}>
              <Experience physics={physics} chaos={chaos} state={state} />
            </Physics>
            <EffectComposer>
              <Bloom intensity={physics.bloom + (chaos * 2)} luminanceThreshold={0.2} mipmapBlur />
              <ChromaticAberration offset={[0.001 * chaos, 0.001 * chaos]} />
              <Noise opacity={0.04 + (chaos * 0.1)} />
              <Vignette eskil={false} offset={0.1} darkness={1.1} />
            </EffectComposer>
          </Suspense>
        </Canvas>
      </div>
      <Interface 
        state={state}
        setState={setState}
        chaos={chaos}
        calmTime={Math.floor(calmTime)}
        onVibeSubmit={handleVibeSubmit}
      />
    </main>
  );
}

export default App;