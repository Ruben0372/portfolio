'use client';

import { HudPanel } from './HudPanel';
import { techStack } from '@/data/projects';

const categories = Object.entries(techStack) as [string, string[]][];

export function TechOverlay() {
  return (
    <HudPanel position={[6, -1, 15]} enter={0.81} exit={0.89} maxWidth={480}>
      <h2 className="text-2xl font-bold mb-4">Tech Stack</h2>
      <div className="grid grid-cols-2 gap-3">
        {categories.map(([category, items]) => (
          <div key={category}>
            <p className="text-[10px] font-mono uppercase tracking-wider text-amber-400/60 mb-1">
              {category}
            </p>
            <p className="text-xs text-white/50">{items.join(' · ')}</p>
          </div>
        ))}
      </div>
    </HudPanel>
  );
}
