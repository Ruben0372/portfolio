# Portfolio v2.1 — WebGL Pivot Design Spec

**Date:** 2026-05-17
**Status:** Approved
**Reference:** activetheory.net (WebGL-first immersive portfolio)

## Overview

Pivot the portfolio from HTML sections + SVG topology to a full 3D immersive experience. The entire site lives inside a Three.js canvas rendered via React Three Fiber (R3F). Scroll drives camera movement through a 3D scene containing a monochrome particle topology network with a reactive supernova backdrop. Text content appears as glass HUD overlays (HTML with `backdrop-filter`) synced to camera position. Blog and project detail pages use portal transitions to clean HTML readers.

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Immersion level | Full 3D — entire site in canvas | Match activetheory.net reference |
| Scroll choreography | Room-to-room + orbital zoom | Distinct zones with zoom transitions between them |
| Visual aesthetic | Monochrome particle cloud | Elegant, motion-driven identity; nodes are particle clusters |
| Background | Reactive supernova | Explosive, high-energy center that pulses with scroll |
| Text rendering | Glass HUD overlays (HTML + backdrop-filter) | Readable, accessible, spatially synced |
| Content pages | Portal transition to HTML | 3D lobby, HTML reading rooms |

## Scene Architecture

### 3D World

A single `<Canvas>` fills the viewport. The scene contains:

1. **Supernova core** — Central particle explosion with bloom. Hundreds of particles in an expanding/contracting sphere with velocity-based opacity. Scroll position controls intensity (calm at overview, intense when zoomed into nodes).

2. **Topology nodes** — 6 particle clusters (Client, Caddy, Relay, mTLS Tunnel, Agent, Local Service) positioned in 3D space. Each cluster is 50-200 particles that breathe (subtle position oscillation). Positions derived from existing `topology.ts` data, mapped from 2D percentages to 3D coordinates.

3. **Topology edges** — Faint particle streams flowing between node clusters along curved paths. Particles travel source-to-target to show data flow direction. Very low opacity — visible but not distracting.

4. **Dust field** — Hundreds of tiny particles at varying depths creating parallax when camera moves. Gives the void texture and depth without competing with nodes.

### Camera System

Camera follows a predefined path controlled by scroll position (0.0 to 1.0):

| Scroll Range | Camera Behavior | Room |
|-------------|-----------------|------|
| 0.00 – 0.15 | Inside supernova, pulling outward | Hero |
| 0.15 – 0.30 | Full topology orbit, slow rotation | About/Overview |
| 0.30 – 0.65 | Sequential zoom into each node cluster | Topology Deep Dive |
| 0.65 – 0.80 | Pull back to overview, different angle | Projects |
| 0.80 – 0.90 | Side orbit | Tech Stack |
| 0.90 – 1.00 | Zoom back into supernova core | Contact |

Camera positions and lookAt targets are defined as arrays of Vector3 keyframes. Interpolation uses CatmullRom splines for smooth transitions. Room boundaries have eased transitions (cubic-bezier) to avoid abrupt camera jumps.

### Supernova Behavior

The supernova is not static — it responds to scroll:

- **Hero (0.0):** Maximum intensity. Dense particle cloud, high bloom, visible shockwave rings.
- **Overview (0.15-0.30):** Reduced to gentle pulse. Background element.
- **Node zoom (0.30-0.65):** Intensifies behind the active node cluster. Directional — the glow shifts toward whichever node the camera is focused on.
- **Contact (0.90-1.0):** Returns to maximum intensity. Full circle.

Implementation: `uniforms.uIntensity` driven by scroll position. Supernova geometry is a custom `ShaderMaterial` on a `Points` mesh with vertex displacement in the shader.

## Content Overlay System

### Glass HUD Panels

Content is rendered using drei's `<Html>` component, anchored to 3D positions but rendered as DOM elements. Styling:

```css
.hud-panel {
  background: rgba(10, 10, 15, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.9);
  padding: 32px;
  max-width: 480px;
}
```

Panels fade in/out based on scroll position proximity to their room. Each panel has an `enterAt` and `exitAt` scroll value with opacity interpolation.

### Room Content Mapping

| Room | Panel Content | Data Source |
|------|--------------|-------------|
| Hero | Title, subtitle, role | Static copy |
| About | Bio, identity paragraph | Static copy |
| Topology | Node label, publicCopy, claims list | `topology.ts` |
| Projects | Project cards (title, summary, tech) | `projects.ts` |
| Tech Stack | Technology categories with items | Existing tech-stack data |
| Contact | Email, GitHub, LinkedIn | Static copy |

## Scroll Journey Detail

### Room 0 — Hero (scroll 0.00–0.15)

Camera starts at the center of the supernova. The user sees an intense white particle explosion filling their view. Title text ("I build secure systems that survive contact with real networks") appears on a glass panel centered in view. As they scroll, the camera pulls backward, the supernova recedes, and the topology network is revealed emerging from the explosion.

### Room 1 — About/Overview (scroll 0.15–0.30)

Full topology now visible. Camera slowly orbits the network. A glass panel slides in from the left with the about/bio text. The supernova pulses gently in the center, giving the scene a heartbeat.

### Room 2 — Topology Deep Dive (scroll 0.30–0.65)

The longest room. Camera zooms into each node cluster sequentially:
- 0.30–0.36: Client
- 0.36–0.42: Caddy
- 0.42–0.48: Relay
- 0.48–0.54: mTLS Tunnel
- 0.54–0.60: Agent
- 0.60–0.65: Local Service

At each node, a glass panel appears with the node's `publicCopy` and `claims`. The supernova glow shifts toward the active node. Other nodes dim slightly. Edge particles between adjacent nodes glow brighter to show the connection path.

### Room 3 — Projects (scroll 0.65–0.80)

Camera pulls back to a wider view of the topology from a different angle. Project cards appear as floating glass panels arranged in a grid pattern. Each card shows title, summary, and tech tags. Clicking a card triggers the portal transition.

### Room 4 — Tech Stack (scroll 0.80–0.90)

Camera orbits to a lateral view. Tech category labels appear as small glass badges orbiting the topology like satellites. A main panel shows the organized tech stack.

### Room 5 — Contact (scroll 0.90–1.00)

Camera zooms back into the supernova core — full circle. Contact information appears on a centered glass panel. The supernova returns to full intensity.

## Portal Transitions

When clicking a project card or blog link:

1. Camera rapidly zooms into the clicked element's 3D position
2. A white flash fills the screen (CSS overlay, 300ms)
3. Next.js navigates to the HTML page (`/projects/[slug]` or `/blog/[slug]`)
4. The HTML page fades in from white

Returning to the 3D experience:
1. Back button or nav link triggers reverse — screen flashes white
2. Next.js navigates back to `/`
3. Canvas resumes at the scroll position where the user left
4. Camera eases back to the correct room position

Implementation: Store scroll position in a zustand store or URL hash. The canvas component reads it on mount and restores camera position.

## Technology Stack

### New Dependencies

| Package | Purpose |
|---------|---------|
| `@react-three/fiber` | React renderer for Three.js |
| `@react-three/drei` | Helpers: ScrollControls, Html, CatmullRomLine, etc. |
| `@react-three/postprocessing` | Bloom, vignette, noise effects |
| `three` | 3D engine |
| `zustand` | Lightweight state for scroll position, active room, transitions |

### Retained Dependencies

| Package | Purpose |
|---------|---------|
| `next` (15) | Framework, routing, SSR for content pages |
| `tailwindcss` (4) | Styling for HTML content pages and HUD panels |
| `gray-matter` + `next-mdx-remote` | MDX pipeline for blog/project pages |
| `lucide-react` | Icons |

### Removed Dependencies

| Package | Reason |
|---------|--------|
| `motion` (framer-motion) | Replaced by R3F scroll choreography |

## File Structure

```
src/
  app/
    page.tsx                    # Canvas entry point (client component)
    layout.tsx                  # Keep existing layout
    blog/[slug]/page.tsx        # Keep — HTML reader
    projects/[slug]/page.tsx    # Keep — HTML reader
  components/
    canvas/
      Scene.tsx                 # Main R3F scene composition
      Camera.tsx                # Scroll-driven camera controller
      Supernova.tsx             # Particle supernova with shader
      TopologyCloud.tsx         # All 6 node clusters
      NodeCluster.tsx           # Single particle cluster for one node
      EdgeStream.tsx            # Particle stream between two nodes
      DustField.tsx             # Background dust particles
      PostProcessing.tsx        # Bloom + vignette + noise stack
    overlay/
      HudPanel.tsx              # Glass panel base component
      HeroOverlay.tsx           # Hero room content
      AboutOverlay.tsx          # About room content
      NodeOverlay.tsx           # Topology node detail panel
      ProjectsOverlay.tsx       # Project cards grid
      TechOverlay.tsx           # Tech stack panel
      ContactOverlay.tsx        # Contact info panel
      PortalTransition.tsx      # Zoom + flash transition handler
    sections/                   # Keep for HTML content pages
      navbar.tsx                # Keep — used on content pages
      footer.tsx                # Keep — used on content pages
  data/
    topology.ts                 # Keep — drives 3D node positions
    projects.ts                 # Keep — drives project cards
    camera-path.ts              # NEW — camera keyframes per room
    scroll-sections.ts          # Keep/adapt — room boundaries
  lib/
    scroll-store.ts             # NEW — zustand store for scroll/room state
    three-utils.ts              # NEW — coordinate mapping, interpolation helpers
```

## Performance Considerations

- **Instanced rendering:** All particles (nodes, edges, supernova, dust) use `InstancedMesh` or `Points` with `BufferGeometry` — no individual mesh per particle.
- **GPU-driven animation:** Particle motion computed in vertex shaders via uniforms (time, scroll position, intensity). No per-frame JS position updates for individual particles.
- **Frustum culling:** Disable for always-visible elements (supernova, dust). Enable for node clusters.
- **LOD:** Reduce particle count on mobile/low-GPU devices. Detect via `renderer.capabilities` or a performance probe on first frame.
- **Lazy canvas:** The `<Canvas>` is loaded client-side only (`"use client"` + dynamic import with `ssr: false`). SSR renders a static fallback (dark background + loading indicator).
- **Post-processing budget:** Bloom is the most expensive effect. Use half-resolution bloom pass. Vignette and noise are cheap.

## Mobile / Fallback Strategy

- **Low-end devices:** Reduce particle counts by 50-75%. Disable post-processing. Simplify supernova to fewer particles with CSS glow fallback.
- **No WebGL:** Show a static dark page with the glass HUD panels as standard HTML sections. Graceful degradation — content is still accessible.
- **Touch scroll:** Map touch drag to the same scroll progress. Consider adding swipe-to-advance between rooms for clearer navigation on mobile.

## Accessibility

- All text content is in HTML DOM (via drei `<Html>`), not rendered as textures — screen readers can access it.
- Keyboard navigation: Tab moves between HUD panels. Space/Enter activates links.
- `prefers-reduced-motion`: Disable particle animation, supernova pulses, and camera transitions. Show all rooms as a vertical HTML page with static dark backgrounds.
- Sufficient contrast: White text on dark glass panels (ratio > 7:1).
- Canvas has `role="img"` with descriptive `aria-label`.

## What Carries Over

- `src/data/topology.ts` — Node/edge definitions, copy, claims (unchanged)
- `src/data/projects.ts` — Project data (unchanged)
- `src/data/scroll-sections.ts` — Adapt room names/descriptions
- `src/lib/mdx.ts` — MDX pipeline (unchanged)
- `src/app/blog/` — Blog pages (unchanged)
- `src/app/projects/` — Project pages (unchanged)
- `content/` — All MDX content (unchanged)
- Design tokens (CSS variables for colors)
- Tailwind configuration

## What Gets Replaced

- All `src/components/sections/` (Hero, About, FeaturedProjects, TechStack, BlogPreview, Contact)
- All `src/components/systems-map/` (SVG topology, scroll traces, inspector panels)
- All `src/components/ui/` scroll/animation components (section-reveal, cursor-glow, back-to-top)
- `src/components/diagrams/` (SVG diagrams)
- `motion` (framer-motion) dependency
- `src/app/systems-map/` route (topology is now the homepage experience)
