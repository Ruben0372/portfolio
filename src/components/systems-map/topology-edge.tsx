"use client";

import type { TopologyEdge as TEdge, TopologyNode as TNode } from "@/data/topology";

const edgeColors: Record<TEdge["style"], string> = {
  solid: "var(--color-brand-border)",
  dashed: "var(--color-map-agent)",
  tunnel: "var(--color-map-tunnel)",
};

interface TopologyEdgeProps {
  edge: TEdge;
  nodes: TNode[];
  visible: boolean;
  state: "default" | "highlighted" | "dimmed";
}

export function TopologyEdge({ edge, nodes, visible, state }: TopologyEdgeProps) {
  const source = nodes.find((n) => n.id === edge.source);
  const target = nodes.find((n) => n.id === edge.target);
  if (!source || !target) return null;

  const color = edgeColors[edge.style];
  const opacity = !visible ? 0.05 : state === "dimmed" ? 0.15 : 0.8;
  const strokeWidth = edge.style === "tunnel" ? 0.8 : 0.5;
  const dashArray = edge.style === "dashed" ? "1.5 1" : edge.style === "tunnel" ? "none" : "none";

  const x1 = source.position.x;
  const y1 = source.position.y;
  const x2 = target.position.x;
  const y2 = target.position.y;

  const pathId = `edge-path-${edge.id}`;

  return (
    <g opacity={opacity} className="transition-opacity duration-300">
      {/* Glow for tunnel edges */}
      {edge.style === "tunnel" && state === "highlighted" && (
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={color}
          strokeWidth={2}
          opacity={0.15}
          strokeLinecap="round"
        />
      )}

      {/* Edge line */}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={dashArray}
        strokeLinecap="round"
      />

      {/* Animated pulse dot for active edges */}
      {edge.animated && state !== "dimmed" && visible && (
        <>
          <path
            id={pathId}
            d={`M${x1},${y1} L${x2},${y2}`}
            fill="none"
            stroke="none"
          />
          <circle r={0.6} fill={color}>
            <animateMotion
              dur="3s"
              repeatCount="indefinite"
              path={`M${x1},${y1} L${x2},${y2}`}
            />
          </circle>
        </>
      )}

      {/* Edge label at midpoint */}
      <text
        x={(x1 + x2) / 2}
        y={(y1 + y2) / 2 - 1.5}
        textAnchor="middle"
        className="text-[1.6px] font-mono"
        fill="var(--color-brand-text-muted)"
        opacity={state === "highlighted" || state === "default" ? 0.7 : 0.3}
      >
        {edge.label}
      </text>
    </g>
  );
}
