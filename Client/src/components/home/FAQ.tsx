"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "When and where is NEXUS Conf?",
    a: "September 18–20, 2026 at NEXUS Arena, Gulshan, Dhaka.",
  },
  {
    q: "What’s included in a pass?",
    a: "All stages, expo floor, and lounge. VIP adds speaker dinner. Remote includes livestream + 30-day replay.",
  },
  {
    q: "Can I build a personal schedule?",
    a: "Sign in, open Schedule, and add sessions. Overlaps show a gentle warning.",
  },
  {
    q: "How does check-in work?",
    a: "Your ticket pass has a QR. Staff scan it at the door to flip status to checked-in.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative border-t border-line py-24 sm:py-32">
      <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="font-mono text-sm uppercase tracking-[0.22em] text-neon">
            FAQ
          </p>
          <h2 className="mt-3 font-display text-[clamp(2.25rem,7vw,3.75rem)] leading-[1.05] text-text">
            Quick answers
          </h2>
        </div>

        <div className="divide-y divide-line border-y border-line">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span className="text-lg text-text sm:text-xl">{item.q}</span>
                  <span
                    className={cn(
                      "font-mono text-neon transition duration-200",
                      isOpen && "rotate-45",
                    )}
                  >
                    +
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden text-base text-muted"
                    >
                      <span className="block pb-6">{item.a}</span>
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
