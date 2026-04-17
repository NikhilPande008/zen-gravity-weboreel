import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { InstancedRigidBodies, RapierRigidBody } from "@react-three/rapier";
import * as THREE from "three";

const COUNT = 600; // Optimized for M5 performance

const Particles = ({ gravity, color }: { gravity: number, color: string }) => {
  const rigidBodies = useRef<RapierRigidBody[]>(null);

  const instances = useMemo(() => {
    const instances = [];
    for (let i = 0; i < COUNT; i++) {
      instances.push({
        key: "instance_" + i,
        position: [(Math.random() - 0.5) * 12, (Math.random() - 0.5) * 12, (Math.random() - 0.5) * 12] as [number, number, number],
        rotation: [Math.random(), Math.random(), Math.random()] as [number, number, number],
      });
    }
    return instances;
  }, []);

  useFrame((state) => {
    if (!rigidBodies.current) return;
  
    rigidBodies.current.forEach((api) => {
      const currentPos = api.translation();
      const vec = new THREE.Vector3(currentPos.x, currentPos.y, currentPos.z);
      
      // Gravity toward/away from center
      const dir = vec.clone().normalize().negate();
      api.applyImpulse(dir.multiplyScalar(gravity * 0.02), true);
  
      // Mouse interaction
      const mouseVec = new THREE.Vector3(state.mouse.x * 7, state.mouse.y * 7, 0);
      const dist = vec.distanceTo(mouseVec);
      if (dist < 2.5) {
        const mouseDir = new THREE.Vector3().subVectors(mouseVec, vec).normalize();
        api.applyImpulse(mouseDir.multiplyScalar((2.5 - dist) * 0.04), true);
      }

      // Drag/Friction to keep things smooth
      const vel = api.linvel();
      api.setLinvel({ x: vel.x * 0.96, y: vel.y * 0.96, z: vel.z * 0.96 }, true);
    });
  });

  return (
    <InstancedRigidBodies ref={rigidBodies} instances={instances} colliders="ball">
      <instancedMesh args={[undefined, undefined, COUNT]} castShadow>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} toneMapped={false} />
      </instancedMesh>
    </InstancedRigidBodies>
  );
};

export default Particles;