'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import * as THREE from 'three';
import { cameraKeyframes } from '@/data/camera-path';
import { useScrollStore } from '@/lib/scroll-store';
import { clamp } from '@/lib/three-utils';

function interpolateKeyframes(scroll: number, out: { position: THREE.Vector3; lookAt: THREE.Vector3 }) {
  const s = clamp(scroll, 0, 1);
  let lower = cameraKeyframes[0];
  let upper = cameraKeyframes[cameraKeyframes.length - 1];
  for (let i = 0; i < cameraKeyframes.length - 1; i++) {
    if (s >= cameraKeyframes[i].scroll && s <= cameraKeyframes[i + 1].scroll) {
      lower = cameraKeyframes[i];
      upper = cameraKeyframes[i + 1];
      break;
    }
  }
  const range = upper.scroll - lower.scroll;
  const t = range > 0 ? (s - lower.scroll) / range : 0;
  const smoothT = t * t * (3 - 2 * t);
  out.position.lerpVectors(lower.position, upper.position, smoothT);
  out.lookAt.lerpVectors(lower.lookAt, upper.lookAt, smoothT);
}

export function Camera() {
  const scroll = useScroll();
  const { camera } = useThree();
  const target = useRef({ position: new THREE.Vector3(), lookAt: new THREE.Vector3() });

  useFrame(() => {
    const s = scroll.offset;
    useScrollStore.getState().setScroll(s);
    interpolateKeyframes(s, target.current);
    camera.position.lerp(target.current.position, 0.08);
    camera.lookAt(target.current.lookAt);
  });

  return null;
}
