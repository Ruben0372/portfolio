import * as THREE from 'three';
import type { TopologyNode } from '@/data/topology';

export function toWorld(node: TopologyNode): THREE.Vector3 {
  const x = ((node.position.x / 100) - 0.5) * 30;
  const y = ((0.5 - node.position.y / 100)) * 16;
  const z = 0;
  return new THREE.Vector3(x, y, z);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

export function panelOpacity(scroll: number, enter: number, exit: number, fade = 0.015): number {
  const fadeIn = smoothstep(enter - fade, enter + fade, scroll);
  const fadeOut = 1 - smoothstep(exit - fade, exit + fade, scroll);
  return fadeIn * fadeOut;
}

export function activeNodeIndex(scroll: number): number {
  if (scroll < 0.30 || scroll >= 0.65) return -1;
  const t = (scroll - 0.30) / 0.35;
  return Math.min(5, Math.floor(t * 6));
}
