# Portfolio Site — rubendev.io

## Overview
Personal portfolio site for Ruben Yomenou (Jean-Yves Ruben Yomenou) — systems security engineer, solopreneur.

The homepage is **not** a conventional scrolling page. It is an **immersive WebGL scene** (Three.js) that visualizes the architecture of **Atlax** — the custom reverse TLS tunnel that actually serves this site. The visitor navigates through a sequence of camera "rooms" and can enter clickable topology nodes to read about each hop of a request through the tunnel. Conventional HTML pages (`/blog`, `/projects`) sit alongside the scene for long-form content.

> The site is served through Atlax (relay VPS + Caddy + outbound mTLS tunnel to a machine behind CGNAT). The 3D topology you explore on the homepage is the real architecture of that hosting path.

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| React | React 19 |
| 3D / WebGL | Three.js + `@react-three/fiber` + `@react-three/drei` + `@react-three/postprocessing` |
| State | Zustand (`src/lib/scroll-store.ts`) |
| Styling | Tailwind CSS v4 (PostCSS plugin, CSS variables) + `tw-animate-css` |
| Content | MDX via `next-mdx-remote` + `gray-matter` |
| Components | shadcn/ui base + custom glass-morphism overlays |
| Icons | Lucide React |
| Fonts | Geist Sans, Geist Mono, Playfair Display (`next/font`) |
| Syntax highlighting | Shiki + `rehype-pretty-code` |

**Note:** There is **no Framer Motion** in this project. All homepage animation is WebGL (Three.js) driven through the `@react-three/fiber` render loop. Animation on the standard pages is plain CSS / Tailwind transitions.

## Architecture

### File Structure
```
src/
├── app/                       # Next.js App Router
│   ├── layout.tsx             # Root layout — fonts, metadata, metadataBase (siteUrl)
│   ├── page.tsx               # Home — dynamically imports <Scene> (ssr:false) + motion-reduce StaticFallback
│   ├── globals.css            # Design tokens (CSS vars), glass utilities, prose-custom styles
│   ├── opengraph-image.tsx    # Generated OG image (edge runtime)
│   ├── icon.svg / apple-icon.svg
│   ├── blog/
│   │   ├── page.tsx           # Blog index (getAllPosts)
│   │   └── [slug]/page.tsx    # Dynamic blog post (MDXRemote)
│   └── projects/
│       ├── page.tsx           # Projects index (renders from data/projects.ts)
│       ├── project-list.tsx   # Client list/card renderer
│       └── [slug]/page.tsx    # Dynamic project page (MDXRemote, from content/projects/*.mdx)
├── components/
│   ├── canvas/                # Three.js scene graph (react-three-fiber)
│   │   ├── Scene.tsx          # Canvas root + WheelHandler; mounts canvas objects + HTML overlays
│   │   ├── Camera.tsx         # Camera rig — flies between room keyframes
│   │   ├── TopologyCloud.tsx  # The Atlax node/edge topology in 3D
│   │   ├── NodeCluster.tsx    # Clickable node clusters
│   │   ├── EdgeStream.tsx     # Animated edges between nodes
│   │   ├── PortalRing.tsx     # Click-to-enter portal rings
│   │   ├── DustField.tsx      # Ambient particle field
│   │   ├── Supernova.tsx      # Background light/effect
│   │   └── PostProcessing.tsx # Bloom / post FX
│   ├── overlay/               # HTML overlays positioned over the canvas (HUD panels)
│   │   ├── HudPanel.tsx       # Shared glass panel; shows/hides based on roomIndex
│   │   ├── HeroOverlay.tsx
│   │   ├── AboutOverlay.tsx
│   │   ├── ProjectsOverlay.tsx
│   │   ├── TechOverlay.tsx
│   │   ├── ContactOverlay.tsx # Email / GitHub / LinkedIn
│   │   ├── ClusterRoom.tsx    # Full-screen content when "inside" a topology node
│   │   └── PortalTransition.tsx # Transition curtain when navigating to /blog or /projects
│   ├── sections/
│   │   ├── navbar.tsx         # Fixed nav (logo, About/Projects/Blog, "Let's Talk")
│   │   └── footer.tsx         # GitHub / LinkedIn / email
│   └── ui/                    # shadcn-style atoms (badge, button, card, separator, tooltip, image-background)
├── data/
│   ├── projects.ts            # Project + services + techStack data (drives /projects index)
│   ├── topology.ts            # Atlax topology: nodes + edges (the 3D graph data model)
│   ├── scroll-sections.ts     # 7 narrative "trace" sections (one per request hop)
│   └── cluster-rooms.ts       # Maps topology nodes → scroll-sections for cluster-room content
├── lib/
│   ├── scroll-store.ts        # Zustand store — room/cluster/portal navigation state
│   ├── mdx.ts                 # MDX read/parse helpers (getAllPosts, getProjectBySlug, …)
│   ├── three-utils.ts         # Three.js helpers
│   └── utils.ts               # cn() etc.
└── types/
    └── mdx.ts                 # BlogFrontmatter, ProjectFrontmatter
content/
├── blog/                      # MDX blog posts
└── projects/                  # MDX project case studies (currently: atlax.mdx)
public/images/                 # Project + section imagery
```

### The WebGL homepage — how navigation works
State lives in **`src/lib/scroll-store.ts`** (Zustand). The homepage is a fixed full-viewport `<Canvas>` with HTML overlays layered on top.

- **Rooms (overview navigation).** `ROOM_COUNT = 6` camera keyframes (`roomKeyframes`): **Hero → About → Topology → Projects → Tech Stack → Contact**. Each keyframe is a camera `position` + `lookAt`.
- **Wheel-driven.** `WheelHandler` in `Scene.tsx` intercepts `wheel` events (debounced 800ms) and calls `nextRoom()` / `prevRoom()`. There is **no native page scroll** on the home route — the wheel drives camera transitions, not document scroll.
- **`Camera.tsx`** interpolates the camera between the current and target room keyframe; `transitioning` guards input until the move completes (`finishTransition`).
- **Overlays** (`HudPanel`-based) read `roomIndex` from the store and show/hide the relevant panel for the active room.
- **Cluster rooms.** Clicking a topology node calls `enterCluster(nodeId, worldPos)`; the camera flies in, then `ClusterRoom.tsx` renders full-screen content for that node. Content comes from `cluster-rooms.ts`, which joins `topology.ts` nodes to `scroll-sections.ts` narrative. `exitCluster()` returns to the overview.
- **Portals.** `startPortal(target)` + `PortalTransition.tsx` play a transition before navigating to a standard route (`/blog`, `/projects`).
- **Reduced motion.** `page.tsx` renders `<Scene>` only under `motion-safe`; a static `StaticFallback` (plain HTML hero) renders under `motion-reduce`.

### The data model (Atlax topology)
- **`data/topology.ts`** — `topologyNodes` (client, caddy, relay, tunnel, agent, local-service) and `topologyEdges`, each tagged with `layers` (`deploy | security | protocol | ops | product`) and hand-positioned coordinates. This is the single source of truth for both the 3D graph and the cluster-room copy.
- **`data/scroll-sections.ts`** — 7 first-person "trace" sections, each narrating one hop of a request through Atlax and referencing `highlightNodes` / `highlightEdges`.
- **`data/cluster-rooms.ts`** — derives per-node room content by matching a node to the scroll-section that highlights it.

### Design System (CSS variables — defined in `globals.css`)
```
--color-brand-bg:           #0a0a0b   (dark background)
--color-brand-surface:      #141417   (card/surface)
--color-brand-surface-2:    #1c1c21
--color-brand-text:         #fafafa
--color-brand-text-heading: #faf5e4
--color-brand-text-muted:   #a1a1aa
--color-brand-amber:        #f59e0b   (primary accent)
--color-brand-amber-hover:  #d97706
--color-brand-blue:         #60a5fa
--color-brand-yellow:       #facc15
--color-brand-success:      #10b981
--color-brand-error:        #ef4444
```
The WebGL scene uses its own near-black clear color (`#050508`).

## Routes
| Route | Source | Notes |
|-------|--------|-------|
| `/` | `app/page.tsx` → `components/canvas/Scene.tsx` | WebGL scene (client-only) + reduced-motion fallback |
| `/projects` | `app/projects/page.tsx` + `data/projects.ts` | Cards rendered inline from the data array |
| `/projects/[slug]` | `content/projects/*.mdx` | `generateStaticParams` from MDX files — currently only `atlax` |
| `/blog` | `content/blog/*.mdx` | Index from `getAllPosts()` (published only) |
| `/blog/[slug]` | `content/blog/*.mdx` | Rendered via `MDXRemote` |

## Content
Blog posts and project case studies are MDX files in `content/`. Frontmatter schemas live in `src/types/mdx.ts`:

```yaml
# Blog (content/blog/*.mdx)
title: string
date: string            # YYYY-MM-DD
excerpt: string
tags: string[]
published: boolean

# Project (content/projects/*.mdx)
title: string
tagline: string
category: string
tech: string[]
featured: boolean
github?: string
live?: string
```

> Note: the `/projects` **index** is driven by `src/data/projects.ts` (a richer `Project[]`), while `/projects/[slug]` **detail** pages are driven by MDX in `content/projects/`. Keep the two in sync if a project needs a detail page.

## Identity / brand (single source of truth)
- **Domain:** `rubendev.io` (root layout fallback `siteUrl`; override at deploy via `NEXT_PUBLIC_SITE_URL`).
- **Contact email:** `jy@rubendev.io`.
- **GitHub:** `github.com/Ruben0372`.
- **LinkedIn:** `linkedin.com/in/jean-yves-ruben-yomenou`.

## Development
```bash
npm run dev       # Dev server (port 3000)
npm run build     # Production build
npm run lint      # ESLint
```

## Gotchas
- **No Framer Motion.** Don't reintroduce scroll/`whileInView` patterns on the homepage — navigation is wheel-driven camera movement via the Zustand store, and native scroll is suppressed there.
- **`Scene` is client-only** (`dynamic(..., { ssr: false })`). Keep WebGL/`three` imports out of server components.
- **Guard navigation with `transitioning` / `insideCluster`** before triggering room or cluster changes, or transitions will fight each other (see `scroll-store.ts`).
- **Reduced motion must keep working** — anything important in the scene needs a counterpart in `StaticFallback` / standard pages.
