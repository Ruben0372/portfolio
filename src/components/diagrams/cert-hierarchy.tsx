export function CertHierarchyDiagram({ className = "" }: { className?: string }) {
  const nodeY = [20, 70, 130];
  const cx = 200;

  return (
    <svg
      viewBox="0 0 400 200"
      className={`w-full h-auto ${className}`}
      role="img"
      aria-label="Atlax mTLS certificate hierarchy: Root CA to Intermediate CAs to leaf certificates"
    >
      {/* Root CA */}
      <rect x={cx - 70} y={nodeY[0]} width="140" height="28" rx="6" fill="var(--color-brand-surface)" stroke="var(--color-brand-amber)" strokeWidth="1.5" />
      <text x={cx} y={nodeY[0] + 17} textAnchor="middle" className="text-[9px] font-mono font-bold" fill="var(--color-brand-amber)">
        Root CA (10-year)
      </text>

      {/* Lines to intermediates */}
      <line x1={cx} y1={nodeY[0] + 28} x2={cx - 80} y2={nodeY[1]} stroke="var(--color-brand-border)" strokeWidth="1" />
      <line x1={cx} y1={nodeY[0] + 28} x2={cx + 80} y2={nodeY[1]} stroke="var(--color-brand-border)" strokeWidth="1" />

      {/* Relay Intermediate CA */}
      <rect x={cx - 160} y={nodeY[1]} width="160" height="28" rx="6" fill="var(--color-brand-surface)" stroke="var(--color-map-relay)" strokeWidth="1" />
      <text x={cx - 80} y={nodeY[1] + 17} textAnchor="middle" className="text-[8px] font-mono" fill="var(--color-map-relay)">
        Relay Intermediate CA (3yr)
      </text>

      {/* Customer Intermediate CA */}
      <rect x={cx} y={nodeY[1]} width="170" height="28" rx="6" fill="var(--color-brand-surface)" stroke="var(--color-map-agent)" strokeWidth="1" />
      <text x={cx + 85} y={nodeY[1] + 17} textAnchor="middle" className="text-[8px] font-mono" fill="var(--color-map-agent)">
        Customer Intermediate CA (3yr)
      </text>

      {/* Lines to leaves */}
      <line x1={cx - 80} y1={nodeY[1] + 28} x2={cx - 80} y2={nodeY[2]} stroke="var(--color-brand-border)" strokeWidth="1" />
      <line x1={cx + 85} y1={nodeY[1] + 28} x2={cx + 40} y2={nodeY[2]} stroke="var(--color-brand-border)" strokeWidth="1" />
      <line x1={cx + 85} y1={nodeY[1] + 28} x2={cx + 130} y2={nodeY[2]} stroke="var(--color-brand-border)" strokeWidth="1" />

      {/* Leaf certs */}
      <rect x={cx - 140} y={nodeY[2]} width="120" height="24" rx="4" fill="var(--color-brand-surface)" stroke="var(--color-map-relay)" strokeWidth="0.8" strokeDasharray="4 2" />
      <text x={cx - 80} y={nodeY[2] + 15} textAnchor="middle" className="text-[7px] font-mono" fill="var(--color-map-relay)">
        relay.example.com (90d)
      </text>

      <rect x={cx - 5} y={nodeY[2]} width="100" height="24" rx="4" fill="var(--color-brand-surface)" stroke="var(--color-map-agent)" strokeWidth="0.8" strokeDasharray="4 2" />
      <text x={cx + 45} y={nodeY[2] + 15} textAnchor="middle" className="text-[7px] font-mono" fill="var(--color-map-agent)">
        customer-acme (90d)
      </text>

      <rect x={cx + 100} y={nodeY[2]} width="100" height="24" rx="4" fill="var(--color-brand-surface)" stroke="var(--color-map-agent)" strokeWidth="0.8" strokeDasharray="4 2" />
      <text x={cx + 150} y={nodeY[2] + 15} textAnchor="middle" className="text-[7px] font-mono" fill="var(--color-map-agent)">
        customer-globex (90d)
      </text>

      {/* Labels */}
      <text x={cx} y="195" textAnchor="middle" className="text-[7px] font-mono" fill="var(--color-brand-text-muted)">
        Scoped trust — relay and customer CAs cannot sign for each other
      </text>
    </svg>
  );
}
