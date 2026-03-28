"use client";

import { motion } from "framer-motion";
import { Shield, GitBranch, Search, Cloud } from "lucide-react";
import { services } from "@/data/projects";

const iconMap: Record<string, React.ElementType> = {
  Shield,
  GitBranch,
  Search,
  Cloud,
};

export function Services() {
  return (
    <section className="relative py-28 overflow-hidden">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold text-green tracking-widest uppercase">
            Services
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
            Security is a feature,{" "}
            <span className="text-text-muted">not an afterthought.</span>
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {services.map((service, i) => {
            const Icon = iconMap[service.icon] || Shield;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative rounded-2xl border border-border/50 bg-surface/50 p-7 transition-all hover:border-accent/30 hover:bg-surface"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 transition-colors group-hover:bg-accent/15">
                  <Icon className="h-5 w-5 text-accent" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{service.title}</h3>
                <p className="mt-2.5 text-sm text-text-muted leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
