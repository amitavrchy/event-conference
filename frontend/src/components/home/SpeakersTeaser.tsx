"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { speakersApi } from "@/lib/api";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SpeakerCard } from "@/components/speakers/SpeakerCard";

export function SpeakersTeaser() {
  const {
    data: speakers = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["speakers"],
    queryFn: speakersApi.list,
  });
  return (
    <section id="the-lineup" className="py-20 sm:py-24 lg:py-28">
      <Container>
        <div className="mb-10 flex flex-col justify-between gap-6 sm:mb-12 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow mb-5 text-muted">Meet the minds</p>
            <h2 className="section-heading">
              Good people.
              <br />
              <span className="accent-serif text-neon">
                Extraordinary perspectives.
              </span>
            </h2>
          </div>
          <div className="max-w-[285px]">
            <p className="mb-5 text-sm leading-relaxed text-muted">
              The thinkers and makers turning big questions into meaningful
              work. Get to know your next source of inspiration.
            </p>
            <Button
              href="/speakers"
              variant="secondary"
              className="min-h-11 py-2.5"
            >
              Meet all speakers <ArrowUpRight size={16} />
            </Button>
          </div>
        </div>
        {isLoading && (
          <div
            className="grid grid-cols-2 gap-5 lg:grid-cols-4"
            aria-label="Loading speakers"
          >
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="aspect-[3/4] animate-pulse rounded-lg bg-surface-2"
              />
            ))}
          </div>
        )}
        {isError && (
          <div className="rounded-lg border border-line p-6">
            <p className="text-muted">The lineup is taking a moment to load.</p>
            <button
              onClick={() => void refetch()}
              className="mt-3 text-sm text-neon underline underline-offset-4"
            >
              Try again
            </button>
          </div>
        )}
        {!isLoading && !isError && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
            {speakers.slice(0, 4).map((speaker, index) => (
              <SpeakerCard
                key={speaker.id}
                speaker={speaker}
                number={index + 1}
              />
            ))}
          </div>
        )}
        {!isLoading && !isError && speakers.length === 0 && (
          <p className="text-muted">The lineup will be announced here.</p>
        )}
      </Container>
    </section>
  );
}
