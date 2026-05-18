# Portfolio v2.2 — Cluster Rooms Design Spec

**Date:** 2026-05-17
**Status:** Approved
**Depends on:** v2.1 WebGL pivot (complete)

## Overview

Add explorable cluster rooms to the topology deep dive. Each of the 6 topology nodes becomes a clickable portal that flies the user into a full-screen content room. Replace free-form scroll with snap-scroll between rooms. Polish supernova animation for organic, intentional motion.

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Room content | Mixed per node (text + diagrams + code) | Each node defines its own content type |
| Navigation model | Hybrid — snap-scroll overview, system-driven rooms | User agency on overview, cinematic inside rooms |
| Scroll control | System-controlled snap | Each scroll gesture = one room, no free-form |
| Portal preview | Glowing ring/wormhole effect on clusters | Hints there's content inside |
| Room entry | Click cluster → cinematic fly-in | Deliberate action, not accidental scroll |
| Room exit | Back arrow → fly-out animation | Clear escape, resume at same position |

## Snap Scroll System

### Replace ScrollControls

Remove drei's `ScrollControls`. Replace with a custom wheel/touch event handler that:

1. Captures `wheel` events on the canvas container
2. Debounces — ignores wheel events within 1200ms of the last room transition
3. `deltaY > 0` → advance to next room, `deltaY < 0` → go to previous room
4. Triggers a camera animation (lerp over ~1.2s with ease-in-out)
5. Updates the zustand store with the target room index

### Room List (Overview Level)

| Index | Room | Camera Position | Camera LookAt |
|-------|------|----------------|---------------|
| 0 | Hero | (0, 0, 2) | (0, 0, 0) |
| 1 | About | (0, 2, 25) | (0, 0, 0) |
| 2 | Topology Overview | (5, 3, 25) | (0, 0, 0) |
| 3 | Projects | (-8, 5, 22) | (0, 0, 0) |
| 4 | Tech Stack | (8, -2, 18) | (0, 0, 0) |
| 5 | Contact | (0, 0, 2) | (0, 0, 0) |

Camera transitions use `lerp` with easing over 60-80 frames (~1.2s at 60fps).

### Store Changes

```typescript
interface ScrollState {
  // Overview navigation
  roomIndex: number;         // 0-5, current overview room
  targetRoomIndex: number;   // Room we're transitioning to
  transitioning: boolean;    // True during camera animation

  // Cluster room mode
  insideCluster: string | null;  // Node ID if inside a cluster, null if on overview
  enteringCluster: string | null; // Node ID during fly-in animation
  exitingCluster: boolean;        // True during fly-out

  // Portal transition (existing)
  portalTarget: string | null;
  savedRoomIndex: number | null;

  // Actions
  goToRoom: (index: number) => void;
  enterCluster: (nodeId: string) => void;
  exitCluster: () => void;
  startPortal: (target: string) => void;
  clearPortal: () => void;
}
```

## Cluster Portal Effect

### Visual on Overview

When camera is at the Topology Overview room (index 2), each node cluster shows a portal indicator:

- A thin glowing ring (torus geometry) around each cluster
- Ring pulses subtly (opacity oscillation)
- On hover: ring brightens, cursor changes to pointer
- Ring color: white with slight amber tint

### Fly-In Animation (click → enter)

1. User clicks a cluster
2. `enteringCluster` set to the node ID
3. Camera begins animating toward the cluster center over ~1.5s
4. As camera approaches:
   - Cluster particles spread outward (parting effect)
   - Other clusters fade out (opacity → 0)
   - Supernova dims
   - Background darkens further
5. At the end of animation:
   - `insideCluster` set to node ID
   - `enteringCluster` cleared
   - Room overlay fades in (glass panel with content)

### Fly-Out Animation (back arrow)

1. User clicks back arrow
2. `exitingCluster` set to true
3. Room overlay fades out
4. Camera animates back to Topology Overview position over ~1.2s
5. Cluster particles reconverge
6. Other clusters fade back in
7. At the end:
   - `insideCluster` cleared
   - `exitingCluster` cleared

## Cluster Room Content

### Data Model Extension

Extend `TopologyNode` or create a parallel `ClusterRoom` data structure:

```typescript
interface ClusterRoomContent {
  nodeId: string;
  title: string;        // Room title (node label)
  narrative: string;    // Long-form text (from scrollSections body)
  media?: {
    type: 'diagram' | 'code' | 'image';
    content: string;    // SVG markup, code string, or image path
    caption: string;
  };
  details: string[];   // Claims/bullet points
}
```

### Content Mapping

| Node | Title | Narrative Source | Media |
|------|-------|-----------------|-------|
| Client | "A request arrives" | scrollSections[0].body | request-flow diagram (React SVG) |
| Caddy | "TLS termination" | scrollSections[1].body | cert-hierarchy diagram (React SVG) |
| Relay | "The relay routes" | scrollSections[2].body | architecture diagram |
| mTLS Tunnel | "The tunnel" | scrollSections[3].body | Wire protocol frame code block |
| Agent | "Behind CGNAT" | scrollSections[4].body | CGNAT bypass diagram |
| Local Service | "Local delivery" | scrollSections[5].body | local delivery diagram |

### Room Interior Layout

Full-screen glass overlay with scrollable content:

```
┌──────────────────────────────────────────┐
│ ← Back                     NODE LABEL    │
│──────────────────────────────────────────│
│                                          │
│   Narrative text (1-2 paragraphs)        │
│                                          │
│   ┌────────────────────────────────┐     │
│   │  Media (diagram / code block)  │     │
│   │                                │     │
│   └────────────────────────────────┘     │
│   Caption                                │
│                                          │
│   ▸ Claim 1                              │
│   ▸ Claim 2                              │
│   ▸ Claim 3                              │
│                                          │
└──────────────────────────────────────────┘
```

Max width 640px, centered. Content scrolls vertically if it overflows.

## Supernova Animation Polish

### Current Problems
- Motion is chaotic/scattered — random directions, random speeds
- Feels like a generic particle effect, not intentional

### Target Behavior
- **Slow orbital motion**: Particles orbit the center in coherent bands, not random scatter
- **Breathing pulse**: Radius expands and contracts on a ~4s cycle (sinusoidal)
- **Reduced speed**: Animation time multiplier reduced to 0.15 (from current ~0.5-1.0)
- **Fewer, softer particles**: 150 particles (from 200), with larger soft radius and lower opacity
- **Nebula feel**: Particles cluster in bands/streams rather than uniform sphere distribution

### Shader Changes
- Replace random spherical distribution with spiral/band distribution
- Add a `uBreath` uniform for the breathing cycle
- Reduce turbulence amplitude from 0.3 to 0.1
- Slow all time-based calculations by 5-7x

## File Changes

### New Files
| File | Purpose |
|------|---------|
| `src/data/cluster-rooms.ts` | Room content data (narratives, media refs, details) |
| `src/components/overlay/ClusterRoom.tsx` | Full-screen room interior overlay |
| `src/components/canvas/PortalRing.tsx` | Glowing ring around clickable clusters |

### Modified Files
| File | Changes |
|------|---------|
| `src/lib/scroll-store.ts` | Replace scroll-based state with room-index + cluster-mode state |
| `src/components/canvas/Scene.tsx` | Remove ScrollControls, add wheel handler, add PortalRings |
| `src/components/canvas/Camera.tsx` | Replace scroll interpolation with room-index lerp + cluster fly-in |
| `src/components/canvas/Supernova.tsx` | Rework shader for organic orbital motion |
| `src/components/canvas/NodeCluster.tsx` | Add hover detection, particle parting animation |
| `src/components/canvas/TopologyCloud.tsx` | Add click handlers, pass cluster state |
| `src/components/overlay/HudPanel.tsx` | Update to use roomIndex instead of scroll float |
| `src/components/overlay/NodeOverlay.tsx` | Remove (replaced by ClusterRoom) |
| `src/lib/three-utils.ts` | Remove scroll-based utilities, add room transition helpers |
| All overlay components | Update enter/exit to use roomIndex |

## Performance Notes

- Portal rings are simple torus geometries — minimal GPU cost
- Cluster particle parting uses the same buffer, just displaces positions — no new geometry
- Room content is regular HTML — no 3D rendering cost
- Snap scroll eliminates continuous scroll updates — camera only animates during transitions
