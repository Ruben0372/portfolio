"use client";

import { useEffect, useRef } from "react";

export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (!glowRef.current) return;
      glowRef.current.style.setProperty("--glow-x", `${e.clientX}px`);
      glowRef.current.style.setProperty("--glow-y", `${e.clientY}px`);
      glowRef.current.style.opacity = "1";
    }

    function handleMouseLeave() {
      if (!glowRef.current) return;
      glowRef.current.style.opacity = "0";
    }

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40 opacity-0 transition-opacity duration-300"
      style={{
        background:
          "radial-gradient(300px circle at var(--glow-x, -100px) var(--glow-y, -100px), rgba(245, 158, 11, 0.06) 0%, rgba(245, 158, 11, 0.02) 40%, transparent 70%)",
      }}
    />
  );
}
