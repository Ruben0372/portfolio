"use client";

import Link from "next/link";
import { TopologyView } from "@/components/systems-map/topology-view";

interface SystemWindowProps {
  className?: string;
}

export function SystemWindow({ className = "" }: SystemWindowProps) {
  return (
    <Link
      href="/systems-map"
      className={`group inline-block ${className}`}
      aria-label="Explore the systems map — see how this site is served through Atlax"
    >
      <div className="relative w-80 sm:w-96 h-48 sm:h-56 rounded-xl border border-[var(--color-brand-border)] bg-[var(--color-brand-surface)]/50 backdrop-blur-sm overflow-hidden transition-all group-hover:border-[var(--color-brand-amber)]/30 group-hover:shadow-[0_0_40px_rgba(245,158,11,0.08)]">
        {/* Live topology in readonly mode */}
        <div className="p-3 h-full opacity-40 group-hover:opacity-60 transition-opacity">
          <TopologyView readonly showLayers={false} />
        </div>

        {/* Window label overlay */}
        <div className="absolute bottom-3 left-0 right-0 text-center">
          <span className="text-xs font-mono text-[var(--color-brand-text-muted)] group-hover:text-[var(--color-brand-amber)] transition-colors">
            Explore the System &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}
