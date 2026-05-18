# Portfolio v2.1 WebGL Pivot — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace HTML sections + SVG topology with a full Three.js immersive experience — reactive supernova, monochrome particle topology, scroll-driven camera, glass HUD overlays.

**Architecture:** Single R3F `<Canvas>` fills the viewport. ScrollControls maps scroll to camera position along a CatmullRom spline through 6 rooms. Topology nodes are particle clusters, edges are particle streams. Content appears as HTML overlays via drei's `<Html>`. Blog/project pages use portal transitions to standard HTML.

**Tech Stack:** Next.js 15, React 19, @react-three/fiber, @react-three/drei, @react-three/postprocessing, Three.js, zustand, Tailwind 4

**Spec:** `docs/superpowers/specs/2026-05-17-portfolio-webgl-pivot-design.md`

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `src/lib/scroll-store.ts` | Create | Zustand store: scroll position, active room, portal state |
| `src/lib/three-utils.ts` | Create | 2D→3D coordinate mapping, lerp, clamp, room detection |
| `src/data/camera-path.ts` | Create | Camera position/lookAt keyframes per room |
| `src/components/canvas/DustField.tsx` | Create | Background dust particles |
| `src/components/canvas/Supernova.tsx` | Create | Reactive particle supernova with custom shader |
| `src/components/canvas/NodeCluster.tsx` | Create | Single particle cluster for one topology node |
| `src/components/canvas/TopologyCloud.tsx` | Create | Composes all 6 NodeClusters + all EdgeStreams |
| `src/components/canvas/EdgeStream.tsx` | Create | Particle stream between two nodes |
| `src/components/canvas/Camera.tsx` | Create | Scroll-driven camera controller |
| `src/components/canvas/PostProcessing.tsx` | Create | Bloom + vignette + noise |
| `src/components/canvas/Scene.tsx` | Create | Main scene composition inside ScrollControls |
| `src/components/overlay/HudPanel.tsx` | Create | Glass panel base component |
| `src/components/overlay/HeroOverlay.tsx` | Create | Hero room content |
| `src/components/overlay/AboutOverlay.tsx` | Create | About room content |
| `src/components/overlay/NodeOverlay.tsx` | Create | Topology node detail panel |
| `src/components/overlay/ProjectsOverlay.tsx` | Create | Project cards with portal links |
| `src/components/overlay/TechOverlay.tsx` | Create | Tech stack panel |
| `src/components/overlay/ContactOverlay.tsx` | Create | Contact info panel |
| `src/components/overlay/PortalTransition.tsx` | Create | Zoom + flash transition |
| `src/app/page.tsx` | Modify | Replace HTML sections with dynamic Canvas import |
| `src/app/layout.tsx` | Modify | Remove MotionProvider, keep fonts/metadata |
| `src/components/sections/navbar.tsx` | Modify | Adapt for 3D context (scroll→room mapping) |
| `package.json` | Modify | Add R3F deps, remove motion |

---

### Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install R3F ecosystem + zustand**

```bash
cd /Users/rubenyomenou/gt/portfolio/mayor/rig
npm install three @react-three/fiber @react-three/drei @react-three/postprocessing zustand
npm install -D @types/three
```

- [ ] **Step 2: Remove framer-motion**

```bash
npm uninstall motion
```

- [ ] **Step 3: Verify build still works**

```bash
npm run build
```

Expected: Build will fail (imports of `motion/react` in existing components). That's fine — we'll replace those components in later tasks. Just verify the new packages installed correctly by checking `node_modules/@react-three/fiber` exists.

```bash
ls node_modules/@react-three/fiber/package.json && echo "R3F installed"
```

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: add R3F, drei, postprocessing, zustand; remove motion"
```

---

### Task 2: Scroll Store + Utility Helpers

**Files:**
- Create: `src/lib/scroll-store.ts`
- Create: `src/lib/three-utils.ts`

- [ ] **Step 1: Create the zustand scroll store**

```typescript
// src/lib/scroll-store.ts
import { create } from 'zustand';

export type RoomId = 'hero' | 'about' | 'topology' | 'projects' | 'tech' | 'contact';

export interface RoomDef {
  id: RoomId;
  enter: number;
  exit: number;
  label: string;
}

export const rooms: RoomDef[] = [
  { id: 'hero',     enter: 0.00, exit: 0.15, label: 'Hero' },
  { id: 'about',    enter: 0.15, exit: 0.30, label: 'About' },
  { id: 'topology', enter: 0.30, exit: 0.65, label: 'Topology' },
  { id: 'projects', enter: 0.65, exit: 0.80, label: 'Projects' },
  { id: 'tech',     enter: 0.80, exit: 0.90, label: 'Tech Stack' },
  { id: 'contact',  enter: 0.90, exit: 1.00, label: 'Contact' },
];

interface ScrollState {
  scroll: number;
  activeRoom: RoomId;
  portalTarget: string | null;
  savedScroll: number | null;
  setScroll: (s: number) => void;
  startPortal: (target: string) => void;
  clearPortal: () => void;
}

function detectRoom(scroll: number): RoomId {
  for (const room of rooms) {
    if (scroll >= room.enter && scroll < room.exit) return room.id;
  }
  return 'contact';
}

export const useScrollStore = create<ScrollState>((set, get) => ({
  scroll: 0,
  activeRoom: 'hero',
  portalTarget: null,
  savedScroll: null,
  setScroll: (s) => set({ scroll: s, activeRoom: detectRoom(s) }),
  startPortal: (target) => set({ portalTarget: target, savedScroll: get().scroll }),
  clearPortal: () => set({ portalTarget: null }),
}));
```

- [ ] **Step 2: Create Three.js utility helpers**

```typescript
// src/lib/three-utils.ts
import * as THREE from 'three';
import type { TopologyNode } from '@/data/topology';

/** Map topology 2D percentage coords to 3D world space.
 *  x: 0-100 → -15 to 15 (horizontal spread)
 *  y: 0-100 → -8 to 8 (vertical spread, inverted)
 *  z: fixed at 0 (nodes in a plane, camera moves in z) */
export function toWorld(node: TopologyNode): THREE.Vector3 {
  const x = ((node.position.x / 100) - 0.5) * 30;
  const y = ((0.5 - node.position.y / 100)) * 16;
  const z = 0;
  return new THREE.Vector3(x, y, z);
}

/** Linear interpolation */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Clamp value between min and max */
export function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

/** Smooth step — cubic ease for scroll transitions */
export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/** Calculate opacity for a panel based on scroll position and enter/exit range */
export function panelOpacity(scroll: number, enter: number, exit: number, fade = 0.03): number {
  const fadeIn = smoothstep(enter, enter + fade, scroll);
  const fadeOut = 1 - smoothstep(exit - fade, exit, scroll);
  return fadeIn * fadeOut;
}

/** Get the active topology node index during the topology room (scroll 0.30-0.65) */
export function activeNodeIndex(scroll: number): number {
  if (scroll < 0.30 || scroll >= 0.65) return -1;
  const t = (scroll - 0.30) / 0.35; // 0 to 1 within topology room
  return Math.min(5, Math.floor(t * 6));
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/scroll-store.ts src/lib/three-utils.ts
git commit -m "feat: add scroll store and Three.js utility helpers"
```

---

### Task 3: Camera Path Data

**Files:**
- Create: `src/data/camera-path.ts`

- [ ] **Step 1: Define camera keyframes**

```typescript
// src/data/camera-path.ts
import * as THREE from 'three';
import { topologyNodes } from './topology';
import { toWorld } from '@/lib/three-utils';

/** Camera keyframe: position + lookAt target at a specific scroll value */
export interface CameraKeyframe {
  scroll: number;
  position: THREE.Vector3;
  lookAt: THREE.Vector3;
}

// Pre-compute node world positions
const nodePositions = topologyNodes.map(toWorld);
const centerOfTopology = new THREE.Vector3(0, 0, 0); // origin

export const cameraKeyframes: CameraKeyframe[] = [
  // Room 0: Hero — inside the supernova
  { scroll: 0.00, position: new THREE.Vector3(0, 0, 2),   lookAt: new THREE.Vector3(0, 0, 0) },
  { scroll: 0.15, position: new THREE.Vector3(0, 0, 2),   lookAt: new THREE.Vector3(0, 0, 0) },

  // Room 1: About — pull back to see full topology
  { scroll: 0.16, position: new THREE.Vector3(0, 2, 25),  lookAt: centerOfTopology.clone() },
  { scroll: 0.30, position: new THREE.Vector3(5, 3, 25),  lookAt: centerOfTopology.clone() },

  // Room 2: Topology — zoom into each node (6 nodes over 0.30-0.65)
  ...topologyNodes.map((_, i) => {
    const scrollAt = 0.30 + (i / 6) * 0.35 + 0.02; // slight offset into each sub-range
    const pos = nodePositions[i].clone();
    return {
      scroll: scrollAt,
      position: new THREE.Vector3(pos.x + 2, pos.y + 1, 8),
      lookAt: pos.clone(),
    };
  }),

  // Room 3: Projects — pull back, different angle
  { scroll: 0.65, position: new THREE.Vector3(-8, 5, 22), lookAt: centerOfTopology.clone() },
  { scroll: 0.80, position: new THREE.Vector3(-10, 4, 20), lookAt: centerOfTopology.clone() },

  // Room 4: Tech Stack — side orbit
  { scroll: 0.80, position: new THREE.Vector3(-10, 4, 20), lookAt: centerOfTopology.clone() },
  { scroll: 0.90, position: new THREE.Vector3(8, -2, 18), lookAt: centerOfTopology.clone() },

  // Room 5: Contact — zoom back into supernova
  { scroll: 0.90, position: new THREE.Vector3(8, -2, 18), lookAt: new THREE.Vector3(0, 0, 0) },
  { scroll: 1.00, position: new THREE.Vector3(0, 0, 2),   lookAt: new THREE.Vector3(0, 0, 0) },
];
```

- [ ] **Step 2: Commit**

```bash
git add src/data/camera-path.ts
git commit -m "feat: add camera path keyframes for 6 rooms"
```

---

### Task 4: DustField Component

**Files:**
- Create: `src/components/canvas/DustField.tsx`

- [ ] **Step 1: Create the dust particle field**

```tsx
// src/components/canvas/DustField.tsx
'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const DUST_COUNT = 500;

export function DustField() {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, sizes } = useMemo(() => {
    const positions = new Float32Array(DUST_COUNT * 3);
    const sizes = new Float32Array(DUST_COUNT);
    for (let i = 0; i < DUST_COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 80; // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60; // z
      sizes[i] = Math.random() * 0.08 + 0.02;
    }
    return { positions, sizes };
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const time = clock.getElapsedTime();
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < DUST_COUNT; i++) {
      // Very slow drift
      pos[i * 3 + 1] += Math.sin(time * 0.1 + i) * 0.0005;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        color="#ffffff"
        size={0.05}
        sizeAttenuation
        transparent
        opacity={0.15}
        depthWrite={false}
      />
    </points>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/canvas/DustField.tsx
git commit -m "feat: add DustField background particles"
```

---

### Task 5: Supernova Component

**Files:**
- Create: `src/components/canvas/Supernova.tsx`

- [ ] **Step 1: Create the reactive supernova with custom shader**

```tsx
// src/components/canvas/Supernova.tsx
'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollStore } from '@/lib/scroll-store';
import { smoothstep } from '@/lib/three-utils';

const PARTICLE_COUNT = 400;

const vertexShader = `
  uniform float uTime;
  uniform float uIntensity;
  attribute float aRandom;
  attribute float aSpeed;
  varying float vAlpha;

  void main() {
    float t = uTime * aSpeed;
    // Expanding sphere with oscillation
    float radius = 1.5 + sin(t + aRandom * 6.28) * 0.5 * uIntensity;
    // Spherical distribution using position as angles
    float theta = position.x;
    float phi = position.y;
    vec3 pos = vec3(
      radius * sin(theta) * cos(phi),
      radius * sin(theta) * sin(phi),
      radius * cos(theta)
    );
    // Add some turbulence
    pos += vec3(
      sin(t * 1.3 + aRandom * 3.14) * 0.3,
      cos(t * 0.7 + aRandom * 5.0) * 0.3,
      sin(t * 1.1 + aRandom * 2.0) * 0.3
    ) * uIntensity;

    vAlpha = (0.3 + 0.7 * uIntensity) * (0.5 + 0.5 * sin(t + aRandom * 6.28));
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = (3.0 + 4.0 * uIntensity) * (300.0 / -mvPosition.z);
  }
`;

const fragmentShader = `
  varying float vAlpha;

  void main() {
    // Soft circular particle
    float d = length(gl_PointCoord - 0.5) * 2.0;
    if (d > 1.0) discard;
    float alpha = (1.0 - d * d) * vAlpha;
    gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
  }
`;

export function Supernova() {
  const meshRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const { geometry, randoms, speeds } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const randoms = new Float32Array(PARTICLE_COUNT);
    const speeds = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Store spherical angles in position
      positions[i * 3]     = Math.random() * Math.PI * 2;      // theta
      positions[i * 3 + 1] = Math.random() * Math.PI * 2;      // phi
      positions[i * 3 + 2] = 0;
      randoms[i] = Math.random();
      speeds[i] = 0.3 + Math.random() * 0.7;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));
    geometry.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));
    return { geometry, randoms, speeds };
  }, []);

  useFrame(({ clock }) => {
    if (!materialRef.current) return;
    const scroll = useScrollStore.getState().scroll;

    // Intensity: high at hero (0-0.15), low at overview, medium at node zoom, high at contact (0.9-1.0)
    let intensity = 0.3; // default calm
    if (scroll < 0.15) {
      intensity = 1.0 - smoothstep(0.05, 0.15, scroll) * 0.7;
    } else if (scroll > 0.90) {
      intensity = 0.3 + smoothstep(0.90, 1.0, scroll) * 0.7;
    } else if (scroll >= 0.30 && scroll < 0.65) {
      intensity = 0.5; // slightly elevated during topology zoom
    }

    materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    materialRef.current.uniforms.uIntensity.value = intensity;
  });

  return (
    <points ref={meshRef} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uIntensity: { value: 1.0 },
        }}
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
git commit -m "feat: add reactive Supernova with custom shader"
```

---

### Task 6: NodeCluster + TopologyCloud + EdgeStream

**Files:**
- Create: `src/components/canvas/NodeCluster.tsx`
- Create: `src/components/canvas/EdgeStream.tsx`
- Create: `src/components/canvas/TopologyCloud.tsx`

- [ ] **Step 1: Create NodeCluster — particle cluster for a single topology node**

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
}

export function NodeCluster({ center, particleCount = 80, dimmed = false }: NodeClusterProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      // Gaussian-ish distribution around center
      const r = (Math.random() + Math.random() + Math.random()) / 3 * 1.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3]     = center.x + r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = center.y + r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = center.z + r * Math.cos(phi);
    }
    return arr;
  }, [center, particleCount]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const time = clock.getElapsedTime();
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < particleCount; i++) {
      // Breathing: subtle oscillation
      const offset = i * 0.1;
      pos[i * 3]     += Math.sin(time * 0.5 + offset) * 0.002;
      pos[i * 3 + 1] += Math.cos(time * 0.3 + offset) * 0.002;
      pos[i * 3 + 2] += Math.sin(time * 0.4 + offset) * 0.001;
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
        opacity={dimmed ? 0.15 : 0.6}
        depthWrite={false}
      />
    </points>
  );
}
```

- [ ] **Step 2: Create EdgeStream — particles flowing between two nodes**

```tsx
// src/components/canvas/EdgeStream.tsx
'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface EdgeStreamProps {
  from: THREE.Vector3;
  to: THREE.Vector3;
  particleCount?: number;
  active?: boolean;
}

export function EdgeStream({ from, to, particleCount = 30, active = false }: EdgeStreamProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, offsets } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const offsets = new Float32Array(particleCount); // track each particle's t along the path
    for (let i = 0; i < particleCount; i++) {
      offsets[i] = Math.random(); // start at random positions along the edge
      const t = offsets[i];
      positions[i * 3]     = from.x + (to.x - from.x) * t;
      positions[i * 3 + 1] = from.y + (to.y - from.y) * t;
      positions[i * 3 + 2] = from.z + (to.z - from.z) * t;
    }
    return { positions, offsets };
  }, [from, to, particleCount]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const speed = 0.15;
    const dt = clock.getDelta();

    for (let i = 0; i < particleCount; i++) {
      offsets[i] = (offsets[i] + dt * speed) % 1;
      const t = offsets[i];
      // Slight arc via quadratic bezier
      const mid = new THREE.Vector3().lerpVectors(from, to, 0.5);
      mid.y += 0.5; // arc upward
      const oneMinusT = 1 - t;
      pos[i * 3]     = oneMinusT * oneMinusT * from.x + 2 * oneMinusT * t * mid.x + t * t * to.x;
      pos[i * 3 + 1] = oneMinusT * oneMinusT * from.y + 2 * oneMinusT * t * mid.y + t * t * to.y;
      pos[i * 3 + 2] = oneMinusT * oneMinusT * from.z + 2 * oneMinusT * t * mid.z + t * t * to.z;
      // Small perpendicular jitter
      pos[i * 3]     += (Math.random() - 0.5) * 0.02;
      pos[i * 3 + 1] += (Math.random() - 0.5) * 0.02;
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
        size={0.04}
        sizeAttenuation
        transparent
        opacity={active ? 0.35 : 0.1}
        depthWrite={false}
      />
    </points>
  );
}
```

- [ ] **Step 3: Create TopologyCloud — composes all nodes and edges**

```tsx
// src/components/canvas/TopologyCloud.tsx
'use client';

import { topologyNodes, topologyEdges } from '@/data/topology';
import { toWorld, activeNodeIndex } from '@/lib/three-utils';
import { useScrollStore } from '@/lib/scroll-store';
import { NodeCluster } from './NodeCluster';
import { EdgeStream } from './EdgeStream';

const worldPositions = topologyNodes.map(toWorld);
const worldPositionMap = Object.fromEntries(
  topologyNodes.map((n, i) => [n.id, worldPositions[i]])
);

export function TopologyCloud() {
  const scroll = useScrollStore((s) => s.scroll);
  const activeIdx = activeNodeIndex(scroll);

  return (
    <group>
      {topologyNodes.map((node, i) => (
        <NodeCluster
          key={node.id}
          center={worldPositions[i]}
          particleCount={node.id === 'relay' ? 150 : 80}
          dimmed={activeIdx >= 0 && activeIdx !== i}
        />
      ))}
      {topologyEdges.map((edge) => {
        const from = worldPositionMap[edge.source];
        const to = worldPositionMap[edge.target];
        if (!from || !to) return null;
        // Edge is active if either source or target is the active node
        const sourceIdx = topologyNodes.findIndex((n) => n.id === edge.source);
        const targetIdx = topologyNodes.findIndex((n) => n.id === edge.target);
        const isActive = activeIdx === sourceIdx || activeIdx === targetIdx;
        return (
          <EdgeStream
            key={edge.id}
            from={from}
            to={to}
            active={isActive}
          />
        );
      })}
    </group>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/canvas/NodeCluster.tsx src/components/canvas/EdgeStream.tsx src/components/canvas/TopologyCloud.tsx
git commit -m "feat: add NodeCluster, EdgeStream, and TopologyCloud"
```

---

### Task 7: Camera Controller

**Files:**
- Create: `src/components/canvas/Camera.tsx`

- [ ] **Step 1: Create scroll-driven camera controller**

```tsx
// src/components/canvas/Camera.tsx
'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import * as THREE from 'three';
import { cameraKeyframes } from '@/data/camera-path';
import { useScrollStore } from '@/lib/scroll-store';
import { clamp } from '@/lib/three-utils';

const tempPos = new THREE.Vector3();
const tempLookAt = new THREE.Vector3();

/** Find the two keyframes bracketing the current scroll and interpolate */
function interpolateKeyframes(scroll: number, out: { position: THREE.Vector3; lookAt: THREE.Vector3 }) {
  const s = clamp(scroll, 0, 1);

  // Find the bracket
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
  // Smooth interpolation
  const smoothT = t * t * (3 - 2 * t);

  out.position.lerpVectors(lower.position, upper.position, smoothT);
  out.lookAt.lerpVectors(lower.lookAt, upper.lookAt, smoothT);
}

export function Camera() {
  const scroll = useScroll();
  const { camera } = useThree();
  const target = useRef({ position: new THREE.Vector3(), lookAt: new THREE.Vector3() });

  useFrame(() => {
    const s = scroll.offset; // 0 to 1
    useScrollStore.getState().setScroll(s);

    interpolateKeyframes(s, target.current);

    // Smooth lerp camera toward target (avoids snapping)
    camera.position.lerp(target.current.position, 0.08);
    tempLookAt.copy(camera.position);
    tempLookAt.lerp(target.current.lookAt, 0.08);
    camera.lookAt(target.current.lookAt);
  });

  return null;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/canvas/Camera.tsx
git commit -m "feat: add scroll-driven camera controller"
```

---

### Task 8: Post-Processing

**Files:**
- Create: `src/components/canvas/PostProcessing.tsx`

- [ ] **Step 1: Create bloom + vignette + noise stack**

```tsx
// src/components/canvas/PostProcessing.tsx
'use client';

import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

export function PostProcessing() {
  return (
    <EffectComposer>
      <Bloom
        intensity={0.8}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      <Vignette
        eskil={false}
        offset={0.3}
        darkness={0.7}
        blendFunction={BlendFunction.NORMAL}
      />
      <Noise
        opacity={0.04}
        blendFunction={BlendFunction.OVERLAY}
      />
    </EffectComposer>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/canvas/PostProcessing.tsx
git commit -m "feat: add post-processing effects (bloom, vignette, noise)"
```

---

### Task 9: HUD Panel Base Component

**Files:**
- Create: `src/components/overlay/HudPanel.tsx`

- [ ] **Step 1: Create the glass panel component**

```tsx
// src/components/overlay/HudPanel.tsx
'use client';

import { Html } from '@react-three/drei';
import { useScrollStore } from '@/lib/scroll-store';
import { panelOpacity } from '@/lib/three-utils';
import type { ReactNode } from 'react';

interface HudPanelProps {
  children: ReactNode;
  position: [number, number, number];
  enter: number;
  exit: number;
  className?: string;
  maxWidth?: number;
}

export function HudPanel({ children, position, enter, exit, className = '', maxWidth = 480 }: HudPanelProps) {
  const scroll = useScrollStore((s) => s.scroll);
  const opacity = panelOpacity(scroll, enter, exit);

  if (opacity < 0.01) return null;

  return (
    <Html
      position={position}
      center
      style={{
        opacity,
        transition: 'opacity 0.1s ease',
        pointerEvents: opacity > 0.5 ? 'auto' : 'none',
      }}
    >
      <div
        className={`
          rounded-xl border border-white/[0.08]
          bg-[rgba(10,10,15,0.6)] backdrop-blur-[20px]
          text-white/90 p-8 font-sans
          ${className}
        `}
        style={{ maxWidth }}
      >
        {children}
      </div>
    </Html>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/overlay/HudPanel.tsx
git commit -m "feat: add HudPanel glass overlay component"
```

---

### Task 10: Room Overlay Components

**Files:**
- Create: `src/components/overlay/HeroOverlay.tsx`
- Create: `src/components/overlay/AboutOverlay.tsx`
- Create: `src/components/overlay/NodeOverlay.tsx`
- Create: `src/components/overlay/ProjectsOverlay.tsx`
- Create: `src/components/overlay/TechOverlay.tsx`
- Create: `src/components/overlay/ContactOverlay.tsx`

- [ ] **Step 1: Create HeroOverlay**

```tsx
// src/components/overlay/HeroOverlay.tsx
'use client';

import { HudPanel } from './HudPanel';

export function HeroOverlay() {
  return (
    <HudPanel position={[0, 0.5, 3]} enter={0.00} exit={0.14} maxWidth={600}>
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

- [ ] **Step 2: Create AboutOverlay**

```tsx
// src/components/overlay/AboutOverlay.tsx
'use client';

import { HudPanel } from './HudPanel';

export function AboutOverlay() {
  return (
    <HudPanel position={[-8, 1, 20]} enter={0.16} exit={0.29} maxWidth={440}>
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

- [ ] **Step 3: Create NodeOverlay — shows active topology node details**

```tsx
// src/components/overlay/NodeOverlay.tsx
'use client';

import { topologyNodes } from '@/data/topology';
import { toWorld, activeNodeIndex } from '@/lib/three-utils';
import { useScrollStore } from '@/lib/scroll-store';
import { HudPanel } from './HudPanel';

const worldPositions = topologyNodes.map(toWorld);

export function NodeOverlay() {
  const scroll = useScrollStore((s) => s.scroll);
  const idx = activeNodeIndex(scroll);

  if (idx < 0) return null;

  const node = topologyNodes[idx];
  const pos = worldPositions[idx];
  // Offset panel to the side of the node
  const panelPos: [number, number, number] = [pos.x + 4, pos.y + 2, pos.z + 5];
  const subEnter = 0.30 + (idx / 6) * 0.35;
  const subExit = subEnter + 0.35 / 6;

  return (
    <HudPanel position={panelPos} enter={subEnter} exit={subExit} maxWidth={400}>
      <p className="text-xs font-mono tracking-[0.15em] uppercase text-amber-400 mb-2">
        {node.label}
      </p>
      <p className="text-sm text-white/70 leading-relaxed mb-4">
        {node.publicCopy}
      </p>
      <ul className="space-y-2">
        {node.claims.map((claim, i) => (
          <li key={i} className="text-xs text-white/50 flex items-start gap-2">
            <span className="text-amber-400/60 mt-0.5">&#9656;</span>
            {claim}
          </li>
        ))}
      </ul>
    </HudPanel>
  );
}
```

- [ ] **Step 4: Create ProjectsOverlay**

```tsx
// src/components/overlay/ProjectsOverlay.tsx
'use client';

import { HudPanel } from './HudPanel';
import { projects } from '@/data/projects';
import { useScrollStore } from '@/lib/scroll-store';

const featured = projects.filter((p) => p.featured);

export function ProjectsOverlay() {
  const startPortal = useScrollStore((s) => s.startPortal);

  return (
    <HudPanel position={[-6, 2, 18]} enter={0.66} exit={0.79} maxWidth={560}>
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

- [ ] **Step 5: Create TechOverlay**

```tsx
// src/components/overlay/TechOverlay.tsx
'use client';

import { HudPanel } from './HudPanel';
import { techStack } from '@/data/projects';

const categories = Object.entries(techStack) as [string, string[]][];

export function TechOverlay() {
  return (
    <HudPanel position={[6, -1, 15]} enter={0.81} exit={0.89} maxWidth={480}>
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

- [ ] **Step 6: Create ContactOverlay**

```tsx
// src/components/overlay/ContactOverlay.tsx
'use client';

import { HudPanel } from './HudPanel';

export function ContactOverlay() {
  return (
    <HudPanel position={[0, 0.5, 3]} enter={0.91} exit={1.0} maxWidth={400}>
      <h2 className="text-2xl font-bold mb-4">Let&apos;s Talk</h2>
      <p className="text-sm text-white/60 mb-6">
        Interested in working together? I&apos;m available for systems engineering,
        security consulting, and infrastructure projects.
      </p>
      <div className="space-y-2">
        <a
          href="mailto:ru93ben@icloud.com"
          className="block text-sm text-amber-400 hover:text-amber-300 transition-colors"
        >
          ru93ben@icloud.com
        </a>
        <a
          href="https://github.com/Ruben0372"
          target="_blank"
          rel="noopener noreferrer"
          className="block text-sm text-white/50 hover:text-white/80 transition-colors"
        >
          github.com/Ruben0372
        </a>
      </div>
    </HudPanel>
  );
}
```

- [ ] **Step 7: Commit**

```bash
git add src/components/overlay/
git commit -m "feat: add all room overlay components (hero, about, node, projects, tech, contact)"
```

---

### Task 11: Portal Transition

**Files:**
- Create: `src/components/overlay/PortalTransition.tsx`

- [ ] **Step 1: Create the portal transition handler**

```tsx
// src/components/overlay/PortalTransition.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useScrollStore } from '@/lib/scroll-store';

export function PortalTransition() {
  const portalTarget = useScrollStore((s) => s.portalTarget);
  const clearPortal = useScrollStore((s) => s.clearPortal);
  const router = useRouter();
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (!portalTarget) return;

    // Start flash
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
      style={{
        animation: 'portal-flash 0.6s ease-out forwards',
      }}
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

- [ ] **Step 2: Commit**

```bash
git add src/components/overlay/PortalTransition.tsx
git commit -m "feat: add portal transition handler"
```

---

### Task 12: Scene Composition

**Files:**
- Create: `src/components/canvas/Scene.tsx`

- [ ] **Step 1: Create the main scene that composes everything**

```tsx
// src/components/canvas/Scene.tsx
'use client';

import { Canvas } from '@react-three/fiber';
import { ScrollControls, Scroll } from '@react-three/drei';
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
        style={{ position: 'fixed', inset: 0 }}
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
            <Scroll html>
              {/* HTML overlays are positioned via HudPanel's Html component */}
            </Scroll>
            {/* 3D-anchored overlays (inside ScrollControls but using useScroll) */}
            <HeroOverlay />
            <AboutOverlay />
            <NodeOverlay />
            <ProjectsOverlay />
            <TechOverlay />
            <ContactOverlay />
          </ScrollControls>
          <PostProcessing />
        </Suspense>
      </Canvas>
      <PortalTransition />
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/canvas/Scene.tsx
git commit -m "feat: add Scene composition (Canvas + ScrollControls + all children)"
```

---

### Task 13: Homepage + Layout Integration

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Replace homepage with dynamic Canvas import**

```tsx
// src/app/page.tsx
import dynamic from 'next/dynamic';

const Scene = dynamic(
  () => import('@/components/canvas/Scene').then((mod) => mod.Scene),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 bg-[#050508] flex items-center justify-center">
        <p className="text-white/30 text-sm font-mono tracking-wider">Loading...</p>
      </div>
    ),
  }
);

export default function HomePage() {
  return (
    <main id="main-content">
      <Scene />
    </main>
  );
}
```

- [ ] **Step 2: Update layout to remove MotionProvider**

Read `src/app/layout.tsx` first. Then replace the MotionProvider wrapper — just render `{children}` directly.

```tsx
// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import { cn } from "@/lib/utils";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ruben.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ruben Yomenou | Systems Security Engineer",
    template: "%s | Ruben",
  },
  description:
    "I build secure systems from the protocol layer up. Custom TLS tunnels, production infrastructure, and the tools to operate them.",
  keywords: [
    "systems security engineer",
    "reverse TLS tunnel",
    "mTLS",
    "Go",
    "TypeScript",
    "React",
    "infrastructure engineering",
    "self-hosted",
  ],
  authors: [{ name: "Ruben Yomenou" }],
  creator: "Ruben Yomenou",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Ruben Yomenou",
    title: "Ruben Yomenou | Systems Security Engineer",
    description:
      "I build secure systems from the protocol layer up — custom TLS tunnels, production infrastructure, and the tools to operate them.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ruben Yomenou | Systems Security Engineer",
    description:
      "I build secure systems from the protocol layer up — custom TLS tunnels, production infrastructure, and the tools to operate them.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        "dark",
        geistSans.variable,
        geistMono.variable,
        playfair.variable
      )}
    >
      <body className="min-h-screen antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-[var(--color-brand-amber)] focus:px-4 focus:py-2 focus:text-[var(--color-brand-bg)] focus:font-semibold"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Verify the build**

```bash
cd /Users/rubenyomenou/gt/portfolio/mayor/rig && npm run build
```

Expected: May have warnings about unused old components. The homepage should build. Blog/project pages should still work since they don't depend on the new canvas.

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx src/app/layout.tsx
git commit -m "feat: wire homepage to 3D canvas, remove MotionProvider"
```

---

### Task 14: Navbar Adaptation

**Files:**
- Modify: `src/components/sections/navbar.tsx`

- [ ] **Step 1: Update navbar for 3D context**

The navbar needs to work both on the 3D homepage (where scroll maps to rooms) and on HTML content pages (where it's a standard nav). Remove the motion/framer-motion import and the AnimatePresence for mobile menu. Use basic CSS transitions instead.

```tsx
// src/components/sections/navbar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const links = [
  { id: 'about', label: 'About', href: '/' },
  { id: 'projects', label: 'Projects', href: '/projects' },
  { id: 'blog', label: 'Blog', href: '/blog' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      aria-label="Main navigation"
      className={cn(
        'fixed top-0 left-0 right-0 z-[100] transition-all duration-300',
        scrolled || !isHome
          ? 'bg-[#050508]/70 backdrop-blur-xl border-b border-white/5'
          : 'bg-transparent'
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          ruben<span className="text-amber-400">.dev</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className={cn(
                'relative px-3 py-1.5 text-sm transition-colors',
                pathname.startsWith(link.href) && link.href !== '/'
                  ? 'text-white'
                  : 'text-white/50 hover:text-white'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link
          href="mailto:ru93ben@icloud.com"
          className="hidden md:inline-flex text-sm font-medium px-4 py-2 rounded-lg border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm hover:bg-white/[0.06] transition-all text-amber-400"
        >
          Let&apos;s Talk
        </Link>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileOpen}
          className="md:hidden p-2"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-white/5 bg-[#050508]/95 backdrop-blur-xl">
          <div className="px-6 py-4 space-y-1">
            {links.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block w-full text-left px-3 py-2.5 text-sm rounded-lg transition-colors text-white/50"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/navbar.tsx
git commit -m "refactor: adapt navbar for 3D context, remove motion dependency"
```

---

### Task 15: Cleanup — Remove Old Components

**Files:**
- Delete: `src/components/sections/hero.tsx`
- Delete: `src/components/sections/about.tsx`
- Delete: `src/components/sections/featured-projects.tsx`
- Delete: `src/components/sections/tech-stack.tsx`
- Delete: `src/components/sections/blog-preview.tsx`
- Delete: `src/components/sections/contact.tsx`
- Delete: `src/components/systems-map/` (entire directory)
- Delete: `src/components/diagrams/` (entire directory)
- Delete: `src/components/ui/section-reveal.tsx`
- Delete: `src/components/ui/cursor-glow.tsx`
- Delete: `src/components/ui/back-to-top.tsx`
- Delete: `src/components/ui/bg-pattern.tsx`
- Delete: `src/components/ui/system-window.tsx`
- Delete: `src/components/ui/grid-glow.tsx`
- Delete: `src/components/ui/tilt-card.tsx`
- Delete: `src/components/ui/focus-card.tsx`
- Delete: `src/components/ui/typewriter.tsx`
- Delete: `src/components/providers/motion-provider.tsx`
- Delete: `src/app/systems-map/` (entire directory)
- Delete: `src/data/layer-descriptions.ts`

- [ ] **Step 1: Remove old section components**

```bash
cd /Users/rubenyomenou/gt/portfolio/mayor/rig
rm src/components/sections/hero.tsx
rm src/components/sections/about.tsx
rm src/components/sections/featured-projects.tsx
rm src/components/sections/tech-stack.tsx
rm src/components/sections/blog-preview.tsx
rm src/components/sections/contact.tsx
```

- [ ] **Step 2: Remove old systems-map, diagrams, and UI components**

```bash
rm -rf src/components/systems-map/
rm -rf src/components/diagrams/
rm src/components/ui/section-reveal.tsx
rm src/components/ui/cursor-glow.tsx
rm src/components/ui/back-to-top.tsx
rm src/components/ui/bg-pattern.tsx
rm src/components/ui/system-window.tsx
rm src/components/ui/grid-glow.tsx
rm src/components/ui/tilt-card.tsx
rm src/components/ui/focus-card.tsx
rm src/components/ui/typewriter.tsx
rm src/components/providers/motion-provider.tsx
```

- [ ] **Step 3: Remove systems-map route and unused data**

```bash
rm -rf src/app/systems-map/
rm src/data/layer-descriptions.ts
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```

Expected: Clean build. All motion/framer-motion references should be gone. Blog and project pages should still work.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: remove old HTML section components, SVG topology, and motion provider"
```

---

### Task 16: Reduced Motion Fallback

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Add prefers-reduced-motion detection and static fallback**

Update `page.tsx` to check for reduced motion preference and render a static HTML version instead of the canvas:

```tsx
// src/app/page.tsx
import dynamic from 'next/dynamic';
import { Navbar } from '@/components/sections/navbar';

const Scene = dynamic(
  () => import('@/components/canvas/Scene').then((mod) => mod.Scene),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 bg-[#050508] flex items-center justify-center">
        <p className="text-white/30 text-sm font-mono tracking-wider">Loading...</p>
      </div>
    ),
  }
);

function StaticFallback() {
  return (
    <div className="bg-[#050508] text-white min-h-screen">
      <Navbar />
      <section className="max-w-2xl mx-auto px-6 pt-32 pb-16">
        <p className="text-xs font-mono tracking-[0.2em] uppercase text-amber-400 mb-4">
          Systems Security Engineer
        </p>
        <h1 className="text-4xl font-bold tracking-tight leading-[1.1] mb-4">
          I build secure systems that survive contact with real networks.
        </h1>
        <p className="text-base text-white/60 leading-relaxed">
          From custom TLS tunnels to production infrastructure — I design, build,
          and operate the systems that keep services running securely.
        </p>
      </section>
    </div>
  );
}

export default function HomePage() {
  return (
    <main id="main-content">
      {/* CSS media query hides canvas and shows fallback for reduced motion */}
      <div className="motion-safe:block motion-reduce:hidden">
        <Scene />
      </div>
      <div className="motion-safe:hidden motion-reduce:block">
        <StaticFallback />
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: add reduced-motion static fallback for accessibility"
```

---

### Task 17: Final Build Verification + Dev Server Test

- [ ] **Step 1: Run the build**

```bash
cd /Users/rubenyomenou/gt/portfolio/mayor/rig && npm run build
```

Expected: Clean build, no errors.

- [ ] **Step 2: Start dev server and visual check**

```bash
npm run dev -- -p 3200
```

Open `http://localhost:3200` in the browser. Verify:
- Canvas loads with dark background
- Supernova particles visible at center
- Scrolling moves camera through the scene
- Glass HUD panels appear/disappear at correct scroll positions
- Dust particles visible in background
- Bloom glow on supernova
- Blog page (`/blog`) still renders as HTML
- Projects page (`/projects`) still renders as HTML

- [ ] **Step 3: Fix any issues found during visual check**

Adjust camera keyframe positions, particle counts, panel positions, or scroll ranges as needed. These are tuning values that require visual iteration.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: portfolio v2.1 WebGL pivot complete"
```

---

## Summary

| Task | Component | Files |
|------|-----------|-------|
| 1 | Dependencies | package.json |
| 2 | Store + Utils | scroll-store.ts, three-utils.ts |
| 3 | Camera Path | camera-path.ts |
| 4 | DustField | DustField.tsx |
| 5 | Supernova | Supernova.tsx |
| 6 | Topology (nodes + edges) | NodeCluster.tsx, EdgeStream.tsx, TopologyCloud.tsx |
| 7 | Camera Controller | Camera.tsx |
| 8 | Post-Processing | PostProcessing.tsx |
| 9 | HUD Panel Base | HudPanel.tsx |
| 10 | Room Overlays (6) | Hero/About/Node/Projects/Tech/Contact overlays |
| 11 | Portal Transition | PortalTransition.tsx |
| 12 | Scene Composition | Scene.tsx |
| 13 | Homepage + Layout | page.tsx, layout.tsx |
| 14 | Navbar | navbar.tsx |
| 15 | Cleanup | Remove 20+ old files |
| 16 | Reduced Motion | page.tsx fallback |
| 17 | Final Verification | Build + visual test |
