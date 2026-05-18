"use client";

import { useReducedMotion } from "motion/react";
import { ScrollTrace } from "@/components/systems-map/scroll-trace";

export default function SystemsMapClient() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative pb-24">
      <ScrollTrace />

      {/* Reduced motion notice */}
      {shouldReduceMotion && (
        <div className="fixed bottom-4 right-4 px-3 py-2 rounded-lg bg-[var(--color-brand-surface)] border border-[var(--color-brand-border)] text-xs text-[var(--color-brand-text-muted)] z-50">
          Reduced motion enabled — static layout active
        </div>
      )}
    </div>
  );
}
