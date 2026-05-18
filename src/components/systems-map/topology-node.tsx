"use client";

import type { TopologyNode as TNode } from "@/data/topology";

const nodeColors: Record<TNode["type"], string> = {
  client: "var(--color-map-client)",
  proxy: "var(--color-map-caddy)",
  relay: "var(--color-map-relay)",
  agent: "var(--color-map-agent)",
  service: "var(--color-map-service)",
};

const nodeIcons: Record<TNode["type"], string> = {
  client: "C",
  proxy: "P",
  relay: "R",
  agent: "A",
  service: "S",
};

interface TopologyNodeProps {
  node: TNode;
  visible: boolean;
  state: "default" | "highlighted" | "active" | "dimmed";
  readonly?: boolean;
  onHover?: (id: string | null) => void;
  onClick?: () => void;
}

export function TopologyNode({
  node,
  visible,
  state,
  readonly,
  onHover,
  onClick,
}: TopologyNodeProps) {
  const color = nodeColors[node.type];
  const opacity = !visible
    ? 0.1
    : state === "dimmed"
      ? 0.3
      : 1;
  const glowRadius = state === "active" ? 3 : state === "highlighted" ? 2 : 0;

  return (
    <g
      transform={`translate(${node.position.x}, ${node.position.y})`}
      opacity={opacity}
      className="transition-opacity duration-300"
      onMouseEnter={() => onHover?.(node.id)}
      onMouseLeave={() => onHover?.(null)}
      onClick={onClick}
      role={readonly ? undefined : "button"}
      tabIndex={readonly ? undefined : 0}
      onKeyDown={(e) => {
        if (!readonly && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick?.();
        }
      }}
      aria-label={`${node.label}: ${node.summary}`}
      style={{ cursor: readonly ? "default" : "pointer" }}
    >
      {/* Glow effect */}
      {glowRadius > 0 && (
        <circle
          r={5 + glowRadius}
          fill="none"
          stroke={color}
          strokeWidth={0.3}
          opacity={0.4}
          className="animate-pulse"
        />
      )}

      {/* Node circle */}
      <circle
        r={4}
        fill="var(--color-brand-surface)"
        stroke={color}
        strokeWidth={state === "active" || state === "highlighted" ? 0.8 : 0.5}
      />

      {/* Icon letter */}
      <text
        textAnchor="middle"
        dominantBaseline="central"
        className="text-[2.5px] font-mono font-bold"
        fill={color}
      >
        {nodeIcons[node.type]}
      </text>

      {/* Label below */}
      <text
        y={7}
        textAnchor="middle"
        className="text-[2.2px] font-mono"
        fill="var(--color-brand-text-muted)"
      >
        {node.label}
      </text>

      {/* Status dot */}
      <circle
        cx={3}
        cy={-3}
        r={0.8}
        fill="var(--color-map-healthy)"
        opacity={visible ? 1 : 0}
      />
    </g>
  );
}
