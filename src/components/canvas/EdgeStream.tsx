'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface EdgeStreamProps {
  from: THREE.Vector3;
  to: THREE.Vector3;
  particleCount?: number;
  active?: boolean;
}

export function EdgeStream({ from, to, particleCount = 30, active = false }: EdgeStreamProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, offsets } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const offsets = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      offsets[i] = Math.random();
      const t = offsets[i];
      positions[i * 3]     = from.x + (to.x - from.x) * t;
      positions[i * 3 + 1] = from.y + (to.y - from.y) * t;
      positions[i * 3 + 2] = from.z + (to.z - from.z) * t;
    }
    return { positions, offsets };
  }, [from, to, particleCount]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const speed = 0.15;
    const dt = clock.getDelta();

    for (let i = 0; i < particleCount; i++) {
      offsets[i] = (offsets[i] + dt * speed) % 1;
      const t = offsets[i];
      const mid = new THREE.Vector3().lerpVectors(from, to, 0.5);
      mid.y += 0.5;
      const oneMinusT = 1 - t;
      pos[i * 3]     = oneMinusT * oneMinusT * from.x + 2 * oneMinusT * t * mid.x + t * t * to.x;
      pos[i * 3 + 1] = oneMinusT * oneMinusT * from.y + 2 * oneMinusT * t * mid.y + t * t * to.y;
      pos[i * 3 + 2] = oneMinusT * oneMinusT * from.z + 2 * oneMinusT * t * mid.z + t * t * to.z;
      pos[i * 3]     += (Math.random() - 0.5) * 0.02;
      pos[i * 3 + 1] += (Math.random() - 0.5) * 0.02;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#ffffff"
        size={0.04}
        sizeAttenuation
        transparent
        opacity={active ? 0.35 : 0.1}
        depthWrite={false}
      />
    </points>
  );
}
