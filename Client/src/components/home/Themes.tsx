"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";

const themes = [
  {
    n: "01",
    name: "Design Systems",
    blurb: "Tokens, type ramps, and motion kits that scale without flattening taste.",
    color: "var(--neon)",
  },
  {
    n: "02",
    name: "Product Craft",
    blurb: "Shipping decisions that still feel intentional under pressure.",
    color: "var(--magenta)",
  },
  {
    n: "03",
    name: "AI & Interfaces",
    blurb: "Generative collaboration that preserves authorship and judgment.",
    color: "var(--violet)",
  },
  {
    n: "04",
    name: "Mainstage",
    blurb: "Keynotes and closing circles that set the decade’s agenda.",
    color: "var(--warn)",
  },
];

export function Themes() {
  return (
    <section className="relative border-y border-line py-24 sm:py-32">
      <Container>
        <p className="font-mono text-sm uppercase tracking-[0.22em] text-neon">
          Tracks
        </p>
        <h2 className="mt-3 max-w-2xl font-display text-[clamp(2.25rem,7vw,3.75rem)] leading-[1.05] text-text">
          Four currents. One festival.
        </h2>
      </Container>

      <div className="mt-14">
        {themes.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className="group border-t border-line transition hover:bg-surface/50"
          >
            <Container className="grid items-center gap-4 py-8 md:grid-cols-[5rem_1fr_1.2fr] md:gap-10 md:py-10">
              <span
                className="font-mono text-sm tracking-widest"
                style={{ color: t.color }}
              >
                {t.n}
              </span>
              <h3
                className="font-display text-[clamp(1.75rem,4.5vw,3rem)] leading-[1.05] text-text transition duration-300 group-hover:translate-x-2"
                style={{ color: t.color }}
              >
                {t.name}
              </h3>
              <p className="text-base text-muted md:text-lg">{t.blurb}</p>
            </Container>
          </motion.div>
        ))}
        <div className="border-t border-line" />
      </div>
    </section>
  );
}
