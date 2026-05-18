'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PortalRingProps {
  center: THREE.Vector3;
  visible: boolean;
  hovered: boolean;
}

export function PortalRing({ center, visible, hovered }: PortalRingProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    meshRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.3) * 0.1;
    meshRef.current.rotation.z = t * 0.1;
    const scale = 1 + Math.sin(t * 0.8) * 0.05;
    meshRef.current.scale.setScalar(scale);
  });

  if (!visible) return null;

  return (
    <mesh ref={meshRef} position={center}>
      <torusGeometry args={[1.4, 0.015, 16, 64]} />
      <meshBasicMaterial
        color={hovered ? '#f5c542' : '#ffffff'}
        transparent
        opacity={hovered ? 0.5 : 0.2}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
