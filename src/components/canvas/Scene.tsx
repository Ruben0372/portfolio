'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useCallback, useRef } from 'react';
import { Camera } from './Camera';
import { DustField } from './DustField';
import { Supernova } from './Supernova';
import { TopologyCloud } from './TopologyCloud';
import { PostProcessing } from './PostProcessing';
import { HeroOverlay } from '../overlay/HeroOverlay';
import { AboutOverlay } from '../overlay/AboutOverlay';
import { ProjectsOverlay } from '../overlay/ProjectsOverlay';
import { TechOverlay } from '../overlay/TechOverlay';
import { ContactOverlay } from '../overlay/ContactOverlay';
import { ClusterRoom } from '../overlay/ClusterRoom';
import { PortalTransition } from '../overlay/PortalTransition';
import { useStore } from '@/lib/scroll-store';

function WheelHandler() {
  const lastScrollTime = useRef(0);
  const DEBOUNCE_MS = 800;

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const now = Date.now();
    if (now - lastScrollTime.current < DEBOUNCE_MS) return;

    const { transitioning, insideCluster } = useStore.getState();
    if (transitioning || insideCluster) return;

    lastScrollTime.current = now;
    if (e.deltaY > 0) {
      useStore.getState().nextRoom();
    } else if (e.deltaY < 0) {
      useStore.getState().prevRoom();
    }
  }, []);

  useEffect(() => {
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  return null;
}

export function Scene() {
  return (
    <>
      <WheelHandler />
      <Canvas
        camera={{ fov: 60, near: 0.1, far: 200, position: [0, 0, 2] }}
        style={{ position: 'fixed', inset: 0, zIndex: 0 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 1.5]}
        role="img"
        aria-label="Interactive 3D visualization of the Atlax tunnel system architecture"
      >
        <color attach="background" args={['#050508']} />
        <Suspense fallback={null}>
          <Camera />
          <DustField />
          <Supernova />
          <TopologyCloud />
          <PostProcessing />
        </Suspense>
      </Canvas>
      <HeroOverlay />
      <AboutOverlay />
      <ProjectsOverlay />
      <TechOverlay />
      <ContactOverlay />
      <ClusterRoom />
      <PortalTransition />
    </>
  );
}
