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
        <a href="mailto:jy@rubendev.io" className="block text-sm text-amber-400 hover:text-amber-300 transition-colors">
          jy@rubendev.io
        </a>
        <a href="https://github.com/Ruben0372" target="_blank" rel="noopener noreferrer" className="block text-sm text-white/50 hover:text-white/80 transition-colors">
          github.com/Ruben0372
        </a>
        <a href="https://www.linkedin.com/in/jean-yves-ruben-yomenou" target="_blank" rel="noopener noreferrer" className="block text-sm text-white/50 hover:text-white/80 transition-colors">
          linkedin.com/in/jean-yves-ruben-yomenou
        </a>
      </div>
    </HudPanel>
  );
}
