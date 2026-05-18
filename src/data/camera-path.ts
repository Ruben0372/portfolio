import * as THREE from 'three';
import { topologyNodes } from './topology';
import { toWorld } from '@/lib/three-utils';

export interface CameraKeyframe {
  scroll: number;
  position: THREE.Vector3;
  lookAt: THREE.Vector3;
}

const nodePositions = topologyNodes.map(toWorld);
const centerOfTopology = new THREE.Vector3(0, 0, 0);

export const cameraKeyframes: CameraKeyframe[] = [
  { scroll: 0.00, position: new THREE.Vector3(0, 0, 2),   lookAt: new THREE.Vector3(0, 0, 0) },
  { scroll: 0.15, position: new THREE.Vector3(0, 0, 2),   lookAt: new THREE.Vector3(0, 0, 0) },
  { scroll: 0.16, position: new THREE.Vector3(0, 2, 25),  lookAt: centerOfTopology.clone() },
  { scroll: 0.30, position: new THREE.Vector3(5, 3, 25),  lookAt: centerOfTopology.clone() },
  ...topologyNodes.map((_, i) => {
    const scrollAt = 0.30 + (i / 6) * 0.35 + 0.02;
    const pos = nodePositions[i].clone();
    return {
      scroll: scrollAt,
      position: new THREE.Vector3(pos.x + 2, pos.y + 1, 8),
      lookAt: pos.clone(),
    };
  }),
  { scroll: 0.65, position: new THREE.Vector3(-8, 5, 22), lookAt: centerOfTopology.clone() },
  { scroll: 0.80, position: new THREE.Vector3(-10, 4, 20), lookAt: centerOfTopology.clone() },
  { scroll: 0.80, position: new THREE.Vector3(-10, 4, 20), lookAt: centerOfTopology.clone() },
  { scroll: 0.90, position: new THREE.Vector3(8, -2, 18), lookAt: centerOfTopology.clone() },
  { scroll: 0.90, position: new THREE.Vector3(8, -2, 18), lookAt: new THREE.Vector3(0, 0, 0) },
  { scroll: 1.00, position: new THREE.Vector3(0, 0, 2),   lookAt: new THREE.Vector3(0, 0, 0) },
];
