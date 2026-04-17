import { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import * as THREE from 'three';
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import Experience from './components/Experience';
import Interface from './components/Interface';

function App() {
  const [vibe, setVibe] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <main className="fixed inset-0 w-screen h-screen bg-black overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Canvas
          shadows
          camera={{ position: [0, 0, 8], fov: 35 }}
          dpr={[1, 2]}
          style={{ width: '100vw', height: '100vh' }}
        >
          <color attach="background" args={['#000000']} />
          <Suspense fallback={null}>
            <Physics gravity={[0, 0, 0]}> 
              <Experience vibe={vibe} isPlaying={isPlaying} />
            </Physics>
            <EffectComposer>
              <Bloom intensity={1.5} luminanceThreshold={0.2} mipmapBlur />
              <ChromaticAberration offset={new THREE.Vector2(0.001, 0.001)} />
              <Noise opacity={0.04} />
              <Vignette offset={0.1} darkness={1.1} />
            </EffectComposer>
          </Suspense>
        </Canvas>
      </div>
      <div className="relative z-50 w-full h-full pointer-events-none">
        <Interface vibe={vibe} setVibe={setVibe} setIsPlaying={setIsPlaying} />
      </div>
    </main>
  );
}

export default App;