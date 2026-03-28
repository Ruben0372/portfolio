# ruben.dev — Portfolio

Security-focused full stack developer portfolio. Built with Next.js 15, Tailwind CSS v4, and Framer Motion.

## Quick Start

```bash
cd portfolio
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Adding 21st.dev Components

Once the base is running, install shadcn/ui and pull components from 21st.dev:

```bash
npx shadcn@latest init
# Then browse https://21st.dev and install components:
npx shadcn@latest add <component-name>
```

## Deploy to Vercel

```bash
npm install -g vercel
vercel
```

## Structure

```
src/
  app/              Pages (App Router)
    page.tsx        Home
    projects/       Projects gallery
    about/          About page
    contact/        Contact page
  components/
    sections/       Page sections (Hero, Services, etc.)
    ui/             Reusable UI components (shadcn/21st.dev)
  data/
    projects.ts     Project data and services
  lib/
    utils.ts        Utility functions
```

## Customization

- **Colors**: Edit CSS variables in `src/app/globals.css` under `@theme`
- **Projects**: Edit `src/data/projects.ts` to add/remove projects
- **Content**: Each page is a standalone file in `src/app/`
