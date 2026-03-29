import { cn } from "@/lib/utils";

interface GridGlowTextProps {
  as?: "h2" | "h3" | "span" | "p";
  className?: string;
  children: React.ReactNode;
}

/**
 * Renders text with a subtle glow halo that illuminates the BGPattern grid
 * directly beneath the text characters. Uses text-shadow for precise positioning.
 */
export function GridGlowText({ as: Tag = "span", className, children }: GridGlowTextProps) {
  return (
    <Tag
      className={cn("grid-glow-text", className)}
      style={{
        textShadow:
          "0 0 40px rgba(255,255,255,0.08), 0 0 80px rgba(255,255,255,0.04), 0 0 120px rgba(255,255,255,0.02)",
      }}
    >
      {children}
    </Tag>
  );
}
