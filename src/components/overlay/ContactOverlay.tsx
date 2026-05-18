'use client';
import { HudPanel } from './HudPanel';

export function ContactOverlay() {
  return (
    <HudPanel roomIndex={5} maxWidth={400}>
      <h2 className="text-2xl font-bold mb-4">Let&apos;s Talk</h2>
      <p className="text-sm text-white/60 mb-6">
        Interested in working together? I&apos;m available for systems engineering,
        security consulting, and infrastructure projects.
      </p>
      <div className="space-y-2">
        <a href="mailto:ru93ben@icloud.com" className="block text-sm text-amber-400 hover:text-amber-300 transition-colors">
          ru93ben@icloud.com
        </a>
        <a href="https://github.com/Ruben0372" target="_blank" rel="noopener noreferrer" className="block text-sm text-white/50 hover:text-white/80 transition-colors">
          github.com/Ruben0372
        </a>
      </div>
    </HudPanel>
  );
}
