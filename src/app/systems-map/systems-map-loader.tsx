"use client";

import dynamic from "next/dynamic";

const SystemsMapClient = dynamic(() => import("./systems-map-client"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-sm font-mono text-[var(--color-brand-text-muted)]">
        Loading systems map...
      </div>
    </div>
  ),
});

export function SystemsMapLoader() {
  return <SystemsMapClient />;
}
