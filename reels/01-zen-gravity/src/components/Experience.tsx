import { useState, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import Particles from "./Particles";

const Experience = ({ vibe, isPlaying }: { vibe: string; isPlaying: boolean }) => {
  const [scrollGravity, setScrollGravity] = useState(0.5);

  const config = useMemo(() => {
    const v = vibe.toLowerCase();
    if (v.includes("fire") || v.includes("chaos")) 
      return { color: "#ff4d00", emissive: "#ff0000", speed: 2.5, baseG: -1.2 };
    if (v.includes("ice") || v.includes("cold") || v.includes("zen")) 
      return { color: "#00f2ff", emissive: "#0066ff", speed: 0.3, baseG: 0.1 };
    return { color: "#60a5fa", emissive: "#1d4ed8", speed: 1.0, baseG: 0.5 };
  }, [vibe]);

  useFrame((state) => {
    // This is the Glide Logic
    const targetZ = isPlaying ? 5.5 : 8;
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.03);

    // Central core breathing
    const breathe = Math.sin(state.clock.elapsedTime * 1.5) * 0.05 + 1;
    const core = state.scene.getObjectByName("central-core");
    if (core) core.scale.set(breathe, breathe, breathe);
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
        <meshStandardMaterial color={config.color} emissive={config.emissive} emissiveIntensity={12} toneMapped={false} />
      </mesh>
      <Particles gravity={(scrollGravity * config.speed) + config.baseG} color={config.color} />
      <ContactShadows position={[0, -3.5, 0]} opacity={0.4} scale={20} blur={2.5} />
    </>
  );
};

export default Experience;