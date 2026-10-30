"use client";

import { useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { speakersApi } from "@/lib/api";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SpeakerCard } from "@/components/speakers/SpeakerCard";

export function SpeakersTeaser() {
  const { data: speakers = [], isLoading, isError, error } = useQuery({
    queryKey: ["speakers"],
    queryFn: speakersApi.list,
    retry: 2,
  });

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: true },
    [Autoplay({ delay: 2800, stopOnInteraction: false })],
  );

  useEffect(() => {
    emblaApi?.reInit();
  }, [emblaApi, speakers]);

  return (
    <section className="relative py-24 sm:py-32">
      <Container className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl">
          <p className="font-mono text-sm uppercase tracking-[0.22em] text-neon">
            Lineup
          </p>
          <h2 className="mt-3 max-w-xl font-display text-[clamp(2.25rem,7vw,3.75rem)] leading-[1.05] text-text">
            Speakers who ship culture
          </h2>
          <p className="mt-4 max-w-md text-base text-muted sm:text-lg">
            Systems, motion, and product taste — from studios that set the pace.
          </p>
        </div>
        <Button href="/speakers" variant="secondary">
          Full lineup
        </Button>
      </Container>

      {isLoading && (
        <Container>
          <p className="text-base text-muted">Loading lineup…</p>
        </Container>
      )}
      {isError && (
        <Container>
          <p className="text-base text-warn">
            Couldn’t load speakers.
            {error instanceof Error ? ` ${error.message}` : ""}
          </p>
        </Container>
      )}

      {!isLoading && !isError && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="overflow-hidden pl-5 sm:pl-8"
          ref={emblaRef}
        >
          <div className="flex gap-5">
            {speakers.map((s) => (
              <div
                key={s.id}
                className="min-w-0 flex-[0_0_78%] sm:flex-[0_0_42%] md:flex-[0_0_28%] lg:flex-[0_0_22%]"
              >
                <SpeakerCard speaker={s} />
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </section>
  );
}
