'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface NodeClusterProps {
  center: THREE.Vector3;
  particleCount?: number;
  dimmed?: boolean;
}

export function NodeCluster({ center, particleCount = 80, dimmed = false }: NodeClusterProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const r = (Math.random() + Math.random() + Math.random()) / 3 * 1.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3]     = center.x + r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = center.y + r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = center.z + r * Math.cos(phi);
    }
    return arr;
  }, [center, particleCount]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const time = clock.getElapsedTime();
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < particleCount; i++) {
      const offset = i * 0.1;
      pos[i * 3]     += Math.sin(time * 0.5 + offset) * 0.002;
      pos[i * 3 + 1] += Math.cos(time * 0.3 + offset) * 0.002;
      pos[i * 3 + 2] += Math.sin(time * 0.4 + offset) * 0.001;
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
        size={0.08}
        sizeAttenuation
        transparent
        opacity={dimmed ? 0.15 : 0.6}
        depthWrite={false}
      />
    </points>
  );
}
