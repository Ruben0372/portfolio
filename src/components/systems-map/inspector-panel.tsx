"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { topologyNodes } from "@/data/topology";

interface InspectorPanelProps {
  nodeId: string | null;
  onClose: () => void;
}

export function InspectorPanel({ nodeId, onClose }: InspectorPanelProps) {
  const node = nodeId
    ? topologyNodes.find((n) => n.id === nodeId)
    : null;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (nodeId) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [nodeId, handleKeyDown]);

  return (
    <AnimatePresence>
      {node && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={onClose}
          />

          {/* Panel — slide from right on desktop, bottom sheet on mobile */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-96 z-50 bg-[var(--color-brand-bg)] border-l border-[var(--color-brand-border)] overflow-y-auto
              max-lg:top-auto max-lg:left-0 max-lg:right-0 max-lg:bottom-0 max-lg:w-full max-lg:h-[70vh] max-lg:rounded-t-2xl max-lg:border-l-0 max-lg:border-t"
            role="dialog"
            aria-label={`Details for ${node.label}`}
          >
            {/* Header */}
            <div className="sticky top-0 bg-[var(--color-brand-bg)]/95 backdrop-blur-sm border-b border-[var(--color-brand-border)] px-6 py-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-[var(--color-brand-amber)] tracking-widest uppercase">
                  {node.type}
                </span>
                <h3 className="mt-1 font-heading text-xl font-bold text-[var(--color-brand-text-heading)]">
                  {node.label}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                aria-label="Close inspector"
              >
                <X className="h-4 w-4 text-[var(--color-brand-text-muted)]" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-6 space-y-6">
              {/* Summary */}
              <div>
                <p className="text-sm text-[var(--color-brand-text-muted)] leading-relaxed">
                  {node.publicCopy}
                </p>
              </div>

              {/* Claims */}
              <div>
                <h4 className="text-xs font-mono tracking-widest uppercase text-[var(--color-brand-text-muted)] mb-3">
                  What this proves
                </h4>
                <ul className="space-y-2">
                  {node.claims.map((claim, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-[var(--color-brand-text-muted)]"
                    >
                      <span className="text-[var(--color-brand-amber)] mt-0.5 shrink-0">
                        &bull;
                      </span>
                      {claim}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Layers */}
              <div>
                <h4 className="text-xs font-mono tracking-widest uppercase text-[var(--color-brand-text-muted)] mb-3">
                  Layers
                </h4>
                <div className="flex flex-wrap gap-2">
                  {node.layers.map((layer) => (
                    <span
                      key={layer}
                      className="px-2.5 py-1 rounded-full text-xs font-mono bg-[var(--color-brand-surface-2)] text-[var(--color-brand-text-muted)] border border-[var(--color-brand-border)]"
                    >
                      {layer}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
