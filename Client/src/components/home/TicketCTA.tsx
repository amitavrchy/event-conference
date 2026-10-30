"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function TicketCTA() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(255,74,210,0.22),transparent_50%),radial-gradient(ellipse_at_80%_40%,rgba(182,255,59,0.18),transparent_45%)]" />
      <Container className="relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="max-w-3xl"
        >
          <p className="font-mono text-sm uppercase tracking-[0.22em] text-magenta">
            Tickets
          </p>
          <h2 className="mt-4 font-display text-[clamp(2.25rem,7vw,4.5rem)] leading-[1.05] text-text">
            Claim your seat before Early Bird closes
          </h2>
          <p className="mt-5 max-w-xl text-base text-muted sm:text-lg">
            Three stages, workshops, night market — or join remote with full
            livestream + archive.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button href="/tickets" variant="magenta">
              Browse tiers
            </Button>
            <Button href="/ticket/pass" variant="secondary">
              Open pass
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
