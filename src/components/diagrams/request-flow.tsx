export function RequestFlowDiagram({ className = "" }: { className?: string }) {
  const nodes = [
    { x: 30, y: 80, label: "Client", color: "var(--color-map-client)", icon: "C" },
    { x: 120, y: 80, label: "Caddy", color: "var(--color-map-caddy)", icon: "P" },
    { x: 210, y: 80, label: "Relay", color: "var(--color-map-relay)", icon: "R" },
    { x: 300, y: 80, label: "Agent", color: "var(--color-map-agent)", icon: "A" },
    { x: 370, y: 80, label: "Service", color: "var(--color-map-service)", icon: "S" },
  ];

  const edges = [
    { x1: 44, x2: 106, label: "HTTPS", color: "var(--color-map-caddy)" },
    { x1: 134, x2: 196, label: "Loopback", color: "var(--color-brand-border)" },
    { x1: 224, x2: 286, label: "mTLS tunnel", color: "var(--color-map-tunnel)", dashed: true },
    { x1: 314, x2: 356, label: "Local TCP", color: "var(--color-map-agent)" },
  ];

  return (
    <svg
      viewBox="0 0 400 160"
      className={`w-full h-auto ${className}`}
      role="img"
      aria-label="Request flow: Client to Caddy to Relay to Agent to Local Service"
    >
      <text x="200" y="20" textAnchor="middle" className="text-[10px] font-mono" fill="var(--color-brand-text-muted)">
        Request Path
      </text>

      {/* Edges */}
      {edges.map((edge) => (
        <g key={edge.label}>
          <line
            x1={edge.x1}
            y1={80}
            x2={edge.x2}
            y2={80}
            stroke={edge.color}
            strokeWidth={edge.dashed ? 1.5 : 1}
            strokeDasharray={edge.dashed ? "4 2" : "none"}
          />
          <text
            x={(edge.x1 + edge.x2) / 2}
            y={72}
            textAnchor="middle"
            className="text-[6px] font-mono"
            fill="var(--color-brand-text-muted)"
          >
            {edge.label}
          </text>
          {/* Animated pulse */}
          <circle r="3" fill={edge.color} opacity="0.6">
            <animateMotion
              dur="3s"
              repeatCount="indefinite"
              path={`M${edge.x1},80 L${edge.x2},80`}
            />
          </circle>
        </g>
      ))}

      {/* Nodes */}
      {nodes.map((node) => (
        <g key={node.label}>
          <circle
            cx={node.x}
            cy={node.y}
            r="14"
            fill="var(--color-brand-surface)"
            stroke={node.color}
            strokeWidth="1.5"
          />
          <text
            x={node.x}
            y={node.y + 1}
            textAnchor="middle"
            dominantBaseline="central"
            className="text-[9px] font-mono font-bold"
            fill={node.color}
          >
            {node.icon}
          </text>
          <text
            x={node.x}
            y={node.y + 28}
            textAnchor="middle"
            className="text-[7px] font-mono"
            fill="var(--color-brand-text-muted)"
          >
            {node.label}
          </text>
        </g>
      ))}

      {/* Trust zones */}
      <rect x="100" y="55" width="140" height="55" rx="8" fill="none" stroke="var(--color-map-tunnel)" strokeWidth="0.5" strokeDasharray="3 2" opacity="0.3" />
      <text x="170" y="52" textAnchor="middle" className="text-[5px] font-mono" fill="var(--color-map-tunnel)" opacity="0.5">
        Relay VPS
      </text>

      <rect x="280" y="55" width="110" height="55" rx="8" fill="none" stroke="var(--color-map-agent)" strokeWidth="0.5" strokeDasharray="3 2" opacity="0.3" />
      <text x="335" y="52" textAnchor="middle" className="text-[5px] font-mono" fill="var(--color-map-agent)" opacity="0.5">
        Behind CGNAT
      </text>
    </svg>
  );
}
