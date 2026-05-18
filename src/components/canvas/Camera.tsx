'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore, roomKeyframes } from '@/lib/scroll-store';
import { easeInOut } from '@/lib/three-utils';

const TRANSITION_SPEED = 0.04; // ~1.2s at 60fps
const CLUSTER_FLY_SPEED = 0.03; // ~1.5s

export function Camera() {
  const { camera } = useThree();
  const progress = useRef(0); // 0→1 animation progress
  const fromPos = useRef(new THREE.Vector3(0, 0, 2));
  const fromLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const prevRoomIndex = useRef(0);
  const prevClusterState = useRef<string | null>(null);

  useFrame(() => {
    const state = useStore.getState();
    const { roomIndex, transitioning, enteringCluster, exitingCluster, clusterTarget } = state;

    // Detect new transition triggers
    if (roomIndex !== prevRoomIndex.current && !enteringCluster && !exitingCluster) {
      fromPos.current.copy(camera.position);
      fromLookAt.current.set(0, 0, 0); // All rooms look at origin
      prevRoomIndex.current = roomIndex;
      progress.current = 0;
    }

    if (enteringCluster && enteringCluster !== prevClusterState.current) {
      fromPos.current.copy(camera.position);
      prevClusterState.current = enteringCluster;
      progress.current = 0;
    }

    if (exitingCluster && prevClusterState.current !== '__exiting__') {
      fromPos.current.copy(camera.position);
      prevClusterState.current = '__exiting__';
      progress.current = 0;
    }

    // Determine target
    let targetPos: THREE.Vector3;
    let targetLookAt: THREE.Vector3;
    let speed: number;

    if (enteringCluster && clusterTarget) {
      // Flying into cluster
      targetPos = clusterTarget.clone().add(new THREE.Vector3(0, 0.5, 3));
      targetLookAt = clusterTarget.clone();
      speed = CLUSTER_FLY_SPEED;
    } else if (exitingCluster) {
      // Flying back to topology overview
      const kf = roomKeyframes[2]; // Topology overview room
      targetPos = kf.position.clone();
      targetLookAt = kf.lookAt.clone();
      speed = CLUSTER_FLY_SPEED;
    } else {
      // Normal room transition
      const kf = roomKeyframes[roomIndex];
      targetPos = kf.position.clone();
      targetLookAt = kf.lookAt.clone();
      speed = TRANSITION_SPEED;
    }

    // Animate
    if (transitioning) {
      progress.current = Math.min(1, progress.current + speed);
      const t = easeInOut(progress.current);

      camera.position.lerpVectors(fromPos.current, targetPos, t);
      const currentLookAt = new THREE.Vector3().lerpVectors(fromLookAt.current, targetLookAt, t);
      camera.lookAt(currentLookAt);

      if (progress.current >= 1) {
        if (enteringCluster) {
          state.finishEnterCluster();
          prevClusterState.current = null;
        } else if (exitingCluster) {
          state.finishExitCluster();
          prevClusterState.current = null;
        } else {
          state.finishTransition();
        }
      }
    } else {
      // Idle: hold position with gentle lerp for smoothness
      const kf = roomKeyframes[roomIndex];
      camera.position.lerp(kf.position, 0.05);
      camera.lookAt(kf.lookAt);
    }
  });

  return null;
}
