'use client';

import { HudPanel } from './HudPanel';

export function HeroOverlay() {
  return (
    <HudPanel position={[0, 0.5, 0.5]} enter={-0.02} exit={0.14} maxWidth={600}>
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
