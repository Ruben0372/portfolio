"use client";

import { useCallback, useState } from "react";
import { scrollSections } from "@/data/scroll-sections";
import { TraceSection } from "./trace-section";
import { ScrollProgress } from "./scroll-progress";

interface ScrollTraceProps {
  onSectionChange?: (sectionId: string) => void;
}

export function ScrollTrace({ onSectionChange }: ScrollTraceProps) {
  const [activeSection, setActiveSection] = useState(scrollSections[0]?.id);

  const handleSectionEnter = useCallback(
    (sectionId: string) => {
      if (sectionId !== activeSection) {
        setActiveSection(sectionId);
        onSectionChange?.(sectionId);
      }
    },
    [activeSection, onSectionChange]
  );

  return (
    <>
      <ScrollProgress />

      <div className="mx-auto max-w-6xl px-6">
        {/* Section navigation dots */}
        <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-2">
          {scrollSections.map((section, i) => (
            <button
              key={section.id}
              onClick={() => {
                const el = document.getElementById(`trace-${section.id}`);
                if (el) {
                  const top =
                    el.getBoundingClientRect().top + window.scrollY - 100;
                  window.scrollTo({ top, behavior: "smooth" });
                }
              }}
              aria-label={`Jump to: ${section.title}`}
              className={`w-2 h-2 rounded-full transition-all ${
                activeSection === section.id
                  ? "bg-[var(--color-brand-amber)] scale-125"
                  : "bg-[var(--color-brand-border)] hover:bg-[var(--color-brand-text-muted)]"
              }`}
            />
          ))}
        </div>

        {/* Trace sections */}
        {scrollSections.map((section, index) => (
          <div key={section.id} id={`trace-${section.id}`}>
            <TraceSection
              section={section}
              index={index}
              total={scrollSections.length}
              onEnterView={handleSectionEnter}
            />
          </div>
        ))}
      </div>
    </>
  );
}
