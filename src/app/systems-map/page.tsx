import type { Metadata } from "next";
import { topologyNodes, topologyEdges } from "@/data/topology";
import { SystemsMapLoader } from "./systems-map-loader";

export const metadata: Metadata = {
  title: "Systems Map",
  description:
    "Trace a request through Atlax — my custom reverse TLS tunnel that serves this site through infrastructure I built.",
};

export default function SystemsMapPage() {
  return (
    <main className="min-h-screen bg-[var(--color-brand-bg)]">
      {/* SSR-safe hero — renders before JavaScript */}
      <section className="mx-auto max-w-4xl px-6 pt-32 pb-16">
        <p className="text-xs font-mono tracking-widest uppercase text-[var(--color-brand-amber)] mb-4">
          Systems Map
        </p>
        <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--color-brand-text-heading)]">
          I build secure systems that survive contact with real networks.
        </h1>
        <p className="mt-6 text-base sm:text-lg text-[var(--color-brand-text-muted)] leading-relaxed max-w-2xl">
          This page traces a real request through Atlax, the reverse TLS tunnel I
          built to serve this portfolio. Every node you see is infrastructure I
          wrote, deployed, and operate.
        </p>
      </section>

      {/* SSR fallback — semantic HTML topology for no-JS / SEO */}
      <noscript>
        <section className="mx-auto max-w-4xl px-6 pb-16">
          <h2 className="font-heading text-2xl font-bold text-[var(--color-brand-text-heading)] mb-6">
            How this site reaches you
          </h2>
          <ol className="space-y-4 text-[var(--color-brand-text-muted)]">
            {topologyNodes.map((node) => (
              <li key={node.id} className="flex items-start gap-3">
                <span className="font-mono text-xs text-[var(--color-brand-amber)] mt-1 shrink-0">
                  [{node.type}]
                </span>
                <div>
                  <strong className="text-[var(--color-brand-text)]">
                    {node.label}
                  </strong>
                  <p className="text-sm mt-1">{node.summary}</p>
                </div>
              </li>
            ))}
          </ol>
          <h3 className="font-heading text-lg font-semibold text-[var(--color-brand-text-heading)] mt-8 mb-4">
            Connections
          </h3>
          <ul className="space-y-2 text-sm text-[var(--color-brand-text-muted)]">
            {topologyEdges.map((edge) => (
              <li key={edge.id}>
                <span className="font-mono text-[var(--color-brand-amber)]">
                  {edge.label}
                </span>{" "}
                — {edge.description}
              </li>
            ))}
          </ul>
        </section>
      </noscript>

      {/* Interactive client-side experience */}
      <SystemsMapLoader />
    </main>
  );
}
