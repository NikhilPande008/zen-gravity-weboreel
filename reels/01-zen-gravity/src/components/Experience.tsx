import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Float, Stars } from '@react-three/drei';
import * as THREE from 'three';
import type { WeboreelTheme } from '../theme';

interface ExperienceProps {
  chaos: number;
  theme: WeboreelTheme; // Match what App.tsx is sending
}

export default function Experience({ chaos, theme }: ExperienceProps) {
  const coreRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (coreRef.current) {
      // 1. Breathing LFO: Sin wave for steady expansion/contraction
      const breathe = 1 + Math.sin(clock.elapsedTime * 1.2) * 0.05;
      
      // 2. Chaos Scaling: Expand core as chaos increases
      const chaosScale = 1 + (chaos * 0.8);
      coreRef.current.scale.setScalar(breathe * chaosScale);
      
      // 3. Jitter: High-frequency shake during high entropy
      if (chaos > 0.5) {
        coreRef.current.position.x = Math.sin(clock.getElapsedTime() * 30) * 0.03 * chaos;
        coreRef.current.position.y = Math.cos(clock.getElapsedTime() * 30) * 0.03 * chaos;
      } else {
        coreRef.current.position.set(0, 0, 0);
      }
    }
  });

  return (
    <>
      {/* Background stars reactive to theme colors */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color={theme.colors.primary} />
      
      <Float speed={2 * (1 + chaos)} rotationIntensity={1} floatIntensity={2}>
        <Sphere ref={coreRef} args={[1, 64, 64]}>
          <meshStandardMaterial 
            color={theme.colors.primary}
            emissive={theme.colors.secondary}
            emissiveIntensity={2 + (chaos * 8)}
            toneMapped={false}
          />
        </Sphere>
      </Float>

      {/* Dynamic Noise Obstacles (Mental Noise) */}
      {chaos > 0.4 && (
        <group>
          {[...Array(3)].map((_, i) => (
            <Sphere key={i} position={[(i - 1) * 3, Math.sin(i + chaos), 0]} args={[0.15, 16, 16]}>
              <meshBasicMaterial color="white" transparent opacity={0.1 * chaos} />
            </Sphere>
          ))}
        </group>
      )}
    </>
  );
}