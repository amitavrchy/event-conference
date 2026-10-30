"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { venueApi } from "@/lib/api";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function VenueTeaser() {
  const { data: venue } = useQuery({
    queryKey: ["venue"],
    queryFn: venueApi.get,
  });

  return (
    <section className="relative py-24 sm:py-32">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative aspect-[4/5] overflow-hidden sm:aspect-[5/4] lg:aspect-[4/5]"
        >
          <Image
            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1400&q=80"
            alt="Festival venue atmosphere"
            fill
            className="object-cover"
            sizes="(max-width:1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent" />
        </motion.div>

        <div>
          <p className="font-mono text-sm uppercase tracking-[0.22em] text-neon">
            Venue
          </p>
          <h2 className="mt-3 font-display text-[clamp(2.25rem,7vw,3.75rem)] leading-[1.05] text-text">
            {venue?.name ?? "NEXUS Arena"}
          </h2>
          <p className="mt-5 text-base text-muted sm:text-lg">
            {venue?.description ??
              "Three stages, open courtyards, and night markets wrapping the hall."}
          </p>
          <p className="mt-4 text-base text-text">{venue?.address}</p>
          <div className="mt-8">
            <Button href="/venue" variant="secondary">
              Map & hotels
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
