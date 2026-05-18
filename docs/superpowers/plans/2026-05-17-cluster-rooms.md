# Portfolio v2.2 Cluster Rooms — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add explorable cluster rooms with snap-scroll navigation, clickable portals, fly-in/fly-out camera, and polished supernova animation.

**Architecture:** Replace drei ScrollControls with a custom wheel-driven snap-scroll system. Each scroll gesture advances one room. Clicking a topology node triggers a cinematic fly-in to a full-screen content room. Camera transitions are lerp-based animations controlled by room index and cluster mode state in zustand.

**Tech Stack:** React Three Fiber, drei (Html removed), Three.js, zustand, Tailwind 4

**Spec:** `docs/superpowers/specs/2026-05-17-cluster-rooms-design.md`

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `src/lib/scroll-store.ts` | Rewrite | Room-index + cluster-mode state |
| `src/lib/three-utils.ts` | Modify | Remove scroll utils, add easeInOut |
| `src/data/cluster-rooms.ts` | Create | Per-node room content |
| `src/data/camera-path.ts` | Rewrite | Room keyframes (not scroll-based) |
| `src/components/canvas/Camera.tsx` | Rewrite | Room-index lerp + cluster fly-in |
| `src/components/canvas/Scene.tsx` | Rewrite | Remove ScrollControls, add wheel handler |
| `src/components/canvas/Supernova.tsx` | Rewrite | Organic orbital shader |
| `src/components/canvas/NodeCluster.tsx` | Modify | Add hover/click/parting |
| `src/components/canvas/TopologyCloud.tsx` | Modify | Click handlers, cluster state |
| `src/components/canvas/PortalRing.tsx` | Create | Glowing torus around clusters |
| `src/components/overlay/HudPanel.tsx` | Rewrite | Room-index based visibility |
| `src/components/overlay/ClusterRoom.tsx` | Create | Full-screen room interior |
| `src/components/overlay/HeroOverlay.tsx` | Modify | Use roomIndex |
| `src/components/overlay/AboutOverlay.tsx` | Modify | Use roomIndex |
| `src/components/overlay/ProjectsOverlay.tsx` | Modify | Use roomIndex |
| `src/components/overlay/TechOverlay.tsx` | Modify | Use roomIndex |
| `src/components/overlay/ContactOverlay.tsx` | Modify | Use roomIndex |
| `src/components/overlay/NodeOverlay.tsx` | Delete | Replaced by ClusterRoom |

---

### Task 1: Rewrite Scroll Store

**Files:**
- Rewrite: `src/lib/scroll-store.ts`

- [ ] **Step 1: Replace scroll-store with room-index + cluster-mode state**

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/scroll-store.ts
git commit -m "feat: rewrite scroll store with room-index and cluster-mode state"
```

---

### Task 2: Update Utilities + Create Cluster Room Data

**Files:**
- Rewrite: `src/lib/three-utils.ts`
- Create: `src/data/cluster-rooms.ts`
- Delete: `src/data/camera-path.ts`

- [ ] **Step 1: Simplify three-utils**

```typescript
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
```

- [ ] **Step 2: Create cluster room content data**

```typescript
// src/data/cluster-rooms.ts
import { scrollSections } from './scroll-sections';
import { topologyNodes } from './topology';

export interface ClusterRoomContent {
  nodeId: string;
  title: string;
  narrative: string;
  media?: {
    type: 'diagram' | 'code' | 'image';
    src: string;
    caption: string;
  };
  details: string[];
}

// Map topology nodes to scroll sections by highlightNodes
function findSection(nodeId: string) {
  return scrollSections.find((s) => s.highlightNodes.includes(nodeId));
}

export const clusterRooms: ClusterRoomContent[] = topologyNodes.map((node) => {
  const section = findSection(node.id);
  return {
    nodeId: node.id,
    title: section?.title ?? node.label,
    narrative: section?.body ?? node.publicCopy,
    media: section?.media
      ? { type: section.media.type, src: section.media.src, caption: section.media.alt }
      : undefined,
    details: node.claims,
  };
});

export function getClusterRoom(nodeId: string): ClusterRoomContent | undefined {
  return clusterRooms.find((r) => r.nodeId === nodeId);
}
```

- [ ] **Step 3: Delete old camera-path.ts**

```bash
rm src/data/camera-path.ts
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add cluster room data, simplify utils, remove old camera path"
```

---

### Task 3: Rewrite Camera Controller

**Files:**
- Rewrite: `src/components/canvas/Camera.tsx`

- [ ] **Step 1: Create room-index and cluster-mode camera**

```tsx
// src/components/canvas/Camera.tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/canvas/Camera.tsx
git commit -m "feat: rewrite camera for room-index transitions and cluster fly-in"
```

---

### Task 4: Rewrite Scene (Remove ScrollControls, Add Wheel Handler)

**Files:**
- Rewrite: `src/components/canvas/Scene.tsx`

- [ ] **Step 1: Create Scene with wheel-based snap scroll**

```tsx
// src/components/canvas/Scene.tsx
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
  const DEBOUNCE_MS = 1200;

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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/canvas/Scene.tsx
git commit -m "feat: replace ScrollControls with wheel-based snap scroll"
```

---

### Task 5: Rewrite Supernova (Organic Motion)

**Files:**
- Rewrite: `src/components/canvas/Supernova.tsx`

- [ ] **Step 1: Organic orbital supernova shader**

```tsx
// src/components/canvas/Supernova.tsx
'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore, roomKeyframes } from '@/lib/scroll-store';

const PARTICLE_COUNT = 150;

const vertexShader = `
  uniform float uTime;
  uniform float uIntensity;
  attribute float aBand;
  attribute float aPhase;
  attribute float aSpeed;
  varying float vAlpha;

  void main() {
    float t = uTime * 0.15 * aSpeed;

    // Breathing radius pulse (~4s cycle)
    float breath = 1.0 + sin(uTime * 0.4) * 0.15 * uIntensity;

    // Orbital bands — particles stay in coherent streams
    float bandAngle = aBand * 6.2832 + t * 0.3;
    float elevation = aPhase * 3.1416 - 1.5708;
    float radius = (1.2 + sin(aPhase * 3.0 + t * 0.2) * 0.4) * breath;

    vec3 pos = vec3(
      radius * cos(bandAngle) * cos(elevation),
      radius * sin(elevation) + sin(t * 0.1 + aPhase * 2.0) * 0.1,
      radius * sin(bandAngle) * cos(elevation)
    );

    vAlpha = (0.08 + 0.25 * uIntensity) * (0.6 + 0.4 * sin(t * 0.5 + aPhase * 6.28));

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    float dist = max(-mvPosition.z, 2.0);
    gl_PointSize = (1.5 + 1.0 * uIntensity) * (25.0 / dist);
  }
`;

const fragmentShader = `
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    if (d > 1.0) discard;
    float alpha = (1.0 - d * d) * vAlpha;
    gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
  }
`;

export function Supernova() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const bands = new Float32Array(PARTICLE_COUNT);
    const phases = new Float32Array(PARTICLE_COUNT);
    const speeds = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;
      bands[i] = Math.random();  // Which orbital band
      phases[i] = Math.random(); // Position within band
      speeds[i] = 0.6 + Math.random() * 0.8;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aBand', new THREE.BufferAttribute(bands, 1));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    geo.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));
    return geo;
  }, []);

  useFrame(({ clock }) => {
    if (!materialRef.current) return;
    const { roomIndex, insideCluster } = useStore.getState();

    let intensity = 0.3;
    if (roomIndex === 0 || roomIndex === 5) intensity = 0.8;
    if (roomIndex === 2) intensity = 0.4;
    if (insideCluster) intensity = 0.15;

    materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    materialRef.current.uniforms.uIntensity.value = intensity;
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{ uTime: { value: 0 }, uIntensity: { value: 0.8 } }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/canvas/Supernova.tsx
git commit -m "feat: organic orbital supernova with breathing pulse"
```

---

### Task 6: Update TopologyCloud + NodeCluster (Click + Hover + Parting)

**Files:**
- Modify: `src/components/canvas/NodeCluster.tsx`
- Modify: `src/components/canvas/TopologyCloud.tsx`
- Create: `src/components/canvas/PortalRing.tsx`

- [ ] **Step 1: Add PortalRing component**

```tsx
// src/components/canvas/PortalRing.tsx
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
```

- [ ] **Step 2: Update NodeCluster with parting animation**

Replace `src/components/canvas/NodeCluster.tsx`:

```tsx
// src/components/canvas/NodeCluster.tsx
'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface NodeClusterProps {
  center: THREE.Vector3;
  particleCount?: number;
  dimmed?: boolean;
  parting?: boolean; // Particles spread outward during fly-in
}

export function NodeCluster({ center, particleCount = 80, dimmed = false, parting = false }: NodeClusterProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const partingProgress = useRef(0);

  const { basePositions, offsets } = useMemo(() => {
    const basePositions = new Float32Array(particleCount * 3);
    const offsets = new Float32Array(particleCount * 3); // Parting direction per particle
    for (let i = 0; i < particleCount; i++) {
      const r = (Math.random() + Math.random() + Math.random()) / 3 * 1.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const dx = r * Math.sin(phi) * Math.cos(theta);
      const dy = r * Math.sin(phi) * Math.sin(theta);
      const dz = r * Math.cos(phi);
      basePositions[i * 3]     = center.x + dx;
      basePositions[i * 3 + 1] = center.y + dy;
      basePositions[i * 3 + 2] = center.z + dz;
      // Parting direction: radially outward from center, amplified
      const len = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
      offsets[i * 3]     = (dx / len) * 4;
      offsets[i * 3 + 1] = (dy / len) * 4;
      offsets[i * 3 + 2] = (dz / len) * 4;
    }
    return { basePositions, offsets };
  }, [center, particleCount]);

  const positions = useMemo(() => new Float32Array(basePositions), [basePositions]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const time = clock.getElapsedTime();
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;

    // Animate parting progress
    const targetParting = parting ? 1 : 0;
    partingProgress.current += (targetParting - partingProgress.current) * 0.05;
    const p = partingProgress.current;

    for (let i = 0; i < particleCount; i++) {
      const offset = i * 0.1;
      pos[i * 3]     = basePositions[i * 3]     + offsets[i * 3]     * p + Math.sin(time * 0.5 + offset) * 0.002;
      pos[i * 3 + 1] = basePositions[i * 3 + 1] + offsets[i * 3 + 1] * p + Math.cos(time * 0.3 + offset) * 0.002;
      pos[i * 3 + 2] = basePositions[i * 3 + 2] + offsets[i * 3 + 2] * p + Math.sin(time * 0.4 + offset) * 0.001;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#ffffff"
        size={0.08}
        sizeAttenuation
        transparent
        opacity={dimmed ? 0.1 : parting ? 0.3 : 0.6}
        depthWrite={false}
      />
    </points>
  );
}
```

- [ ] **Step 3: Update TopologyCloud with click handlers and cluster state**

```tsx
// src/components/canvas/TopologyCloud.tsx
'use client';

import { useState, useCallback } from 'react';
import { ThreeEvent } from '@react-three/fiber';
import { topologyNodes, topologyEdges } from '@/data/topology';
import { toWorld } from '@/lib/three-utils';
import { useStore } from '@/lib/scroll-store';
import { NodeCluster } from './NodeCluster';
import { EdgeStream } from './EdgeStream';
import { PortalRing } from './PortalRing';

const worldPositions = topologyNodes.map(toWorld);
const worldPositionMap = Object.fromEntries(
  topologyNodes.map((n, i) => [n.id, worldPositions[i]])
);

export function TopologyCloud() {
  const roomIndex = useStore((s) => s.roomIndex);
  const enteringCluster = useStore((s) => s.enteringCluster);
  const insideCluster = useStore((s) => s.insideCluster);
  const exitingCluster = useStore((s) => s.exitingCluster);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const isTopologyRoom = roomIndex === 2 && !insideCluster;
  const showPortals = isTopologyRoom && !enteringCluster && !exitingCluster;

  const handleClick = useCallback((nodeId: string) => {
    if (!showPortals) return;
    const pos = worldPositionMap[nodeId];
    if (pos) useStore.getState().enterCluster(nodeId, pos);
  }, [showPortals]);

  return (
    <group>
      {topologyNodes.map((node, i) => {
        const isEntering = enteringCluster === node.id;
        const isHidden = insideCluster && insideCluster !== node.id;
        const isDimmed = (enteringCluster && !isEntering) || isHidden;

        return (
          <group key={node.id}>
            <NodeCluster
              center={worldPositions[i]}
              particleCount={node.id === 'relay' ? 150 : 80}
              dimmed={!!isDimmed}
              parting={isEntering}
            />
            {/* Invisible click sphere */}
            {showPortals && (
              <mesh
                position={worldPositions[i]}
                onClick={(e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); handleClick(node.id); }}
                onPointerEnter={() => setHoveredNode(node.id)}
                onPointerLeave={() => setHoveredNode(null)}
              >
                <sphereGeometry args={[1.5, 16, 16]} />
                <meshBasicMaterial visible={false} />
              </mesh>
            )}
            <PortalRing
              center={worldPositions[i]}
              visible={showPortals}
              hovered={hoveredNode === node.id}
            />
          </group>
        );
      })}
      {topologyEdges.map((edge) => {
        const from = worldPositionMap[edge.source];
        const to = worldPositionMap[edge.target];
        if (!from || !to) return null;
        return (
          <EdgeStream
            key={edge.id}
            from={from}
            to={to}
            active={false}
          />
        );
      })}
    </group>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/canvas/PortalRing.tsx src/components/canvas/NodeCluster.tsx src/components/canvas/TopologyCloud.tsx
git commit -m "feat: add portal rings, click-to-enter clusters, parting animation"
```

---

### Task 7: Rewrite HUD Panel + All Overlay Components

**Files:**
- Rewrite: `src/components/overlay/HudPanel.tsx`
- Modify: `src/components/overlay/HeroOverlay.tsx`
- Modify: `src/components/overlay/AboutOverlay.tsx`
- Modify: `src/components/overlay/ProjectsOverlay.tsx`
- Modify: `src/components/overlay/TechOverlay.tsx`
- Modify: `src/components/overlay/ContactOverlay.tsx`
- Delete: `src/components/overlay/NodeOverlay.tsx`

- [ ] **Step 1: Rewrite HudPanel for room-index based visibility**

```tsx
// src/components/overlay/HudPanel.tsx
'use client';

import { useStore } from '@/lib/scroll-store';
import type { ReactNode } from 'react';

type Alignment = 'center' | 'left' | 'right';

interface HudPanelProps {
  children: ReactNode;
  roomIndex: number;
  align?: Alignment;
  className?: string;
  maxWidth?: number;
}

const alignmentClasses: Record<Alignment, string> = {
  center: 'items-center justify-center text-center',
  left: 'items-center justify-start pl-[8vw]',
  right: 'items-center justify-end pr-[8vw]',
};

export function HudPanel({ children, roomIndex: targetRoom, align = 'center', className = '', maxWidth = 480 }: HudPanelProps) {
  const currentRoom = useStore((s) => s.roomIndex);
  const transitioning = useStore((s) => s.transitioning);
  const insideCluster = useStore((s) => s.insideCluster);

  const visible = currentRoom === targetRoom && !transitioning && !insideCluster;
  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex ${alignmentClasses[align]} pointer-events-none animate-[fadeIn_0.5s_ease]`}
    >
      <div
        className={`rounded-xl border border-white/[0.08] bg-[rgba(10,10,15,0.6)] backdrop-blur-[20px] text-white/90 p-8 font-sans pointer-events-auto ${className}`}
        style={{ maxWidth }}
      >
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Update all overlays to use roomIndex**

Each overlay changes from `enter`/`exit` props to `roomIndex` prop.

`src/components/overlay/HeroOverlay.tsx`:
```tsx
'use client';
import { HudPanel } from './HudPanel';

export function HeroOverlay() {
  return (
    <HudPanel roomIndex={0} maxWidth={600}>
      <p className="text-xs font-mono tracking-[0.2em] uppercase text-amber-400 mb-4">
        Systems Security Engineer
      </p>
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-4">
        I build secure systems that survive contact with real networks.
      </h1>
      <p className="text-base text-white/60 leading-relaxed">
        From custom TLS tunnels to production infrastructure — I design, build,
        and operate the systems that keep services running securely.
      </p>
      <p className="mt-6 text-xs font-mono text-white/30 tracking-wider">
        SCROLL TO EXPLORE
      </p>
    </HudPanel>
  );
}
```

`src/components/overlay/AboutOverlay.tsx`:
```tsx
'use client';
import { HudPanel } from './HudPanel';

export function AboutOverlay() {
  return (
    <HudPanel roomIndex={1} align="left" maxWidth={440}>
      <h2 className="text-2xl font-bold mb-4">About</h2>
      <p className="text-sm text-white/70 leading-relaxed mb-3">
        I&apos;m Ruben — a systems security engineer who builds infrastructure from the
        protocol layer up. I write the tunnels, configure the firewalls, and deploy
        the services that run 24/7.
      </p>
      <p className="text-sm text-white/70 leading-relaxed">
        This portfolio is served through Atlax, a reverse TLS tunnel I built in Go.
        The topology you&apos;re about to explore is the actual architecture of that system.
      </p>
    </HudPanel>
  );
}
```

`src/components/overlay/ProjectsOverlay.tsx`:
```tsx
'use client';
import { HudPanel } from './HudPanel';
import { projects } from '@/data/projects';
import { useStore } from '@/lib/scroll-store';

const featured = projects.filter((p) => p.featured);

export function ProjectsOverlay() {
  const startPortal = useStore((s) => s.startPortal);

  return (
    <HudPanel roomIndex={3} align="left" maxWidth={560}>
      <h2 className="text-2xl font-bold mb-4">Projects</h2>
      <div className="space-y-3">
        {featured.map((p) => (
          <button
            key={p.slug}
            onClick={() => startPortal(`/projects/${p.slug}`)}
            className="block w-full text-left rounded-lg border border-white/[0.06] bg-white/[0.03] p-4 hover:bg-white/[0.06] transition-colors"
          >
            <p className="text-sm font-semibold mb-1">{p.title}</p>
            <p className="text-xs text-white/50">{p.tagline}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {p.tech.slice(0, 3).map((t) => (
                <span key={t} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.05] text-white/40">
                  {t}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </HudPanel>
  );
}
```

`src/components/overlay/TechOverlay.tsx`:
```tsx
'use client';
import { HudPanel } from './HudPanel';
import { techStack } from '@/data/projects';

const categories = Object.entries(techStack) as [string, string[]][];

export function TechOverlay() {
  return (
    <HudPanel roomIndex={4} align="right" maxWidth={480}>
      <h2 className="text-2xl font-bold mb-4">Tech Stack</h2>
      <div className="grid grid-cols-2 gap-3">
        {categories.map(([category, items]) => (
          <div key={category}>
            <p className="text-[10px] font-mono uppercase tracking-wider text-amber-400/60 mb-1">
              {category}
            </p>
            <p className="text-xs text-white/50">{items.join(' · ')}</p>
          </div>
        ))}
      </div>
    </HudPanel>
  );
}
```

`src/components/overlay/ContactOverlay.tsx`:
```tsx
'use client';
import { HudPanel } from './HudPanel';

export function ContactOverlay() {
  return (
    <HudPanel roomIndex={5} maxWidth={400}>
      <h2 className="text-2xl font-bold mb-4">Let&apos;s Talk</h2>
      <p className="text-sm text-white/60 mb-6">
        Interested in working together? I&apos;m available for systems engineering,
        security consulting, and infrastructure projects.
      </p>
      <div className="space-y-2">
        <a href="mailto:ru93ben@icloud.com" className="block text-sm text-amber-400 hover:text-amber-300 transition-colors">
          ru93ben@icloud.com
        </a>
        <a href="https://github.com/Ruben0372" target="_blank" rel="noopener noreferrer" className="block text-sm text-white/50 hover:text-white/80 transition-colors">
          github.com/Ruben0372
        </a>
      </div>
    </HudPanel>
  );
}
```

- [ ] **Step 3: Delete NodeOverlay**

```bash
rm src/components/overlay/NodeOverlay.tsx
```

- [ ] **Step 4: Add fadeIn keyframe to globals.css**

Add to `src/app/globals.css` (at the end):

```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: room-index based overlays, delete NodeOverlay"
```

---

### Task 8: Create ClusterRoom Overlay

**Files:**
- Create: `src/components/overlay/ClusterRoom.tsx`

- [ ] **Step 1: Full-screen cluster room interior**

```tsx
// src/components/overlay/ClusterRoom.tsx
'use client';

import { useStore } from '@/lib/scroll-store';
import { getClusterRoom } from '@/data/cluster-rooms';
import { ArrowLeft } from 'lucide-react';

export function ClusterRoom() {
  const insideCluster = useStore((s) => s.insideCluster);
  const exitCluster = useStore((s) => s.exitCluster);

  if (!insideCluster) return null;

  const room = getClusterRoom(insideCluster);
  if (!room) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-[fadeIn_0.5s_ease]">
      <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-xl border border-white/[0.08] bg-[rgba(10,10,15,0.75)] backdrop-blur-[30px] text-white/90 p-8 md:p-10 font-sans mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => exitCluster()}
            className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <p className="text-xs font-mono tracking-[0.15em] uppercase text-amber-400">
            {room.title}
          </p>
        </div>

        {/* Narrative */}
        <p className="text-sm md:text-base text-white/70 leading-relaxed mb-6">
          {room.narrative}
        </p>

        {/* Media */}
        {room.media && (
          <div className="mb-6 rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 md:p-6">
            {room.media.type === 'code' ? (
              <pre className="text-xs font-mono text-white/60 overflow-x-auto whitespace-pre-wrap">
                {room.media.src}
              </pre>
            ) : (
              <div className="text-center text-xs text-white/30 py-8">
                [{room.media.type}: {room.media.src}]
              </div>
            )}
            <p className="mt-2 text-xs text-white/40">{room.media.caption}</p>
          </div>
        )}

        {/* Details / Claims */}
        {room.details.length > 0 && (
          <ul className="space-y-3">
            {room.details.map((detail, i) => (
              <li key={i} className="text-xs md:text-sm text-white/50 flex items-start gap-3">
                <span className="text-amber-400/60 mt-0.5 shrink-0">&#9656;</span>
                {detail}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/overlay/ClusterRoom.tsx
git commit -m "feat: add ClusterRoom full-screen overlay"
```

---

### Task 9: Update PortalTransition + Build Verification

**Files:**
- Modify: `src/components/overlay/PortalTransition.tsx`

- [ ] **Step 1: Update PortalTransition to use new store**

```tsx
// src/components/overlay/PortalTransition.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/scroll-store';

export function PortalTransition() {
  const portalTarget = useStore((s) => s.portalTarget);
  const clearPortal = useStore((s) => s.clearPortal);
  const router = useRouter();
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (!portalTarget) return;
    setFlash(true);
    const timer = setTimeout(() => {
      router.push(portalTarget);
      clearPortal();
    }, 300);
    return () => clearTimeout(timer);
  }, [portalTarget, clearPortal, router]);

  if (!flash) return null;

  return (
    <div
      className="fixed inset-0 z-[200] bg-white pointer-events-none"
      style={{ animation: 'portal-flash 0.6s ease-out forwards' }}
      onAnimationEnd={() => setFlash(false)}
    >
      <style>{`
        @keyframes portal-flash {
          0% { opacity: 0; }
          30% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
```

- [ ] **Step 2: Run build**

```bash
cd /Users/rubenyomenou/gt/portfolio/mayor/rig && npm run build
```

Fix any build errors. Common issues:
- Old imports of `useScrollStore` → change to `useStore`
- Old imports of `panelOpacity` or `activeNodeIndex` → remove
- Missing `@react-three/drei` ScrollControls import in Camera → removed in rewrite

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: update PortalTransition, fix build"
```

---

## Summary

| Task | What | Files |
|------|------|-------|
| 1 | Scroll store rewrite | scroll-store.ts |
| 2 | Utils + cluster data + delete old camera path | three-utils.ts, cluster-rooms.ts |
| 3 | Camera rewrite | Camera.tsx |
| 4 | Scene rewrite (snap scroll) | Scene.tsx |
| 5 | Supernova polish | Supernova.tsx |
| 6 | Topology click/hover/parting + portal rings | NodeCluster, TopologyCloud, PortalRing |
| 7 | HUD panel + all overlays rewrite | HudPanel, 5 overlays, delete NodeOverlay |
| 8 | ClusterRoom overlay | ClusterRoom.tsx |
| 9 | PortalTransition + build | PortalTransition.tsx |
