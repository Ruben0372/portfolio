'use client';

import { topologyNodes } from '@/data/topology';
import { toWorld, activeNodeIndex } from '@/lib/three-utils';
import { useScrollStore } from '@/lib/scroll-store';
import { HudPanel } from './HudPanel';

const worldPositions = topologyNodes.map(toWorld);

export function NodeOverlay() {
  const scroll = useScrollStore((s) => s.scroll);
  const idx = activeNodeIndex(scroll);

  if (idx < 0) return null;

  const node = topologyNodes[idx];
  const pos = worldPositions[idx];
  const panelPos: [number, number, number] = [pos.x + 4, pos.y + 2, pos.z + 5];
  const subEnter = 0.30 + (idx / 6) * 0.35;
  const subExit = subEnter + 0.35 / 6;

  return (
    <HudPanel position={panelPos} enter={subEnter} exit={subExit} maxWidth={400}>
      <p className="text-xs font-mono tracking-[0.15em] uppercase text-amber-400 mb-2">
        {node.label}
      </p>
      <p className="text-sm text-white/70 leading-relaxed mb-4">
        {node.publicCopy}
      </p>
      <ul className="space-y-2">
        {node.claims.map((claim, i) => (
          <li key={i} className="text-xs text-white/50 flex items-start gap-2">
            <span className="text-amber-400/60 mt-0.5">&#9656;</span>
            {claim}
          </li>
        ))}
      </ul>
    </HudPanel>
  );
}
