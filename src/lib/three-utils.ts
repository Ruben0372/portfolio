// src/lib/three-utils.ts
import * as THREE from 'three';
import type { TopologyNode } from '@/data/topology';

export function toWorld(node: TopologyNode): THREE.Vector3 {
  const x = ((node.position.x / 100) - 0.5) * 30;
  const y = ((0.5 - node.position.y / 100)) * 16;
  return new THREE.Vector3(x, y, 0);
}

export function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

/** Quintic ease-in-out — dramatic slow start and slow end for cinematic camera */
export function easeInOut(t: number): number {
  const c = clamp(t, 0, 1);
  return c < 0.5
    ? 16 * c * c * c * c * c
    : 1 - Math.pow(-2 * c + 2, 5) / 2;
}
