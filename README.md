# rubendev.io — Portfolio

Personal portfolio for Ruben Yomenou — systems security engineer. The homepage is an interactive **WebGL scene** (Three.js) that visualizes the architecture of **Atlax**, the custom reverse TLS tunnel that serves this site. Standard `/blog` and `/projects` pages handle long-form content.

Built with **Next.js 15 (App Router)**, **React 19**, **Three.js / react-three-fiber**, **Zustand**, **Tailwind CSS v4**, and **MDX**. (No Framer Motion.)

## Quick Start

```bash
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run build      # production build
npm run lint       # ESLint
```

## Structure

```
src/
  app/                 App Router pages
    page.tsx           Home — WebGL <Scene> (client-only) + reduced-motion fallback
    blog/              Blog index + [slug] (MDX)
    projects/          Projects index + [slug] (MDX)
  components/
    canvas/            Three.js scene graph (Scene, Camera, TopologyCloud, …)
    overlay/           HTML HUD panels layered over the canvas
    sections/          Navbar, footer
    ui/                shadcn-style atoms
  data/
    projects.ts        Project / services / techStack data (drives /projects)
    topology.ts        Atlax topology nodes + edges (the 3D graph)
    scroll-sections.ts Narrative "trace" sections, one per request hop
    cluster-rooms.ts   Joins topology nodes → narrative for cluster rooms
  lib/
    scroll-store.ts    Zustand store — room / cluster / portal navigation
    mdx.ts             MDX read/parse helpers
content/
  blog/                MDX blog posts
  projects/            MDX project case studies
```

See [`CLAUDE.md`](./CLAUDE.md) for the full architecture, the WebGL navigation model, and brand/identity references.

## Content

Add posts/projects as MDX in `content/blog/` and `content/projects/`. Frontmatter schemas are in `src/types/mdx.ts`. The `/projects` index is driven by `src/data/projects.ts`; `/projects/[slug]` detail pages are driven by MDX files.

## Deploy

Set `NEXT_PUBLIC_SITE_URL` (e.g. `https://rubendev.io`) so metadata, canonical URLs, and OG tags resolve correctly.
