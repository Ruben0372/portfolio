"use client";

import { useState, useCallback, useImperativeHandle, forwardRef } from "react";
import { topologyNodes, topologyEdges, type Layer } from "@/data/topology";
import { TopologyNode } from "./topology-node";
import { TopologyEdge } from "./topology-edge";
import { TopologyLayers } from "./topology-layers";

export interface TopologyViewHandle {
  highlightNodes: (ids: string[]) => void;
  highlightEdges: (ids: string[]) => void;
  resetHighlights: () => void;
}

interface TopologyViewProps {
  readonly?: boolean;
  showLayers?: boolean;
  className?: string;
  onNodeClick?: (nodeId: string) => void;
}

export const TopologyView = forwardRef<TopologyViewHandle, TopologyViewProps>(
  function TopologyView(
    { readonly = false, showLayers = true, className = "", onNodeClick },
    ref
  ) {
    const [activeLayer, setActiveLayer] = useState<Layer | null>(null);
    const [highlightedNodes, setHighlightedNodes] = useState<Set<string>>(
      new Set()
    );
    const [highlightedEdges, setHighlightedEdges] = useState<Set<string>>(
      new Set()
    );
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);

    useImperativeHandle(ref, () => ({
      highlightNodes: (ids: string[]) => setHighlightedNodes(new Set(ids)),
      highlightEdges: (ids: string[]) => setHighlightedEdges(new Set(ids)),
      resetHighlights: () => {
        setHighlightedNodes(new Set());
        setHighlightedEdges(new Set());
      },
    }));

    const isNodeVisible = useCallback(
      (nodeId: string) => {
        if (!activeLayer) return true;
        const node = topologyNodes.find((n) => n.id === nodeId);
        return node ? node.layers.includes(activeLayer) : false;
      },
      [activeLayer]
    );

    const isEdgeVisible = useCallback(
      (edgeId: string) => {
        if (!activeLayer) return true;
        const edge = topologyEdges.find((e) => e.id === edgeId);
        return edge ? edge.layers.includes(activeLayer) : false;
      },
      [activeLayer]
    );

    const getNodeState = useCallback(
      (nodeId: string) => {
        if (highlightedNodes.size === 0 && !hoveredNode) return "default";
        if (hoveredNode === nodeId) return "active";
        if (highlightedNodes.has(nodeId)) return "highlighted";
        if (highlightedNodes.size > 0 || hoveredNode) return "dimmed";
        return "default";
      },
      [highlightedNodes, hoveredNode]
    );

    const getEdgeState = useCallback(
      (edgeId: string) => {
        if (highlightedEdges.size === 0) return "default";
        if (highlightedEdges.has(edgeId)) return "highlighted";
        return "dimmed";
      },
      [highlightedEdges]
    );

    return (
      <div className={className}>
        {showLayers && !readonly && (
          <TopologyLayers
            activeLayer={activeLayer}
            onLayerChange={setActiveLayer}
          />
        )}

        <svg
          viewBox="0 0 100 100"
          className="w-full h-auto"
          role="img"
          aria-label="Atlax network topology showing the request path from client to local service"
        >
          {/* Trust zone backgrounds */}
          <rect
            x="22"
            y="30"
            width="35"
            height="45"
            className="trust-zone"
            opacity={activeLayer === "security" || !activeLayer ? 0.4 : 0.1}
          />
          <text
            x="39.5"
            y="34"
            textAnchor="middle"
            className="fill-[var(--color-map-tunnel)] text-[1.8px] font-mono opacity-50"
          >
            Relay VPS
          </text>

          <rect
            x="75"
            y="18"
            width="23"
            height="60"
            className="trust-zone"
            opacity={activeLayer === "security" || !activeLayer ? 0.4 : 0.1}
          />
          <text
            x="86.5"
            y="22"
            textAnchor="middle"
            className="fill-[var(--color-map-agent)] text-[1.8px] font-mono opacity-50"
          >
            Behind CGNAT
          </text>

          {/* Edges */}
          {topologyEdges.map((edge) => (
            <TopologyEdge
              key={edge.id}
              edge={edge}
              nodes={topologyNodes}
              visible={isEdgeVisible(edge.id)}
              state={getEdgeState(edge.id)}
            />
          ))}

          {/* Nodes */}
          {topologyNodes.map((node) => (
            <TopologyNode
              key={node.id}
              node={node}
              visible={isNodeVisible(node.id)}
              state={getNodeState(node.id)}
              readonly={readonly}
              onHover={readonly ? undefined : setHoveredNode}
              onClick={
                readonly
                  ? undefined
                  : () => onNodeClick?.(node.id)
              }
            />
          ))}
        </svg>
      </div>
    );
  }
);
