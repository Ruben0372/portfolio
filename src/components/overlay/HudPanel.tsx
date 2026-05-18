'use client';

import { useStore } from '@/lib/scroll-store';
import type { ReactNode } from 'react';

type Alignment = 'center' | 'left' | 'right';

interface HudPanelProps {
  children: ReactNode;
  roomIndex: number;
  align?: Alignment;
  className?: string;
  maxWidth?: number;
}

const alignmentClasses: Record<Alignment, string> = {
  center: 'items-center justify-center text-center',
  left: 'items-center justify-start pl-[8vw]',
  right: 'items-center justify-end pr-[8vw]',
};

export function HudPanel({ children, roomIndex: targetRoom, align = 'center', className = '', maxWidth = 480 }: HudPanelProps) {
  const currentRoom = useStore((s) => s.roomIndex);
  const transitioning = useStore((s) => s.transitioning);
  const insideCluster = useStore((s) => s.insideCluster);

  const visible = currentRoom === targetRoom && !transitioning && !insideCluster;
  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex ${alignmentClasses[align]} pointer-events-none animate-[fadeIn_0.5s_ease]`}
    >
      <div
        className={`rounded-xl border border-white/[0.08] bg-[rgba(10,10,15,0.6)] backdrop-blur-[20px] text-white/90 p-8 font-sans pointer-events-auto ${className}`}
        style={{ maxWidth }}
      >
        {children}
      </div>
    </div>
  );
}
