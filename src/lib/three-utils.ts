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

/** Smooth ease-in-out for camera transitions */
export function easeInOut(t: number): number {
  const c = clamp(t, 0, 1);
  return c * c * (3 - 2 * c);
}
