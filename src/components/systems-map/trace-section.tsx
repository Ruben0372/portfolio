"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import type { ScrollSection } from "@/data/scroll-sections";

interface TraceSectionProps {
  section: ScrollSection;
  index: number;
  total: number;
  onEnterView?: (sectionId: string) => void;
}

export function TraceSection({
  section,
  index,
  total,
  onEnterView,
}: TraceSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.4 });
  const shouldReduceMotion = useReducedMotion();

  // Notify parent when section enters view
  if (isInView && onEnterView) {
    onEnterView(section.id);
  }

  const animationProps = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 40 },
        animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 },
        transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
      };

  const mediaAnimationProps = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, scale: 0.95 },
        animate: isInView
          ? { opacity: 1, scale: 1 }
          : { opacity: 0, scale: 0.95 },
        transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const },
      };

  return (
    <div
      ref={ref}
      className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[70vh] py-16"
    >
      {/* Media panel */}
      <motion.div
        {...mediaAnimationProps}
        className={`relative aspect-video rounded-2xl overflow-hidden border border-[var(--color-brand-border)] bg-[var(--color-brand-surface)] ${
          index % 2 === 1 ? "lg:order-2" : ""
        }`}
      >
        {/* Placeholder — will be replaced with real diagrams in Step 9 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
          <span className="font-mono text-xs text-[var(--color-brand-amber)] mb-2">
            [{section.media.type}]
          </span>
          <span className="text-sm text-[var(--color-brand-text-muted)]">
            {section.media.alt}
          </span>
        </div>

        {/* Layer badge */}
        <div className="absolute top-3 right-3">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/5 text-[var(--color-brand-text-muted)] border border-white/10">
            {section.layer}
          </span>
        </div>
      </motion.div>

      {/* Copy panel */}
      <motion.div
        {...animationProps}
        className={index % 2 === 1 ? "lg:order-1" : ""}
      >
        <span className="font-mono text-xs text-[var(--color-brand-amber)] tracking-widest">
          {String(index + 1).padStart(2, "0")} /{" "}
          {String(total).padStart(2, "0")}
        </span>

        <h2 className="mt-3 font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--color-brand-text-heading)] leading-tight">
          {section.title}
        </h2>

        <p className="mt-5 text-[var(--color-brand-text-muted)] leading-relaxed text-sm sm:text-base">
          {section.body}
        </p>

        {/* Highlighted protocol/technical detail */}
        {section.highlightEdges.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {section.highlightNodes.map((nodeId) => (
              <span
                key={nodeId}
                className="px-2.5 py-1 rounded-lg text-xs font-mono bg-[var(--color-brand-surface-2)] text-[var(--color-brand-text-muted)] border border-[var(--color-brand-border)]"
              >
                {nodeId}
              </span>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
