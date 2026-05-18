'use client';

import { Canvas } from '@react-three/fiber';
import { ScrollControls } from '@react-three/drei';
import { Suspense } from 'react';
import { Camera } from './Camera';
import { DustField } from './DustField';
import { Supernova } from './Supernova';
import { TopologyCloud } from './TopologyCloud';
import { PostProcessing } from './PostProcessing';
import { HeroOverlay } from '../overlay/HeroOverlay';
import { AboutOverlay } from '../overlay/AboutOverlay';
import { NodeOverlay } from '../overlay/NodeOverlay';
import { ProjectsOverlay } from '../overlay/ProjectsOverlay';
import { TechOverlay } from '../overlay/TechOverlay';
import { ContactOverlay } from '../overlay/ContactOverlay';
import { PortalTransition } from '../overlay/PortalTransition';

export function Scene() {
  return (
    <>
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
          <ScrollControls pages={8} damping={0.15}>
            <Camera />
            <DustField />
            <Supernova />
            <TopologyCloud />
          </ScrollControls>
          <PostProcessing />
        </Suspense>
      </Canvas>
      {/* Overlays are regular DOM elements positioned via CSS, synced to scroll store */}
      <HeroOverlay />
      <AboutOverlay />
      <NodeOverlay />
      <ProjectsOverlay />
      <TechOverlay />
      <ContactOverlay />
      <PortalTransition />
    </>
  );
}
