// Atlax topology data model — hand-positioned nodes with deterministic coordinates.
// No d3-force. Positions are viewport-relative percentages for responsive SVG rendering.

export type Layer = 'deploy' | 'security' | 'protocol' | 'ops' | 'product';

export type NodeType = 'relay' | 'agent' | 'client' | 'service' | 'proxy';

export interface TopologyNode {
  id: string;
  label: string;
  type: NodeType;
  layers: Layer[];
  summary: string;
  publicCopy: string;
  claims: string[];
  position: { x: number; y: number };
}

export interface TopologyEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  layers: Layer[];
  protocol: string;
  animated: boolean;
  style: 'solid' | 'dashed' | 'tunnel';
  description: string;
}

export const topologyNodes: TopologyNode[] = [
  {
    id: 'client',
    label: 'Client',
    type: 'client',
    layers: ['product'],
    summary: 'External client making an HTTPS request to a hosted service.',
    publicCopy:
      'Any browser or API consumer on the public internet — they never know they are hitting a tunnel.',
    claims: [
      'Standard HTTPS connection from any client',
      'No custom software or VPN required on the client side',
    ],
    position: { x: 8, y: 50 },
  },
  {
    id: 'caddy',
    label: 'Caddy',
    type: 'proxy',
    layers: ['deploy', 'security'],
    summary:
      'Reverse proxy on the relay VPS handling TLS termination and automatic certificate renewal.',
    publicCopy:
      'Caddy terminates TLS at the edge, provisions Let\'s Encrypt certificates automatically, and forwards cleartext to the relay on loopback.',
    claims: [
      'Automatic HTTPS with Let\'s Encrypt via ACME',
      'Forwards to relay on 127.0.0.1 — no network exposure',
      'Handles HTTP/2 and connection coalescing',
    ],
    position: { x: 28, y: 50 },
  },
  {
    id: 'relay',
    label: 'Relay',
    type: 'relay',
    layers: ['deploy', 'protocol', 'ops'],
    summary:
      'Central hub on a public VPS. Accepts agent connections, maintains an in-memory registry, and routes client traffic to the correct tunnel.',
    publicCopy:
      'The relay holds the agent registry — a map of customer ports to active tunnel connections. When traffic arrives on a port, it routes to the corresponding agent over mTLS.',
    claims: [
      'In-memory agent registry with health-check eviction',
      'Per-customer port isolation — no cross-tenant routing possible',
      'Runs on a single public VPS with minimal attack surface',
    ],
    position: { x: 48, y: 50 },
  },
  {
    id: 'tunnel',
    label: 'mTLS Tunnel',
    type: 'relay',
    layers: ['security', 'protocol'],
    summary:
      'Virtual edge representing the encrypted mTLS connection between relay and agent with stream multiplexing.',
    publicCopy:
      'A persistent mTLS connection carrying multiplexed TCP streams over a custom 12-byte wire protocol. The agent dials out — no inbound ports needed.',
    claims: [
      'Mutual TLS with certificate-based identity extraction',
      '12-byte frame header: version (1B), command (1B), stream ID (4B), length (4B), flags (2B)',
      '11 command types including stream open/close, data, ping/pong, and error',
      'Agent dials out — works behind CGNAT without port forwarding',
    ],
    position: { x: 65, y: 50 },
  },
  {
    id: 'agent',
    label: 'Agent',
    type: 'agent',
    layers: ['deploy', 'protocol', 'ops'],
    summary:
      'Customer-side daemon running behind CGNAT. Maintains a persistent outbound tunnel to the relay and demuxes streams to local services.',
    publicCopy:
      'The agent runs on the customer\'s machine — behind a firewall, behind CGNAT, behind whatever. It dials out to the relay on startup and keeps the connection alive.',
    claims: [
      'Outbound-only connections — no inbound port forwarding required',
      'Stream demultiplexing routes by service name to local ports',
      'Automatic reconnection with exponential backoff',
      'Lightweight Go binary — single process, no dependencies',
    ],
    position: { x: 82, y: 35 },
  },
  {
    id: 'local-service',
    label: 'Local Service',
    type: 'service',
    layers: ['product', 'deploy'],
    summary:
      'The actual service running on 127.0.0.1 behind the agent — an HTTP server, Samba share, database, or any TCP service.',
    publicCopy:
      'The destination: a service bound to localhost that has no idea it\'s being exposed to the internet. It just sees local connections from the agent.',
    claims: [
      'Bound to 127.0.0.1 — never directly exposed',
      'No modifications needed to the service itself',
      'Supports any TCP-based protocol (HTTP, SMB, PostgreSQL, etc.)',
    ],
    position: { x: 92, y: 65 },
  },
];

export const topologyEdges: TopologyEdge[] = [
  {
    id: 'client-caddy',
    source: 'client',
    target: 'caddy',
    label: 'HTTPS',
    layers: ['product', 'security'],
    protocol: 'TLS 1.3 / HTTP/2',
    animated: true,
    style: 'solid',
    description:
      'Public internet connection terminated by Caddy with automatic Let\'s Encrypt certificates.',
  },
  {
    id: 'caddy-relay',
    source: 'caddy',
    target: 'relay',
    label: 'Loopback',
    layers: ['deploy'],
    protocol: 'TCP (127.0.0.1)',
    animated: true,
    style: 'solid',
    description:
      'Cleartext forwarding on localhost — never leaves the machine. Caddy strips TLS and passes raw TCP to the relay listener.',
  },
  {
    id: 'relay-tunnel',
    source: 'relay',
    target: 'tunnel',
    label: 'Wire Protocol',
    layers: ['protocol', 'security'],
    protocol: 'Custom frame protocol over mTLS',
    animated: true,
    style: 'tunnel',
    description:
      'Multiplexed streams over the persistent mTLS connection using a 12-byte frame header.',
  },
  {
    id: 'tunnel-agent',
    source: 'tunnel',
    target: 'agent',
    label: 'mTLS',
    layers: ['security', 'protocol'],
    protocol: 'TLS 1.3 mutual auth',
    animated: true,
    style: 'tunnel',
    description:
      'The agent maintains this connection — it dials out to the relay. Certificate CN identifies the customer.',
  },
  {
    id: 'agent-service',
    source: 'agent',
    target: 'local-service',
    label: 'Local TCP',
    layers: ['product', 'deploy'],
    protocol: 'TCP (127.0.0.1)',
    animated: true,
    style: 'dashed',
    description:
      'Agent demuxes the stream by service name and connects to the appropriate local port.',
  },
];

export const topology = {
  nodes: topologyNodes,
  edges: topologyEdges,
} as const;
