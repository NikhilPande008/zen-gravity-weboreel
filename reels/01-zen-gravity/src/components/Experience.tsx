import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

interface ExperienceProps {
  physics: any;
  chaos: number;
  state: string;
}

export default function Experience({ physics, chaos }: ExperienceProps) {
  const coreRef = useRef<THREE.Mesh>(null);
  
  // Breathing LFO (Low Frequency Oscillator)
  useFrame(({ clock }) => {
    if (coreRef.current) {
      const breathe = 1 + Math.sin(clock.elapsedTime * 1.2) * 0.05;
      const chaosScale = 1 + (chaos * 0.4);
      coreRef.current.scale.setScalar(breathe * chaosScale);
      
      // Jitter during chaos
      if (chaos > 0.5) {
        coreRef.current.position.x = Math.sin(clock.getElapsedTime() * 20) * 0.02 * chaos;
      } else {
        coreRef.current.position.x = 0;
      }
    }
  });

  return (
    <>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} color={physics.color} />
      
      <Float speed={2 * (1 + chaos)} rotationIntensity={1} floatIntensity={2}>
        <Sphere ref={coreRef} args={[1, 64, 64]}>
          <meshStandardMaterial 
            color={physics.color}
            emissive={physics.emissive}
            emissiveIntensity={2 + (chaos * 5)}
            toneMapped={false}
          />
        </Sphere>
      </Float>

      {/* Dynamic Obstacles (Mental Noise) spawned during chaos */}
      {chaos > 0.6 && (
        <group>
          {[...Array(3)].map((_, i) => (
            <Sphere key={i} position={[(i - 1) * 3, Math.sin(i), 0]} args={[0.2, 16, 16]}>
              <meshBasicMaterial color="white" transparent opacity={0.2 * chaos} />
            </Sphere>
          ))}
        </group>
      )}
    </>
  );
}