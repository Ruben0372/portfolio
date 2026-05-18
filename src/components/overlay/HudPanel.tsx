'use client';

import { useScrollStore } from '@/lib/scroll-store';
import { panelOpacity } from '@/lib/three-utils';
import type { ReactNode } from 'react';

type Alignment = 'center' | 'left' | 'right';

interface HudPanelProps {
  children: ReactNode;
  enter: number;
  exit: number;
  align?: Alignment;
  className?: string;
  maxWidth?: number;
}

const alignmentClasses: Record<Alignment, string> = {
  center: 'items-center justify-center text-center',
  left: 'items-center justify-start pl-[8vw]',
  right: 'items-center justify-end pr-[8vw]',
};

export function HudPanel({ children, enter, exit, align = 'center', className = '', maxWidth = 480 }: HudPanelProps) {
  const scroll = useScrollStore((s) => s.scroll);
  const opacity = panelOpacity(scroll, enter, exit);

  if (opacity < 0.01) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex ${alignmentClasses[align]} pointer-events-none`}
      style={{
        opacity,
        transition: 'opacity 0.15s ease',
      }}
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
