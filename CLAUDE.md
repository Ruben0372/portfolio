# Portfolio Site — ruben.dev

## Overview
Personal portfolio site for Ruben Yomenou — security engineer, solopreneur.
Inspired by obsidianos.com with warm-dark theme, monument photography, and glass morphism effects.

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, standalone output) |
| React | React 19 |
| Styling | Tailwind CSS v4 (PostCSS plugin, CSS variables) |
| Animation | Framer Motion 12 |
| Content | MDX via next-mdx-remote + gray-matter |
| Components | shadcn/ui base + custom glass morphism UI |
| Icons | Lucide React |
| Fonts | Geist Sans, Geist Mono, Playfair Display (variable) |
| Syntax | Shiki + rehype-pretty-code |

## Architecture

### File Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout (fonts, metadata)
│   ├── page.tsx            # Home — assembles all sections
│   ├── globals.css         # Design tokens, glass utilities, prose styles
│   ├── blog/
│   │   ├── page.tsx        # Blog index (getAllPosts)
│   │   └── [slug]/page.tsx # Dynamic blog post (MDXRemote)
│   └── projects/
│       ├── page.tsx        # Projects index
│       └── [slug]/page.tsx # Dynamic project page
├── components/
│   ├── sections/           # Full-page sections (hero, about, projects, etc.)
│   ├── ui/                 # Reusable atomic components
│   └── providers/          # React context providers
├── data/                   # Static data (projects.ts)
├── lib/                    # Utilities (cn, mdx parsing)
└── types/                  # TypeScript interfaces (BlogFrontmatter, etc.)
content/
├── blog/                   # MDX blog posts
└── projects/               # MDX project case studies
public/images/              # Hero, project, and section imagery
```

### Design System (CSS Variables)
```
--color-brand-bg:         #0a0a0b       (dark background)
--color-brand-surface:    #141417       (card/surface)
--color-brand-amber:      #f59e0b       (primary accent)
--color-brand-text:       #faf5e4       (heading text)
--color-brand-text-muted: #a1a1aa       (body text)
--color-brand-success:    #10b981
--color-brand-error:      #ef4444
```

### Custom UI Components
| Component | Purpose |
|-----------|---------|
| `cursor-glow.tsx` | Warm amber radial gradient follows mouse, illuminates grid |
| `back-to-top.tsx` | Fixed button appears after scrolling past hero |
| `tilt-card.tsx` | 3D perspective tilt on hover |
| `focus-card.tsx` | Interactive card grid with expand-on-hover |
| `section-reveal.tsx` | Framer Motion `whileInView` fade-in with stagger |
| `bg-pattern.tsx` | SVG grid/dot background patterns with masking |
| `grid-glow.tsx` | Text that glows on the grid background |
| `image-background.tsx` | Next/Image background with overlay + gradient |
| `typewriter.tsx` | Character-by-character text reveal animation |

### Animation Patterns
- **Hero**: Variants-based stagger animation (`initial="hidden" animate="visible"` on parent only). Children use `variants` prop — prevents re-render scroll resets.
- **Sections**: `whileInView` with `once: true, amount: 0.1` for viewport-triggered reveals.
- **Stagger containers**: Parent orchestrates children via `staggerChildren` + `delayChildren`.
- **Scroll indicator**: Infinite `y: [0, 6, 0]` bounce on ChevronDown.
- **Back-to-top**: `AnimatePresence` enter/exit with scale + opacity.

### Navigation System
- Module-level `scrollToSection()` using `window.scrollTo({ behavior: "smooth" })`.
- `isScrolling` flag prevents IntersectionObserver from triggering `setActiveSection` during programmatic scroll (avoids re-render scroll resets).
- Nav indicator uses plain CSS `opacity` transition (not Framer Motion `layoutId` — that caused FLIP scroll resets).
- Each section has `min-h-screen` for full-page feel.

### Known Gotchas
- **Do NOT use `scroll-behavior: smooth` CSS** — breaks all programmatic scrolling in this setup.
- **Do NOT use Framer Motion `layoutId` in navbar** — FLIP animation resets scroll position.
- **Do NOT use individual `initial`/`animate` on hero children** — re-renders reset animations and fight scroll. Use parent `variants` propagation instead.
- **Lenis smooth scroll was removed** — conflicted with `scrollIntoView` and `window.scrollTo`.

## Development
```bash
npm run dev       # Dev server (port 3000)
npm run build     # Production build (standalone)
npm run lint      # ESLint
```

## Content
Blog posts and project case studies are MDX files in `content/`. Frontmatter schema:

```yaml
# Blog
title: string
date: string (YYYY-MM-DD)
excerpt: string
tags: string[]
published: boolean

# Project
title: string
description: string
tags: string[]
published: boolean
```
