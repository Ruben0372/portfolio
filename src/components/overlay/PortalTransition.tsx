'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useScrollStore } from '@/lib/scroll-store';

export function PortalTransition() {
  const portalTarget = useScrollStore((s) => s.portalTarget);
  const clearPortal = useScrollStore((s) => s.clearPortal);
  const router = useRouter();
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (!portalTarget) return;
    setFlash(true);
    const timer = setTimeout(() => {
      router.push(portalTarget);
      clearPortal();
    }, 300);
    return () => clearTimeout(timer);
  }, [portalTarget, clearPortal, router]);

  if (!flash) return null;

  return (
    <div
      className="fixed inset-0 z-[200] bg-white pointer-events-none"
      style={{ animation: 'portal-flash 0.6s ease-out forwards' }}
      onAnimationEnd={() => setFlash(false)}
    >
      <style>{`
        @keyframes portal-flash {
          0% { opacity: 0; }
          30% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
