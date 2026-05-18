// 7 scroll-driven trace sections for the systems map.
// Each section traces one hop of a request through the Atlax architecture.
// Copy is first-person, source-backed, no Tailscale claims.

import type { Layer } from './topology';

export type MediaType = 'image' | 'diagram' | 'code';

export interface SectionMedia {
  type: MediaType;
  src: string;
  alt: string;
}

export interface ScrollSection {
  id: string;
  index: number;
  title: string;
  body: string;
  media: SectionMedia;
  layer: Layer;
  highlightNodes: string[];
  highlightEdges: string[];
}

export const scrollSections: ScrollSection[] = [
  {
    id: 'request-arrives',
    index: 0,
    title: 'A request arrives',
    body: `A client sends an HTTPS request to a domain I host. They don't know — and don't need to know — that the server behind it is sitting in my apartment. The request hits Caddy on a VPS with a public IP. That's the only machine with an inbound port open.`,
    media: {
      type: 'diagram',
      src: 'request-flow',
      alt: 'Client sending HTTPS request to Caddy reverse proxy on the relay VPS',
    },
    layer: 'product',
    highlightNodes: ['client', 'caddy'],
    highlightEdges: ['client-caddy'],
  },
  {
    id: 'tls-termination',
    index: 1,
    title: 'TLS termination',
    body: `Caddy handles the TLS handshake — automatic Let's Encrypt certificates, HTTP/2, the works. Once the connection is decrypted, it forwards the cleartext to a port on 127.0.0.1. The traffic never leaves the machine. Caddy's job is done: terminate TLS at the edge, pass it inward.`,
    media: {
      type: 'diagram',
      src: 'caddy-tls',
      alt: 'Caddy terminating TLS and forwarding to loopback',
    },
    layer: 'security',
    highlightNodes: ['caddy', 'relay'],
    highlightEdges: ['caddy-relay'],
  },
  {
    id: 'relay-routes',
    index: 2,
    title: 'The relay routes',
    body: `The relay picks up the traffic on its local listener. It checks the agent registry — an in-memory map of customer ports to active tunnel connections. Each customer gets their own port. No cross-tenant routing is possible. The relay finds the right tunnel and starts a new stream.`,
    media: {
      type: 'diagram',
      src: 'relay-architecture',
      alt: 'Relay checking agent registry and routing to the correct tunnel',
    },
    layer: 'protocol',
    highlightNodes: ['relay'],
    highlightEdges: ['caddy-relay', 'relay-tunnel'],
  },
  {
    id: 'the-tunnel',
    index: 3,
    title: 'The tunnel',
    body: `This is the core of Atlax. A persistent mTLS connection between the relay and the agent, carrying multiplexed TCP streams over a custom wire protocol. The frame header is 12 bytes: version, command, stream ID, payload length, and flags. 11 command types handle stream lifecycle, data transfer, health checks, and errors. The certificate CN identifies the customer — no tokens, no API keys.`,
    media: {
      type: 'code',
      src: 'frame-header',
      alt: '12-byte wire protocol frame header structure',
    },
    layer: 'protocol',
    highlightNodes: ['relay', 'tunnel', 'agent'],
    highlightEdges: ['relay-tunnel', 'tunnel-agent'],
  },
  {
    id: 'behind-cgnat',
    index: 4,
    title: 'Behind CGNAT',
    body: `The agent sits behind carrier-grade NAT — no public IP, no port forwarding, no UPnP. It doesn't need any of that. On startup, it dials out to the relay and keeps the connection alive. All traffic flows over this single outbound connection. The ISP never sees an inbound port open.`,
    media: {
      type: 'diagram',
      src: 'cgnat-bypass',
      alt: 'Agent behind CGNAT dialing out to relay — no inbound ports needed',
    },
    layer: 'deploy',
    highlightNodes: ['tunnel', 'agent'],
    highlightEdges: ['tunnel-agent'],
  },
  {
    id: 'local-delivery',
    index: 5,
    title: 'Local delivery',
    body: `The agent demuxes the stream by service name and connects to the appropriate port on 127.0.0.1. The local service — an HTTP server, a Samba share, a database — has no idea it's being exposed to the internet. It just sees a connection from localhost. The response flows back the same way: local service to agent, agent through the tunnel, relay to Caddy, Caddy to client.`,
    media: {
      type: 'diagram',
      src: 'local-delivery',
      alt: 'Agent forwarding demultiplexed stream to local service on 127.0.0.1',
    },
    layer: 'product',
    highlightNodes: ['agent', 'local-service'],
    highlightEdges: ['agent-service'],
  },
  {
    id: 'bigger-picture',
    index: 6,
    title: 'The bigger picture',
    body: `This is how I host everything — this portfolio, client projects, internal tools. One relay VPS, one agent per machine, Caddy in front. The relay handles health-check eviction for dead agents, the agent reconnects with exponential backoff. No vendor lock-in, no SaaS dependency for the hosting path itself. I built the tunnel, I run the relay, I control the trust boundary.`,
    media: {
      type: 'diagram',
      src: 'full-topology',
      alt: 'Complete Atlax topology showing all nodes, trust zones, and monitoring',
    },
    layer: 'ops',
    highlightNodes: ['client', 'caddy', 'relay', 'tunnel', 'agent', 'local-service'],
    highlightEdges: ['client-caddy', 'caddy-relay', 'relay-tunnel', 'tunnel-agent', 'agent-service'],
  },
];
