'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface NodeClusterProps {
  center: THREE.Vector3;
  particleCount?: number;
  dimmed?: boolean;
  parting?: boolean; // Particles spread outward during fly-in
}

export function NodeCluster({ center, particleCount = 80, dimmed = false, parting = false }: NodeClusterProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const partingProgress = useRef(0);

  const { basePositions, offsets } = useMemo(() => {
    const basePositions = new Float32Array(particleCount * 3);
    const offsets = new Float32Array(particleCount * 3); // Parting direction per particle
    for (let i = 0; i < particleCount; i++) {
      const r = (Math.random() + Math.random() + Math.random()) / 3 * 1.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const dx = r * Math.sin(phi) * Math.cos(theta);
      const dy = r * Math.sin(phi) * Math.sin(theta);
      const dz = r * Math.cos(phi);
      basePositions[i * 3]     = center.x + dx;
      basePositions[i * 3 + 1] = center.y + dy;
      basePositions[i * 3 + 2] = center.z + dz;
      // Parting direction: radially outward from center, amplified
      const len = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
      offsets[i * 3]     = (dx / len) * 4;
      offsets[i * 3 + 1] = (dy / len) * 4;
      offsets[i * 3 + 2] = (dz / len) * 4;
    }
    return { basePositions, offsets };
  }, [center, particleCount]);

  const positions = useMemo(() => new Float32Array(basePositions), [basePositions]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const time = clock.getElapsedTime();
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;

    // Animate parting progress
    const targetParting = parting ? 1 : 0;
    partingProgress.current += (targetParting - partingProgress.current) * 0.05;
    const p = partingProgress.current;

    for (let i = 0; i < particleCount; i++) {
      const offset = i * 0.1;
      pos[i * 3]     = basePositions[i * 3]     + offsets[i * 3]     * p + Math.sin(time * 0.5 + offset) * 0.002;
      pos[i * 3 + 1] = basePositions[i * 3 + 1] + offsets[i * 3 + 1] * p + Math.cos(time * 0.3 + offset) * 0.002;
      pos[i * 3 + 2] = basePositions[i * 3 + 2] + offsets[i * 3 + 2] * p + Math.sin(time * 0.4 + offset) * 0.001;
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
        opacity={dimmed ? 0.1 : parting ? 0.3 : 0.6}
        depthWrite={false}
      />
    </points>
  );
}
