// src/lib/scroll-store.ts
import { create } from 'zustand';
import * as THREE from 'three';

export const ROOM_COUNT = 6;

export interface RoomKeyframe {
  position: THREE.Vector3;
  lookAt: THREE.Vector3;
  label: string;
}

export const roomKeyframes: RoomKeyframe[] = [
  { position: new THREE.Vector3(0, 0, 2),    lookAt: new THREE.Vector3(0, 0, 0), label: 'Hero' },
  { position: new THREE.Vector3(0, 2, 25),   lookAt: new THREE.Vector3(0, 0, 0), label: 'About' },
  { position: new THREE.Vector3(5, 3, 25),   lookAt: new THREE.Vector3(0, 0, 0), label: 'Topology' },
  { position: new THREE.Vector3(-8, 5, 22),  lookAt: new THREE.Vector3(0, 0, 0), label: 'Projects' },
  { position: new THREE.Vector3(8, -2, 18),  lookAt: new THREE.Vector3(0, 0, 0), label: 'Tech Stack' },
  { position: new THREE.Vector3(0, 0, 2),    lookAt: new THREE.Vector3(0, 0, 0), label: 'Contact' },
];

interface StoreState {
  // Overview navigation
  roomIndex: number;
  transitioning: boolean;

  // Cluster room mode
  insideCluster: string | null;
  enteringCluster: string | null;
  exitingCluster: boolean;

  // Cluster target (for camera fly-in)
  clusterTarget: THREE.Vector3 | null;

  // Portal (project/blog navigation)
  portalTarget: string | null;

  // Actions
  goToRoom: (index: number) => void;
  nextRoom: () => void;
  prevRoom: () => void;
  enterCluster: (nodeId: string, worldPos: THREE.Vector3) => void;
  exitCluster: () => void;
  finishEnterCluster: () => void;
  finishExitCluster: () => void;
  finishTransition: () => void;
  startPortal: (target: string) => void;
  clearPortal: () => void;
}

export const useStore = create<StoreState>((set, get) => ({
  roomIndex: 0,
  transitioning: false,
  insideCluster: null,
  enteringCluster: null,
  exitingCluster: false,
  clusterTarget: null,
  portalTarget: null,

  goToRoom: (index) => {
    const clamped = Math.max(0, Math.min(ROOM_COUNT - 1, index));
    if (clamped === get().roomIndex && !get().transitioning) return;
    set({ roomIndex: clamped, transitioning: true });
  },
  nextRoom: () => {
    const { roomIndex, transitioning, insideCluster } = get();
    if (transitioning || insideCluster) return;
    if (roomIndex < ROOM_COUNT - 1) set({ roomIndex: roomIndex + 1, transitioning: true });
  },
  prevRoom: () => {
    const { roomIndex, transitioning, insideCluster } = get();
    if (transitioning || insideCluster) return;
    if (roomIndex > 0) set({ roomIndex: roomIndex - 1, transitioning: true });
  },
  enterCluster: (nodeId, worldPos) => {
    if (get().transitioning || get().insideCluster) return;
    set({ enteringCluster: nodeId, clusterTarget: worldPos, transitioning: true });
  },
  finishEnterCluster: () => {
    const { enteringCluster } = get();
    set({ insideCluster: enteringCluster, enteringCluster: null, transitioning: false });
  },
  exitCluster: () => {
    if (get().exitingCluster) return;
    set({ exitingCluster: true, insideCluster: null, transitioning: true });
  },
  finishExitCluster: () => {
    set({ exitingCluster: false, clusterTarget: null, transitioning: false });
  },
  finishTransition: () => set({ transitioning: false }),
  startPortal: (target) => set({ portalTarget: target }),
  clearPortal: () => set({ portalTarget: null }),
}));
