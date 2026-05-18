// Layer metadata for the systems map topology.
// Each layer represents a lens through which the architecture can be viewed.

import type { Layer } from './topology';

export interface LayerDescription {
  id: Layer;
  label: string;
  shortLabel: string;
  description: string;
  color: string;
  icon: string;
  relevantNodes: string[];
  relevantEdges: string[];
}

export const layerDescriptions: LayerDescription[] = [
  {
    id: 'deploy',
    label: 'Deployment',
    shortLabel: 'Deploy',
    description:
      'Where things run. One relay VPS with a public IP, one agent per customer machine behind CGNAT. Caddy handles ingress. No cloud orchestration — just processes on Linux boxes.',
    color: 'var(--color-map-relay)',
    icon: 'server',
    relevantNodes: ['caddy', 'relay', 'agent', 'local-service'],
    relevantEdges: ['caddy-relay', 'agent-service'],
  },
  {
    id: 'security',
    label: 'Security',
    shortLabel: 'Security',
    description:
      'Trust boundaries and encryption. TLS termination at the edge, mTLS between relay and agent with certificate-based identity. Per-customer port isolation prevents cross-tenant access. No shared secrets — the cert chain is the identity system.',
    color: 'var(--color-map-tunnel)',
    icon: 'shield',
    relevantNodes: ['caddy', 'relay', 'tunnel', 'agent'],
    relevantEdges: ['client-caddy', 'relay-tunnel', 'tunnel-agent'],
  },
  {
    id: 'protocol',
    label: 'Protocol',
    shortLabel: 'Protocol',
    description:
      'The wire format and stream lifecycle. A 12-byte frame header carries multiplexed TCP streams over a single mTLS connection. 11 command types handle open, close, data, ping/pong, and error signaling. The relay speaks this protocol to route streams to the correct agent.',
    color: 'var(--color-map-stream)',
    icon: 'binary',
    relevantNodes: ['relay', 'tunnel', 'agent'],
    relevantEdges: ['relay-tunnel', 'tunnel-agent'],
  },
  {
    id: 'ops',
    label: 'Operations',
    shortLabel: 'Ops',
    description:
      'Health and lifecycle management. The relay evicts dead agents from the registry after missed health checks. Agents reconnect with exponential backoff. Logging surfaces connection events, stream counts, and error rates. No external monitoring dependency for the core path.',
    color: 'var(--color-map-healthy)',
    icon: 'activity',
    relevantNodes: ['relay', 'agent'],
    relevantEdges: ['relay-tunnel', 'tunnel-agent'],
  },
  {
    id: 'product',
    label: 'Product',
    shortLabel: 'Product',
    description:
      'What the end user sees: a working HTTPS endpoint. The client connects to a domain, gets a valid certificate, and receives a response. They never know the server is behind CGNAT, running on a home machine, tunneled through a custom protocol. That invisibility is the product.',
    color: 'var(--color-map-agent)',
    icon: 'globe',
    relevantNodes: ['client', 'local-service'],
    relevantEdges: ['client-caddy', 'agent-service'],
  },
];

export const layerMap = new Map(
  layerDescriptions.map((layer) => [layer.id, layer])
);
