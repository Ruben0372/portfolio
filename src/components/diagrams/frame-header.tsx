export function FrameHeaderDiagram({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 200"
      className={`w-full h-auto ${className}`}
      role="img"
      aria-label="Atlax wire protocol 12-byte frame header layout"
    >
      {/* Title */}
      <text x="200" y="20" textAnchor="middle" className="text-[11px] font-mono" fill="var(--color-brand-text-muted)">
        12-Byte Frame Header
      </text>

      {/* Header fields */}
      {[
        { x: 20, w: 60, label: "Version", sub: "1B", color: "var(--color-map-relay)" },
        { x: 82, w: 70, label: "Command", sub: "1B", color: "var(--color-brand-amber)" },
        { x: 154, w: 55, label: "Flags", sub: "1B", color: "var(--color-map-tunnel)" },
        { x: 211, w: 55, label: "Rsvd", sub: "1B", color: "var(--color-brand-border)" },
      ].map((field) => (
        <g key={field.label}>
          <rect
            x={field.x}
            y="35"
            width={field.w}
            height="30"
            rx="4"
            fill="var(--color-brand-surface)"
            stroke={field.color}
            strokeWidth="1"
          />
          <text x={field.x + field.w / 2} y="53" textAnchor="middle" className="text-[9px] font-mono" fill={field.color}>
            {field.label}
          </text>
          <text x={field.x + field.w / 2} y="80" textAnchor="middle" className="text-[7px] font-mono" fill="var(--color-brand-text-muted)">
            {field.sub}
          </text>
        </g>
      ))}

      {/* Row 2: Stream ID */}
      <rect x="20" y="95" width="245" height="30" rx="4" fill="var(--color-brand-surface)" stroke="var(--color-map-stream)" strokeWidth="1" />
      <text x="142" y="113" textAnchor="middle" className="text-[9px] font-mono" fill="var(--color-map-stream)">
        Stream ID
      </text>
      <text x="142" y="140" textAnchor="middle" className="text-[7px] font-mono" fill="var(--color-brand-text-muted)">
        4 bytes — Big-endian, odd=relay, even=agent
      </text>

      {/* Row 3: Payload Length */}
      <rect x="20" y="150" width="245" height="30" rx="4" fill="var(--color-brand-surface)" stroke="var(--color-map-agent)" strokeWidth="1" />
      <text x="142" y="168" textAnchor="middle" className="text-[9px] font-mono" fill="var(--color-map-agent)">
        Payload Length
      </text>
      <text x="142" y="195" textAnchor="middle" className="text-[7px] font-mono" fill="var(--color-brand-text-muted)">
        4 bytes — Max 16MB per frame
      </text>

      {/* Commands list */}
      <g>
        <text x="300" y="45" textAnchor="middle" className="text-[8px] font-mono" fill="var(--color-brand-text-muted)">Commands</text>
        {["STREAM_OPEN", "STREAM_DATA", "STREAM_CLOSE", "PING / PONG", "WINDOW_UPDATE", "GOAWAY"].map((cmd, i) => (
          <text key={cmd} x="300" y={60 + i * 14} textAnchor="middle" className="text-[7px] font-mono" fill="var(--color-brand-amber)">
            {cmd}
          </text>
        ))}
      </g>
    </svg>
  );
}
