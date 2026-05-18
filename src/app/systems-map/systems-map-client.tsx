"use client";

import { useReducedMotion } from "motion/react";
import { scrollSections } from "@/data/scroll-sections";

export default function SystemsMapClient() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative">
      {/* Scroll-driven trace sections — placeholder for Step 4 */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="space-y-32">
          {scrollSections.map((section, index) => (
            <div
              key={section.id}
              className="grid lg:grid-cols-2 gap-12 items-center min-h-[60vh]"
            >
              {/* Media panel — placeholder */}
              <div className="aspect-video rounded-2xl bg-[var(--color-brand-surface)] border border-[var(--color-brand-border)] flex items-center justify-center">
                <span className="font-mono text-xs text-[var(--color-brand-text-muted)]">
                  [{section.media.type}] {section.media.alt}
                </span>
              </div>

              {/* Copy panel */}
              <div>
                <span className="font-mono text-xs text-[var(--color-brand-amber)] tracking-widest uppercase">
                  {String(index + 1).padStart(2, "0")} / {String(scrollSections.length).padStart(2, "0")}
                </span>
                <h2 className="mt-3 font-heading text-2xl sm:text-3xl font-bold text-[var(--color-brand-text-heading)]">
                  {section.title}
                </h2>
                <p className="mt-4 text-[var(--color-brand-text-muted)] leading-relaxed">
                  {section.body}
                </p>
                {section.layer && (
                  <span className="inline-block mt-4 px-3 py-1 rounded-full text-xs font-mono bg-[var(--color-brand-surface-2)] text-[var(--color-brand-text-muted)] border border-[var(--color-brand-border)]">
                    Layer: {section.layer}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reduced motion notice */}
      {shouldReduceMotion && (
        <div className="fixed bottom-4 right-4 px-3 py-2 rounded-lg bg-[var(--color-brand-surface)] border border-[var(--color-brand-border)] text-xs text-[var(--color-brand-text-muted)]">
          Reduced motion enabled — static layout active
        </div>
      )}
    </div>
  );
}
