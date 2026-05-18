# Portfolio v2: Systems Map Blueprint

**Objective:** Redesign the portfolio homepage and add an immersive `/systems-map` scroll experience that traces a request through the Atlax tunnel architecture with interactive media.

**Target audience:** Clients
**Quality bar:** Quality-first, no deadline
**Sound:** No audio for v2
**Repo:** `Ruben0372/portfolio` on branch `main`
**Working directory:** `/Users/rubenyomenou/gt/portfolio/mayor/rig/`

---

## Decisions

### ADR-1: Scroll Animation Library

**Decision:** Use CSS `animation-timeline: scroll()` with `motion` (Motion for React) as the primary scroll animation approach. No GSAP.

**Rationale:** GSAP 3.12+ uses a proprietary license. The free tier requires the site to not generate revenue, which conflicts with a client-acquisition portfolio. CSS scroll-driven animations are natively supported in Chrome/Edge, and `motion` provides a robust fallback for DOM transitions. This eliminates a licensing risk and reduces bundle size.

**Fallback:** For browsers without `animation-timeline` support (Firefox/Safari as of 2026), use `IntersectionObserver` + `motion` for section entrance animations. Progressive enhancement — the experience degrades gracefully.

### ADR-2: SVG+Canvas Topology, No Three.js

**Decision:** Use SVG for the topology visualization with a canvas overlay for particle effects. Do not install Three.js/R3F.

**Rationale:** The topology has ~6 nodes with fixed, well-known positions. Three.js adds ~600KB (unminified) for a graph that can be beautifully rendered in SVG with CSS/GSAP animations. SVG is accessible, SSR-safe, and works without WebGL. R3F can be added as a progressive enhancement in a future version if 3D depth/camera effects are desired.

### ADR-3: No d3-force

**Decision:** Hand-position topology nodes with explicit `{ x, y }` coordinates in the data model. No d3-force.

**Rationale:** A 6-node static topology with fixed architecture doesn't need force-directed layout. d3-force adds runtime complexity, non-deterministic positioning, and bundle weight for no benefit. Hand-positioning ensures the topology renders identically every time.

---

## Dependency Graph

```
Step 1a (Design Tokens + New Deps)
  |
  +---> Step 1b (framer-motion -> motion migration)
  |       |
  |       +---> Step 3 (Systems Map Shell) ------+
  |       |                                      |
  |       +---> Step 7a (Homepage Hero Layout) --+--- Step 7b (System Window CTA) --+
  |                                              |                                  |
  +---> Step 2 (Topology Data Model)             |                                  |
  |       |                                      |                                  |
  |       +---> Step 4 (Scroll-Driven Trace) ----+---> Step 6 (Integration) --------+
  |       |                                      |           |                      |
  |       +---> Step 5 (Topology Visualization) -+           |                      |
  |                                                          |                      |
  +---> Step 8a (Content & Data Refresh) --------------------+                      |
  |                                                          |                      |
  +---> Step 8b (Navbar + Metadata) -------------------------+                      |
                                                                                    |
                                                    Step 9 (Assets & Media) --------+
                                                             |
                                                    Step 10 (Verification & Ship)
```

**Parallel groups:**
- After Step 1a: Steps 1b, 2 can start in parallel
- After Step 1b: Steps 3, 7a, 8a, 8b can start in parallel
- After Step 2: Steps 4, 5 can start in parallel (also need 1b done for motion)
- Step 4 depends on Steps 2 + 3
- Step 6 depends on Steps 4 + 5
- Step 7b depends on Steps 5 + 7a
- Step 9 depends on Steps 6, 7b, 8a
- Step 10 depends on all prior steps

---

## Step 1a: Design Tokens + New Dependencies

**Model tier:** default
**Branch:** `v2/design-tokens`
**Estimated scope:** ~3 files changed (package.json, package-lock.json, globals.css)

### Context Brief

Expand the design system for the systems map without touching existing animation code. Add semantic color tokens for network components and motion timing tokens. Install only the dependencies actually needed: `motion` (for the migration in Step 1b).

### Reuse from v1
- Keep all existing tokens, glass morphism, noise, scrollbar styles, shadcn mappings
- Keep `framer-motion` installed (removed in Step 1b)

### Tasks

1. Install `motion` package (do NOT remove `framer-motion` yet — that happens in Step 1b)
2. Add systems-map semantic color tokens to `globals.css`:
   - `--color-map-relay: #3b82f6` (blue — relay presence)
   - `--color-map-agent: #10b981` (emerald — agent/customer node)
   - `--color-map-tunnel: #8b5cf6` (violet — mTLS tunnel)
   - `--color-map-trust: rgba(139, 92, 246, 0.08)` (trust zone fill)
   - `--color-map-stream: #f59e0b` (amber — active stream, matches brand)
   - `--color-map-healthy: #10b981` (emerald — health indicator)
   - `--color-map-warning: #f97316` (orange — warning state)
   - `--color-map-caddy: #22d3ee` (cyan — Caddy proxy)
   - `--color-map-client: #a1a1aa` (muted — external client)
   - `--color-map-service: #facc15` (yellow — local service)
3. Add motion timing tokens:
   - `--timing-micro: 150ms`
   - `--timing-standard: 300ms`
   - `--timing-emphasis: 500ms`
   - `--timing-scroll: 800ms`
4. Add map-specific CSS utilities:
   - `.topology-line` — thin stroke with glow
   - `.topology-node` — circular node base style
   - `.trust-zone` — gradient fill for trust boundaries
   - `.stream-pulse` — keyframe animation for data flow

### Verification

```bash
npm install
npm run build
npm run lint
```

### Exit Criteria
- New tokens in globals.css, build passes
- No visual regressions on existing pages
- `motion` package available (not yet used)

### Rollback
Revert globals.css token additions and package.json.

---

## Step 1b: framer-motion to motion Migration

**Model tier:** default
**Branch:** `v2/motion-migration`
**Depends on:** Step 1a
**Estimated scope:** ~12 files changed

### Context Brief

Migrate all 9+ files importing `framer-motion` to the `motion` package. The `motion` package (Motion for React, formerly Framer Motion) changed import paths starting in v11. This is a dedicated migration PR to isolate risk — if animations break, only this branch is affected, not design token or dependency changes.

### Files to migrate

| File | Imports used |
|------|-------------|
| `src/components/providers/motion-provider.tsx` | `MotionConfig`, `LazyMotion` |
| `src/components/ui/section-reveal.tsx` | `motion`, `useInView` |
| `src/components/ui/focus-card.tsx` | `motion`, `AnimatePresence` |
| `src/components/ui/tilt-card.tsx` | `motion`, `useMotionValue`, `useSpring`, `useTransform` |
| `src/components/ui/typewriter.tsx` | `motion` |
| `src/components/ui/back-to-top.tsx` | `motion`, `AnimatePresence` |
| `src/components/sections/hero.tsx` | `motion` |
| `src/components/sections/navbar.tsx` | `motion`, `AnimatePresence` |
| `src/app/projects/project-list.tsx` | `motion` |

### Tasks

1. Update all imports from `"framer-motion"` to `"motion/react"`
2. Verify API compatibility: `motion`, `AnimatePresence`, `useMotionValue`, `useSpring`, `useTransform`, `useInView` — check for any renamed exports
3. Update `MotionProvider` if `MotionConfig`/`LazyMotion` API changed
4. Remove `framer-motion` from `package.json`
5. Regression test every animated component:
   - Hero: stagger animation on load
   - Navbar: scroll-linked opacity, mobile menu AnimatePresence
   - Section reveals: whileInView fade-in
   - Focus cards: hover expand
   - Tilt cards: mouse-follow 3D tilt
   - Typewriter: character reveal
   - Back-to-top: enter/exit animation
   - Project list: filter animations

### Verification

```bash
npm run build
npm run lint
npm ls framer-motion  # should show "empty" or not found
npm ls motion         # should show installed
# Manual: verify every animated component on / page
# Manual: verify /projects page animations
# Manual: verify /blog page (if any animations)
```

### Exit Criteria
- Zero imports of `framer-motion` in codebase
- All animations work identically to v1
- Build passes, lint passes
- `framer-motion` removed from package.json

### Rollback
Revert all import changes. Re-add `framer-motion` to package.json.

---

## Step 2: Atlax Topology Data Model

**Model tier:** default
**Branch:** `v2/topology-data`
**Depends on:** Step 1a

### Context Brief

The systems map needs a typed data layer describing the Atlax topology. All nodes have hand-positioned coordinates for deterministic rendering. Content is first-person, source-backed, and follows the workspace's content rules. No Tailscale-as-current-hosting claims.

### Source Material
- Atlax README: relay/agent architecture, wire protocol, cert hierarchy
- Architecture overview: 6-step request lifecycle
- Wire protocol: 12-byte frame header, 11 command types
- Threat model: mTLS, cert chain, per-customer port isolation
- Production hosting path: Client -> Caddy -> relay loopback -> mTLS tunnel -> agent -> local service

### Tasks

1. Create `src/data/topology.ts` with typed interfaces and data:
   ```typescript
   interface TopologyNode {
     id: string;
     label: string;
     type: 'relay' | 'agent' | 'client' | 'service' | 'proxy';
     layer: Layer[];
     summary: string;
     publicCopy: string;
     claims: string[];
     position: { x: number; y: number };  // hand-positioned, no d3-force
   }
   interface TopologyEdge { ... }
   type Layer = 'deploy' | 'security' | 'protocol' | 'ops' | 'product';
   ```
   Nodes: client, caddy, relay, tunnel (virtual), agent, local-service
   Edges: internet->caddy, caddy->relay (loopback), relay<->agent (mTLS), agent->service (local)
2. Create `src/data/scroll-sections.ts` — 7 ordered sections:
   - S1: "A request arrives" — client -> Caddy on relay VPS
   - S2: "TLS termination" — Caddy handles HTTPS, forwards to loopback
   - S3: "The relay routes" — port-to-customer mapping, agent registry
   - S4: "The tunnel" — mTLS handshake, 12-byte wire protocol, stream mux
   - S5: "Behind CGNAT" — agent receives stream, demuxes by service name
   - S6: "Local delivery" — forwarded to 127.0.0.1, response flows back
   - S7: "The bigger picture" — other services, monitoring, trust zones
   Each: `{ id, title, body, media: { type, src, alt }, layer, highlightNodes[], highlightEdges[] }`
3. Create `src/data/layer-descriptions.ts` — copy and metadata per layer
4. Verify: `npx tsc --noEmit`

### Verification

```bash
npx tsc --noEmit
```

### Exit Criteria
- Typed topology data with hand-positioned nodes compiles
- 7 scroll sections with first-person copy, media slots, node/edge highlights
- Layer descriptions for all 5 layers
- No Tailscale-as-current-hosting claims

### Rollback
Delete new files in `src/data/`.

---

## Step 3: Systems Map Shell + Route

**Model tier:** default
**Branch:** `v2/systems-map-shell`
**Depends on:** Step 1b

### Context Brief

Create the `/systems-map` route with SSR-safe shell. Critical HTML renders before JavaScript. The interactive scroll experience loads client-side via dynamic import.

### Tasks

1. Create `src/app/systems-map/page.tsx` — server component shell
   - SSR hero: first-person systems statement
   - SSR narrative: plain HTML explaining Atlax hosting path
   - SSR fallback: semantic HTML list of nodes and connections
   - `dynamic(() => import('./systems-map-client'), { ssr: false })`
2. Create `src/app/systems-map/systems-map-client.tsx` — client component wrapper
   - Placeholder slots for scroll sections (Step 4) and topology (Step 5)
   - Reduced-motion detection via `useReducedMotion()` hook
   - Loading state
3. Create `src/app/systems-map/layout.tsx` — layout with back-to-home nav
4. Build passes with route accessible

### Verification

```bash
npm run build
# SSR check
curl -s http://localhost:3000/systems-map | grep -q "secure systems"
```

### Exit Criteria
- `/systems-map` renders meaningful SSR HTML
- Client component loads without errors
- Reduced-motion state handled
- Build passes

### Rollback
Delete `src/app/systems-map/`.

---

## Step 4: Scroll-Driven Trace Sections

**Model tier:** strongest
**Branch:** `v2/scroll-trace`
**Depends on:** Steps 2, 3

### Context Brief

The core experience: scroll-driven sections that trace a request through Atlax. Uses CSS `animation-timeline: scroll()` for native scroll-linked animations in supported browsers, with `IntersectionObserver` + `motion` as the fallback.

### Design Direction
- Each section is a full-viewport scene
- Split layout: media panel (left/background) + narrative copy (right/overlay)
- Mobile: stacked — media above, copy below
- Scroll progress indicator shows position in the trace
- `prefers-reduced-motion`: static layout with all sections visible

### Tasks

1. Create `src/components/systems-map/scroll-trace.tsx` — main scroll container
   - Maps `scroll-sections.ts` data to visual sections
   - CSS `animation-timeline: scroll()` for scroll-linked opacity/transform
   - Fallback: `IntersectionObserver` triggers `motion` entrance animations
   - Scroll progress bar
2. Create `src/components/systems-map/trace-section.tsx` — individual section
   - Media slot: image, SVG diagram, or code block
   - Copy slot: title, body, protocol annotations in glass panel
   - Entrance animation tied to scroll position
   - `prefers-reduced-motion`: instant display
3. Create `src/components/systems-map/media-panel.tsx` — media display
   - Image: `next/image` with blur placeholder
   - Diagram: inline SVG or React component
   - Code: styled pre/code block for protocol frames
4. Create `src/components/systems-map/scroll-progress.tsx`
5. Wire into `systems-map-client.tsx`
6. Placeholder media (labeled color cards) for now

### Verification

```bash
npm run build
# Manual: scroll through /systems-map, 7 sections render
# Manual: reduced-motion shows all sections statically
# Manual: mobile touch scroll works
```

### Exit Criteria
- 7 scroll sections with scroll-linked transitions
- Media + copy layout works desktop + mobile
- Scroll progress visible
- Reduced-motion graceful degradation
- Touch scrolling works

### Rollback
Delete `src/components/systems-map/scroll-*` and `trace-*` files.

---

## Step 5: Topology Visualization (SVG + Canvas)

**Model tier:** strongest
**Branch:** `v2/topology-viz`
**Depends on:** Step 2

### Context Brief

Interactive SVG topology showing the Atlax system. Nodes and edges render from the topology data model with hand-positioned coordinates. Canvas overlay adds particle effects (data flow pulses along edges). No Three.js, no d3-force.

### Tasks

1. Create `src/components/systems-map/topology-view.tsx` — main visualization
   - SVG rendering of nodes and edges from topology data
   - Responsive: viewBox scales to container
   - Canvas overlay for particle trails on edges
2. Create `src/components/systems-map/topology-node.tsx` — node component
   - Circle/icon with label and status dot
   - States: default, highlighted, active, dimmed (CSS classes)
   - Hover/focus: tooltip with summary
3. Create `src/components/systems-map/topology-edge.tsx` — edge component
   - SVG path with animated dash pattern for active connections
   - mTLS tunnel: thicker stroke, glow filter
   - Particle animation via canvas overlay
4. Create `src/components/systems-map/topology-layers.tsx` — layer toggle
   - 5 layer buttons with active state
   - Toggle shows/hides relevant nodes and edges via CSS
5. Expose `highlightNodes(ids[])` and `highlightEdges(ids[])` via ref/callback
6. Keyboard navigation: Tab through nodes, Enter to inspect
7. Static fallback: server-rendered SVG for no-JS

### Verification

```bash
npm run build
# Manual: topology renders all nodes/edges
# Manual: layer toggles work
# Manual: keyboard navigation Tab + Enter
```

### Exit Criteria
- SVG topology renders from data, responsive
- Layer toggles show/hide correctly
- Highlight API available for scroll integration
- Keyboard accessible
- Static SVG fallback

### Rollback
Delete `src/components/systems-map/topology-*` files.

---

## Step 6: Inspector Panels & Scroll-Viz Integration

**Model tier:** default
**Branch:** `v2/inspector-integration`
**Depends on:** Steps 4, 5

### Context Brief

Wire scroll-trace to topology: scrolling highlights nodes/edges. Node click/tap opens inspector panel with evidence-backed details. Route playback animates the full request path.

### Tasks

1. Create `src/components/systems-map/inspector-panel.tsx`
   - Desktop: slide-in from right
   - Mobile: bottom sheet
   - Content: label, summary, claims, protocol annotations
   - Dismiss: close button, ESC, click-outside
2. Create `src/components/systems-map/route-playback.tsx`
   - Animated dot traveling the full path
   - Auto-plays when user reaches final scroll section
3. Integrate scroll <-> topology:
   - Each scroll section triggers `highlightNodes()` and `highlightEdges()`
   - Topology sticky-positioned while sections scroll past
   - Mobile: mini-topology during scroll, full between sections
4. Wire inspector to node click/tap
5. Test desktop + mobile interactions

### Verification

```bash
npm run build
# Manual: scroll highlights correct nodes per section
# Manual: click node -> inspector opens with correct content
# Manual: route playback animates
# Manual: ESC closes inspector, keyboard works
```

### Exit Criteria
- Scroll-to-topology highlighting works
- Inspector panels with evidence content
- Route playback animation
- Mobile bottom sheet + mini-topology
- No broken interactions

### Rollback
Delete inspector and playback components. Remove scroll-viz wiring.

---

## Step 7a: Homepage Hero Layout + Copy

**Model tier:** default
**Branch:** `v2/hero-layout`
**Depends on:** Step 1b

### Context Brief

Redesign the hero section layout and copy. This step handles the structural changes (removing monument photo, new dark background, first-person copy, layout grid). The "window into the system" CTA is wired in Step 7b after the topology visualization exists.

### Tasks

1. Redesign `src/components/sections/hero.tsx`:
   - Remove `ImageBackground` (monument photo)
   - New dark bg with subtle grid pattern (reuse `bg-grid` or new topology-line pattern)
   - First-person headline: "I build secure systems that survive contact with real networks."
   - Subtitle: systems-security positioning
   - Placeholder CTA area (labeled div) for the system window (Step 7b)
   - Keep scroll indicator
2. Remove unused monument hero image from `public/images/hero/`
3. Update hero animation variants for new layout
4. SSR: headline renders before JS
5. Mobile responsive

### Verification

```bash
npm run build
# Manual: hero shows new copy, placeholder CTA area visible
# Manual: mobile layout works
# Manual: SSR renders heading
```

### Exit Criteria
- Hero communicates systems-security identity
- Monument photo removed
- Placeholder CTA area ready for Step 7b
- Mobile responsive, SSR-safe

### Rollback
Revert hero.tsx to v1. Restore monument image.

---

## Step 7b: System Window CTA

**Model tier:** strongest
**Branch:** `v2/system-window`
**Depends on:** Steps 5, 7a

### Context Brief

Build the "window into the system" — a framed viewport in the hero showing a miniature, readonly topology with animated data pulses. This reuses `topology-view.tsx` from Step 5 in a simplified, non-interactive mode.

### Tasks

1. Create `src/components/ui/system-window.tsx`
   - Glass-bordered frame with subtle glow
   - Embeds `topology-view.tsx` in readonly mode (no layer toggles, no click)
   - Automated data pulse animation along the main request path
   - Hover: subtle scale or brightness increase
   - Click: navigate to `/systems-map`
2. Wire into hero.tsx replacing the placeholder CTA area
3. Ensure lazy-loaded (dynamic import with `ssr: false`)
4. SSR fallback: static text CTA ("Explore the System ->")
5. Mobile: scales down proportionally

### Verification

```bash
npm run build
# Manual: window shows miniature topology in hero
# Manual: click navigates to /systems-map
# Manual: mobile renders scaled window
# Manual: SSR shows fallback text CTA
```

### Exit Criteria
- Window CTA shows live miniature topology
- Click navigates to /systems-map
- Lazy-loaded, SSR-safe with text fallback
- Mobile responsive

### Rollback
Delete system-window.tsx. Revert hero to placeholder CTA.

---

## Step 8a: Content & Data Refresh

**Model tier:** default
**Branch:** `v2/content-refresh`
**Depends on:** Step 1b

### Context Brief

Update homepage content and data to align with v2 identity. Pure content changes — copy rewrites, data restructuring, photo replacements.

### Tasks

1. Update `src/components/sections/about.tsx`:
   - First-person copy: "I build...", "I care about the invisible parts of systems..."
   - Replace monument photo collage with a simpler layout:
     - Option A: Remove photos entirely, text-only with value cards
     - Option B: Single systems-relevant image (architecture diagram or terminal screenshot)
   - Value cards: Protocol Design, Production Operations, Security Engineering, Developer Tooling
2. Update `src/data/projects.ts`:
   - Atlax: update copy, reference open-source, add systems-map link
   - Dashboard: change "Tailscale" to "Atlax" for access method
   - Remove "Secure Remote Access Lab" and "Security Automation Scripts" (superseded)
   - Reorder: Atlax > Vitalis > AtlasShare > Dashboard > Mentalist
3. Update `src/components/sections/featured-projects.tsx`:
   - Atlax as hero project (larger card or distinct treatment)
4. Update `src/components/sections/tech-stack.tsx`:
   - Reflect current stack emphasis
5. Update `src/components/sections/contact.tsx`:
   - Client-facing copy: "Let's build something secure together"

### Verification

```bash
npm run build
# Manual: all sections show updated content
# Manual: no Tailscale-as-current-hosting
# Manual: Atlax prominent in projects
```

### Exit Criteria
- All content first-person, systems-focused
- Atlax is anchor project
- No stale references
- Build passes

### Rollback
Revert section components and data files.

---

## Step 8b: Navbar + Metadata + Layout

**Model tier:** default
**Branch:** `v2/nav-metadata`
**Depends on:** Step 1b

### Context Brief

Structural changes: add Systems Map to navigation, update page metadata and OG description, update layout.tsx.

### Tasks

1. Update `src/components/sections/navbar.tsx`:
   - Add "Systems Map" nav item linking to `/systems-map`
   - Simplified nav: Home, Systems Map, Projects, Blog, Contact
2. Update `src/app/layout.tsx`:
   - Metadata: title, description, keywords reflecting systems-security identity
3. Update `src/app/opengraph-image.tsx`:
   - Reflect v2 identity in OG image

### Verification

```bash
npm run build
# Manual: navbar shows Systems Map link
# Manual: metadata renders in page source
```

### Exit Criteria
- Nav includes Systems Map link
- Metadata updated
- Build passes

### Rollback
Revert navbar, layout, opengraph-image files.

---

## Step 9: Asset Pipeline & Media

**Model tier:** default
**Branch:** `v2/assets`
**Depends on:** Steps 6, 7b, 8a

### Context Brief

Replace placeholder media in scroll sections with real, source-backed diagrams. Create React SVG diagram components. Clean up unused v1 images. Create new OG image.

### Asset Inventory

| Asset | Type | Section | Source |
|-------|------|---------|--------|
| Caddy proxy flow | SVG/React | Scroll S1 | Atlax docs |
| mTLS handshake sequence | SVG/React | Scroll S4 | Threat model |
| Wire protocol frame header | SVG/React | Scroll S4 | Wire format docs |
| Certificate hierarchy tree | SVG/React | Scroll S4 | Atlax README |
| Stream multiplexing diagram | SVG/React | Scroll S4 | Architecture docs |
| CGNAT bypass diagram | SVG/React | Scroll S5 | Atlax README |
| Relay architecture diagram | SVG/React | Scroll S3 | Architecture docs |
| Monitoring overview | SVG/React | Scroll S7 | Ops docs |
| About section visual | SVG/React or image | About | Architecture |
| OG image | PNG (generated) | Metadata | Design system |

### Tasks

1. Create `src/components/diagrams/`:
   - `frame-header.tsx` — 12-byte wire protocol header visualization
   - `cert-hierarchy.tsx` — Root CA -> Intermediate -> Leaf tree
   - `mtls-handshake.tsx` — handshake sequence
   - `request-flow.tsx` — simplified full request path
   - `cgnat-bypass.tsx` — CGNAT problem/solution diagram
   - `relay-architecture.tsx` — relay internal components
2. Wire diagrams into scroll section media slots
3. Create about-section replacement visual (topology mini-diagram or architecture illustration)
4. Remove unused v1 monument/architecture photos from `public/images/`
5. Create new OG image
6. Add alt text to all media
7. Verify all assets render (no 404s)

### Verification

```bash
npm run build
npm run dev  # verify no 404s in console
# Manual: all scroll sections show real diagrams
# Manual: about section has visual
# Manual: OG image renders
```

### Exit Criteria
- All scroll sections have source-backed media
- React SVG diagram components
- About section has replacement visual
- Unused v1 images removed
- OG image updated
- All alt text present

### Rollback
Revert to placeholder media. Restore v1 images.

---

## Step 10: Verification, Polish & Ship

**Model tier:** strongest
**Branch:** `v2/ship`
**Depends on:** All prior steps

### Context Brief

Final verification against acceptance criteria. Performance, accessibility, mobile, deployment, content accuracy.

### Tasks

1. **Build:**
   - `npm run build` zero warnings
   - Bundle audit: topology/canvas lazy-loaded, not in critical path
   - SSR: `/` and `/systems-map` render meaningful HTML without JS
2. **Performance:**
   - Lighthouse 90+ performance score
   - Images optimized (AVIF/WebP via next/image)
   - No heavy assets in critical path
3. **Accessibility:**
   - Keyboard navigation: topology nodes, inspector, scroll sections
   - `prefers-reduced-motion`: all animations respect it
   - Visible focus states on dark UI
   - Sufficient contrast (WCAG AA)
   - Semantic HTML fallback for topology
   - Screen reader labels on interactive elements
4. **Mobile (375px, 768px, 1024px, 1440px):**
   - Touch scroll through trace sections
   - Bottom sheet inspector
   - No text overflow
   - System window CTA scales
5. **Content accuracy:**
   - No Tailscale-as-current-hosting claims
   - No secrets, keys, sensitive data
   - All claims first-person, source-backed
   - Atlax = current production hosting
6. **Deployment:**
   - `output: "standalone"` works
   - Docker build succeeds
   - Static assets included
   - Test through Caddy -> Atlax -> Arch if possible
7. **Cross-browser:** Chrome, Firefox, Safari (desktop + mobile)
   - CSS `animation-timeline` fallback works in Firefox/Safari
8. **Install test framework** (Vitest + React Testing Library):
   - Component render tests for key components
   - E2E scroll test with Playwright (optional, can be follow-up)
9. Document in `docs/task-report/portfolio-v2-ship-<date>.md`

### Verification

```bash
npm run build
npm run lint
npx vitest run
# Lighthouse audit
# Manual: full walkthrough desktop + mobile
# Manual: reduced-motion walkthrough
# Manual: keyboard-only walkthrough
```

### Exit Criteria
- Build passes, zero warnings
- Lighthouse 90+ performance
- Accessibility checks pass
- Mobile responsive all breakpoints
- Content accurate, first-person
- Deployment verified
- Task report filed

### Rollback
Fix forward or revert individual step branches.

---

## Invariants (verified after every step)

1. `npm run build` passes
2. `npm run lint` passes (or only pre-existing warnings)
3. Homepage renders correctly (no v1 regressions until intentionally redesigned)
4. No Tailscale-as-current-hosting claims in any content
5. No secrets, keys, or sensitive data in committed files
6. SSR renders meaningful HTML on both `/` and `/systems-map`
7. `prefers-reduced-motion` produces a usable experience

---

## Anti-Patterns to Avoid

| Anti-Pattern | Why | Alternative |
|-------------|-----|-------------|
| Canvas-only content | Breaks a11y, SSR, SEO | SVG + semantic HTML fallback |
| Generic cyber grid backgrounds | Detached from real system | Topology derived from actual Atlax architecture |
| Decorative animation | Adds load, no meaning | Every animation explains a system property |
| viewport-width font scaling | Readability issues | Responsive type with rem/clamp |
| Negative letter spacing | Readability on dark backgrounds | Standard or slightly loose tracking |
| One-note purple/blue palette | Generic "hacker" aesthetic | Warm amber accent with semantic systems colors |
| Heavy GLB/HDR in critical path | Kills performance | SVG-first, progressive enhancement |
| Third-person bio copy | Cold, corporate | First-person: "I build...", "I care about..." |
| `scroll-behavior: smooth` CSS | Breaks programmatic scroll | Use JS `scrollTo` with behavior smooth |
| Framer Motion `layoutId` in nav | FLIP resets scroll position | CSS transitions for nav indicator |
| GSAP without license audit | Legal risk | CSS scroll-timeline + motion fallback |
| d3-force for static graphs | Over-engineering | Hand-positioned coordinates |
| Three.js for 2D topology | Bundle bloat, WebGL dependency | SVG + canvas overlay |

---

## Mutation Protocol

If scope changes during execution:
- **Add step:** Insert with dependency edges, update graph
- **Split step:** Break into sub-steps with same parent dependencies
- **Skip step:** Mark skipped with reason, verify no downstream breakage
- **Reorder:** Only if dependency edges permit
- **Abandon:** Close with reason, file cleanup bead if needed

All mutations logged as notes on the relevant bead.
