'use client';

import { HudPanel } from './HudPanel';
import { projects } from '@/data/projects';
import { useScrollStore } from '@/lib/scroll-store';

const featured = projects.filter((p) => p.featured);

export function ProjectsOverlay() {
  const startPortal = useScrollStore((s) => s.startPortal);

  return (
    <HudPanel enter={0.66} exit={0.79} align="left" maxWidth={560}>
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
