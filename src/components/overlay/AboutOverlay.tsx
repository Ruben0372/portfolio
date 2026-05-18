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
