'use client';

import dynamic from 'next/dynamic';
import { Navbar } from '@/components/sections/navbar';

const Scene = dynamic(
  () => import('@/components/canvas/Scene').then((mod) => mod.Scene),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 bg-[#050508] flex items-center justify-center">
        <p className="text-white/30 text-sm font-mono tracking-wider">Loading...</p>
      </div>
    ),
  }
);

function StaticFallback() {
  return (
    <div className="bg-[#050508] text-white min-h-screen">
      <Navbar />
      <section className="max-w-2xl mx-auto px-6 pt-32 pb-16">
        <p className="text-xs font-mono tracking-[0.2em] uppercase text-amber-400 mb-4">
          Systems Security Engineer
        </p>
        <h1 className="text-4xl font-bold tracking-tight leading-[1.1] mb-4">
          I build secure systems that survive contact with real networks.
        </h1>
        <p className="text-base text-white/60 leading-relaxed">
          From custom TLS tunnels to production infrastructure — I design, build,
          and operate the systems that keep services running securely.
        </p>
      </section>
    </div>
  );
}

export default function HomePage() {
  return (
    <main id="main-content">
      <div className="motion-safe:block motion-reduce:hidden">
        <Scene />
      </div>
      <div className="motion-safe:hidden motion-reduce:block">
        <StaticFallback />
      </div>
    </main>
  );
}
