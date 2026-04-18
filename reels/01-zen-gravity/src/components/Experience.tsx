import { useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import Particles from "./Particles";

const Experience = ({ physics, isPlaying }: { physics: any; isPlaying: boolean }) => {
  const [scrollGravity, setScrollGravity] = useState(0.5);

  useFrame((state) => {
    const targetZ = isPlaying ? 5.5 : 8;
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.05);

    const core = state.scene.getObjectByName("central-core");
    if (core) {
      const breathe = Math.sin(state.clock.elapsedTime * 1.5) * 0.05 + 1;
      core.scale.set(breathe, breathe, breathe);
    }
  });

  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      setScrollGravity(prev => Math.max(-2, Math.min(2, prev + e.deltaY * 0.005)));
    };
    window.addEventListener("wheel", handleScroll);
    return () => window.removeEventListener("wheel", handleScroll);
  }, []);

  return (
    <>
      <Environment preset="city" />
      <ambientLight intensity={0.5} />
      <mesh name="central-core">
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial 
          color={physics.color} 
          emissive={physics.emissive} 
          emissiveIntensity={12} 
          toneMapped={false} 
        />
      </mesh>
      <Particles gravity={(scrollGravity * physics.speed) + physics.baseG} color={physics.color} />
      <ContactShadows position={[0, -3.5, 0]} opacity={0.4} scale={20} blur={2.5} />
    </>
  );
};

export default Experience;