"use client";

import type { Layer } from "@/data/topology";
import { cn } from "@/lib/utils";

const layerConfig: { id: Layer; label: string; color: string }[] = [
  { id: "deploy", label: "Deploy", color: "var(--color-map-relay)" },
  { id: "security", label: "Security", color: "var(--color-map-tunnel)" },
  { id: "protocol", label: "Protocol", color: "var(--color-brand-amber)" },
  { id: "ops", label: "Ops", color: "var(--color-map-healthy)" },
  { id: "product", label: "Product", color: "var(--color-map-service)" },
];

interface TopologyLayersProps {
  activeLayer: Layer | null;
  onLayerChange: (layer: Layer | null) => void;
}

export function TopologyLayers({
  activeLayer,
  onLayerChange,
}: TopologyLayersProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-4" role="toolbar" aria-label="Topology layer filters">
      <button
        onClick={() => onLayerChange(null)}
        className={cn(
          "px-3 py-1.5 rounded-full text-xs font-mono transition-all border",
          !activeLayer
            ? "bg-white/10 border-white/20 text-[var(--color-brand-text)]"
            : "bg-transparent border-[var(--color-brand-border)] text-[var(--color-brand-text-muted)] hover:border-white/20"
        )}
      >
        All
      </button>
      {layerConfig.map((layer) => (
        <button
          key={layer.id}
          onClick={() =>
            onLayerChange(activeLayer === layer.id ? null : layer.id)
          }
          className={cn(
            "px-3 py-1.5 rounded-full text-xs font-mono transition-all border",
            activeLayer === layer.id
              ? "bg-white/10 border-white/20 text-[var(--color-brand-text)]"
              : "bg-transparent border-[var(--color-brand-border)] text-[var(--color-brand-text-muted)] hover:border-white/20"
          )}
        >
          <span
            className="inline-block w-2 h-2 rounded-full mr-1.5"
            style={{ backgroundColor: layer.color }}
          />
          {layer.label}
        </button>
      ))}
    </div>
  );
}
