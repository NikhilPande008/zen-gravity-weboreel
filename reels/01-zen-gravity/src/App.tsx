import { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import * as THREE from 'three';
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import Experience from './components/Experience';
import Interface from './components/Interface';
import { getVibePhysics } from './utils/ai-agent';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [vibeHistory, setVibeHistory] = useState<string[]>([]);
  const [physics, setPhysics] = useState({
    color: "#60a5fa",
    emissive: "#1d4ed8",
    speed: 1.0,
    baseG: 0.5,
    bloom: 1.5
  });

  const handleVibeChange = async (newVibe: string) => {
    setVibeHistory((prev) => [newVibe, ...prev].slice(0, 5));
    const aiData = await getVibePhysics(newVibe);
    if (aiData) setPhysics(aiData);
  };

  return (
    <main className="fixed inset-0 w-screen h-screen bg-black overflow-hidden font-sans">
      <div className="absolute inset-0 z-0">
        <Canvas shadows camera={{ position: [0, 0, 8], fov: 35 }} dpr={[1, 2]}>
          <color attach="background" args={['#000000']} />
          <Suspense fallback={null}>
            <Physics gravity={[0, 0, 0]}> 
              <Experience physics={physics} isPlaying={isPlaying} />
            </Physics>
            <EffectComposer>
              <Bloom intensity={physics.bloom} luminanceThreshold={0.2} mipmapBlur />
              <ChromaticAberration offset={new THREE.Vector2(0.001, 0.001)} />
              <Noise opacity={0.04} />
              <Vignette offset={0.1} darkness={1.1} />
            </EffectComposer>
          </Suspense>
        </Canvas>
      </div>
      <div className="relative z-50 w-full h-full pointer-events-none">
        <Interface 
          onVibeSubmit={handleVibeChange} 
          setIsPlaying={setIsPlaying} 
          vibeHistory={vibeHistory}
        />
      </div>
    </main>
  );
}

export default App;