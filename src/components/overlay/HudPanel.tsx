'use client';

import { Html } from '@react-three/drei';
import { useScrollStore } from '@/lib/scroll-store';
import { panelOpacity } from '@/lib/three-utils';
import type { ReactNode } from 'react';

interface HudPanelProps {
  children: ReactNode;
  position: [number, number, number];
  enter: number;
  exit: number;
  className?: string;
  maxWidth?: number;
}

export function HudPanel({ children, position, enter, exit, className = '', maxWidth = 480 }: HudPanelProps) {
  const scroll = useScrollStore((s) => s.scroll);
  const opacity = panelOpacity(scroll, enter, exit);

  if (opacity < 0.01) return null;

  return (
    <Html
      position={position}
      center
      style={{
        opacity,
        transition: 'opacity 0.1s ease',
        pointerEvents: opacity > 0.5 ? 'auto' : 'none',
      }}
    >
      <div
        className={`rounded-xl border border-white/[0.08] bg-[rgba(10,10,15,0.6)] backdrop-blur-[20px] text-white/90 p-8 font-sans ${className}`}
        style={{ maxWidth }}
      >
        {children}
      </div>
    </Html>
  );
}
