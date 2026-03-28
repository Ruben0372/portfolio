"use client";

import { motion } from "framer-motion";
import { techStack } from "@/data/projects";

const categoryLabels: Record<string, string> = {
  languages: "Languages",
  frontend: "Frontend",
  backend: "Backend",
  databases: "Databases",
  security: "Security",
  devops: "DevOps & Cloud",
  tools: "Tools",
};

export function TechStack() {
  return (
    <section className="relative py-28 bg-surface/20">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold text-yellow tracking-widest uppercase">
            Tech Stack
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
            The tools I{" "}
            <span className="text-text-muted">ship with.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Object.entries(techStack).map(([category, items], i) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-border/50 bg-surface/50 p-5"
            >
              <h3 className="text-xs font-semibold text-accent uppercase tracking-wider mb-4">
                {categoryLabels[category]}
              </h3>
              <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <span
                    key={item}
                    className="rounded-lg bg-surface-2 border border-border/40 px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:text-text hover:border-accent/30"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
