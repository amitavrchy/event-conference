"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { EVENT } from "@/lib/utils";
import { Container } from "@/components/ui/Container";

type Parts = { days: number; hours: number; minutes: number; seconds: number };

function diff(target: Date): Parts {
  const ms = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor((ms % 86_400_000) / 3_600_000),
    minutes: Math.floor((ms % 3_600_000) / 60_000),
    seconds: Math.floor((ms % 60_000) / 1000),
  };
}

export function Countdown() {
  const [parts, setParts] = useState<Parts | null>(null);
  const [announce, setAnnounce] = useState("");

  useEffect(() => {
    setParts(diff(EVENT.start));
    const id = window.setInterval(() => setParts(diff(EVENT.start)), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      const p = diff(EVENT.start);
      setAnnounce(
        `${p.days} days, ${p.hours} hours, ${p.minutes} minutes until NEXUS Conf`,
      );
    }, 60_000);
    return () => window.clearInterval(id);
  }, []);

  const live = parts ?? { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const cells = [
    { label: "Days", value: live.days },
    { label: "Hours", value: live.hours },
    { label: "Mins", value: live.minutes },
    { label: "Secs", value: live.seconds },
  ];

  return (
    <section className="relative border-y border-line bg-surface/40 py-10 sm:py-12">
      <Container className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-sm uppercase tracking-[0.22em] text-neon">
            Countdown
          </p>
          <h2 className="mt-2 font-display text-3xl text-text sm:text-4xl">
            Doors · Sep 18
          </h2>
        </div>

        <div
          className="grid grid-cols-4 gap-4 sm:gap-8"
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="sr-only">{announce}</span>
          {cells.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="text-center md:text-right"
            >
              <p className="font-mono text-3xl text-neon sm:text-5xl">
                {String(c.value).padStart(2, "0")}
              </p>
              <p className="mt-1 font-mono text-sm uppercase tracking-widest text-muted">
                {c.label}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
