import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageBackgroundProps {
  src: string;
  alt: string;
  overlayOpacity?: number;
  gradientDirection?: "to-b" | "to-t" | "to-r" | "to-l" | "radial";
  className?: string;
  children: React.ReactNode;
  priority?: boolean;
}

export function ImageBackground({
  src,
  alt,
  overlayOpacity = 0.75,
  gradientDirection = "to-b",
  className,
  children,
  priority = false,
}: ImageBackgroundProps) {
  const gradientStyle =
    gradientDirection === "radial"
      ? {
          background: `radial-gradient(ellipse at center, rgba(10,10,11,${overlayOpacity * 0.85}) 0%, rgba(10,10,11,${overlayOpacity}) 70%)`,
        }
      : {
          background: `linear-gradient(${gradientDirection}, rgba(10,10,11,${overlayOpacity * 0.9}) 0%, rgba(10,10,11,${overlayOpacity}) 100%)`,
        };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="100vw"
        priority={priority}
        quality={80}
      />
      <div className="absolute inset-0" style={gradientStyle} />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
