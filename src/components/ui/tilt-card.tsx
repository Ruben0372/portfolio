"use client";

import { useRef, useState, useCallback } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  tiltMax?: number;
  perspective?: number;
  scale?: number;
  as?: "div" | "a" | "button";
  href?: string;
  onClick?: () => void;
}

export function TiltCard({
  children,
  className,
  tiltMax = 10,
  perspective = 1000,
  scale = 1.02,
  as = "div",
  href,
  onClick,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const cachedRect = useRef<DOMRect | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = cachedRect.current;
      if (!rect) return;
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setTilt({ x: y * -tiltMax, y: x * tiltMax });
    },
    [tiltMax]
  );

  const handleMouseLeave = useCallback(() => {
    cachedRect.current = null;
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    cachedRect.current = ref.current?.getBoundingClientRect() ?? null;
    setIsHovered(true);
  }, []);

  const content = (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: tilt.x,
        rotateY: tilt.y,
        scale: isHovered ? scale : 1,
        z: isHovered ? 30 : 0,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ perspective, transformStyle: "preserve-3d" }}
      className={cn("relative", className)}
    >
      <div style={{ transformStyle: "preserve-3d" }}>{children}</div>
      {isHovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 rounded-[inherit] pointer-events-none"
          style={{
            boxShadow: "0 20px 60px rgba(245, 158, 11, 0.06), 0 8px 20px rgba(0,0,0,0.3)",
          }}
        />
      )}
    </motion.div>
  );

  if (as === "a" && href) {
    return (
      <a href={href} className="block" onClick={onClick}>
        {content}
      </a>
    );
  }

  if (as === "button") {
    return (
      <button className="block" onClick={onClick}>
        {content}
      </button>
    );
  }

  return content;
}

/**
 * Wrap child elements inside a TiltCard to give them individual
 * translateZ depth, making them "float" at different heights on hover.
 */
export function TiltLayer({
  children,
  depth = 20,
  className,
}: {
  children: React.ReactNode;
  depth?: number;
  className?: string;
}) {
  return (
    <div
      style={{ transform: `translateZ(${depth}px)`, transformStyle: "preserve-3d" }}
      className={cn(className)}
    >
      {children}
    </div>
  );
}
