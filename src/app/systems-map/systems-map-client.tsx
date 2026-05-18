"use client";

import { useCallback, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { ScrollTrace } from "@/components/systems-map/scroll-trace";
import {
  TopologyView,
  type TopologyViewHandle,
} from "@/components/systems-map/topology-view";
import { InspectorPanel } from "@/components/systems-map/inspector-panel";
import { scrollSections } from "@/data/scroll-sections";

export default function SystemsMapClient() {
  const shouldReduceMotion = useReducedMotion();
  const topologyRef = useRef<TopologyViewHandle>(null);
  const [inspectedNode, setInspectedNode] = useState<string | null>(null);

  const handleSectionChange = useCallback(
    (sectionId: string) => {
      const section = scrollSections.find((s) => s.id === sectionId);
      if (section && topologyRef.current) {
        topologyRef.current.highlightNodes(section.highlightNodes);
        topologyRef.current.highlightEdges(section.highlightEdges);
      }
    },
    []
  );

  const handleNodeClick = useCallback((nodeId: string) => {
    setInspectedNode(nodeId);
  }, []);

  const handleCloseInspector = useCallback(() => {
    setInspectedNode(null);
  }, []);

  return (
    <div className="relative pb-24">
      {/* Sticky topology view — visible while scrolling on desktop */}
      <div className="hidden lg:block sticky top-20 z-30 mx-auto max-w-6xl px-6 mb-8">
        <div className="bg-[var(--color-brand-surface)]/80 backdrop-blur-sm rounded-xl border border-[var(--color-brand-border)] p-4">
          <TopologyView
            ref={topologyRef}
            showLayers
            onNodeClick={handleNodeClick}
            className="max-h-[200px]"
          />
        </div>
      </div>

      {/* Scroll-driven trace sections */}
      <ScrollTrace onSectionChange={handleSectionChange} />

      {/* Inspector panel */}
      <InspectorPanel
        nodeId={inspectedNode}
        onClose={handleCloseInspector}
      />

      {/* Reduced motion notice */}
      {shouldReduceMotion && (
        <div className="fixed bottom-4 right-4 px-3 py-2 rounded-lg bg-[var(--color-brand-surface)] border border-[var(--color-brand-border)] text-xs text-[var(--color-brand-text-muted)] z-50">
          Reduced motion enabled — static layout active
        </div>
      )}
    </div>
  );
}
