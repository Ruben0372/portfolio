'use client';

import { useStore } from '@/lib/scroll-store';
import { getClusterRoom } from '@/data/cluster-rooms';
import { ArrowLeft } from 'lucide-react';

export function ClusterRoom() {
  const insideCluster = useStore((s) => s.insideCluster);
  const exitCluster = useStore((s) => s.exitCluster);

  if (!insideCluster) return null;

  const room = getClusterRoom(insideCluster);
  if (!room) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-[fadeIn_0.5s_ease]">
      <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-xl border border-white/[0.08] bg-[rgba(10,10,15,0.75)] backdrop-blur-[30px] text-white/90 p-8 md:p-10 font-sans mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => exitCluster()}
            className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <p className="text-xs font-mono tracking-[0.15em] uppercase text-amber-400">
            {room.title}
          </p>
        </div>

        {/* Narrative */}
        <p className="text-sm md:text-base text-white/70 leading-relaxed mb-6">
          {room.narrative}
        </p>

        {/* Media */}
        {room.media && (
          <div className="mb-6 rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 md:p-6">
            {room.media.type === 'code' ? (
              <pre className="text-xs font-mono text-white/60 overflow-x-auto whitespace-pre-wrap">
                {room.media.src}
              </pre>
            ) : (
              <div className="text-center text-xs text-white/30 py-8">
                [{room.media.type}: {room.media.src}]
              </div>
            )}
            <p className="mt-2 text-xs text-white/40">{room.media.caption}</p>
          </div>
        )}

        {/* Details / Claims */}
        {room.details.length > 0 && (
          <ul className="space-y-3">
            {room.details.map((detail, i) => (
              <li key={i} className="text-xs md:text-sm text-white/50 flex items-start gap-3">
                <span className="text-amber-400/60 mt-0.5 shrink-0">&#9656;</span>
                {detail}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
