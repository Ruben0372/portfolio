"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FocusCard {
  title: string;
  subtitle?: string;
  category?: string;
  src: string;
  href?: string;
  tags?: string[];
}

interface FocusCardsProps {
  cards: FocusCard[];
  className?: string;
}

export function FocusCards({ cards, className }: FocusCardsProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div
      className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5", className)}
      onMouseLeave={() => setHovered(null)}
    >
      {cards.map((card, i) => (
        <FocusCardItem
          key={card.title}
          card={card}
          index={i}
          hovered={hovered}
          setHovered={setHovered}
        />
      ))}
    </div>
  );
}

function FocusCardItem({
  card,
  index,
  hovered,
  setHovered,
}: {
  card: FocusCard;
  index: number;
  hovered: number | null;
  setHovered: (i: number | null) => void;
}) {
  const isHovered = hovered === index;
  const isBlurred = hovered !== null && hovered !== index;

  const inner = (
    <motion.div
      onMouseEnter={() => setHovered(index)}
      onFocus={() => setHovered(index)}
      onBlur={() => setHovered(null)}
      animate={{
        filter: isBlurred ? "blur(4px) brightness(0.35)" : "blur(0px) brightness(1)",
        scale: isHovered ? 1.01 : isBlurred ? 0.98 : 1,
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative aspect-[3/5] rounded-xl overflow-hidden cursor-pointer group"
    >
      <Image
        src={card.src}
        alt={card.title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />

      {/* Gradient overlay — visible on hover/focus */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-300 bg-gradient-to-t from-[var(--color-brand-bg)]/90 via-[var(--color-brand-bg)]/20 to-transparent",
          isHovered ? "opacity-100" : "opacity-40"
        )}
      />

      {/* Content — slides up on hover/focus */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 p-5 transition-all duration-300",
          isHovered ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        )}
      >
        {card.category && (
          <span className="text-[0.625rem] font-mono uppercase tracking-widest text-[var(--color-brand-amber)]">
            {card.category}
          </span>
        )}
        <h3 className="mt-1 font-heading text-xl font-bold text-[var(--color-brand-text-heading)]">
          {card.title}
        </h3>
        {/* Always visible to screen readers */}
        <span className="sr-only">{card.title}</span>
        {card.subtitle && (
          <p className="mt-0.5 text-xs text-[var(--color-brand-text-muted)] line-clamp-1">
            {card.subtitle}
          </p>
        )}
        {card.tags && card.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {card.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[0.5625rem] font-mono px-1.5 py-0.5 rounded glass text-[var(--color-brand-text-muted)]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );

  if (card.href) {
    return (
      <a
        href={card.href}
        aria-label={`View project: ${card.title}`}
        onFocus={() => setHovered(index)}
        onBlur={() => setHovered(null)}
      >
        {inner}
      </a>
    );
  }

  return inner;
}
