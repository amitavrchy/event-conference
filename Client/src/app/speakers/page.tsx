"use client";

import { useQuery } from "@tanstack/react-query";
import { speakersApi } from "@/lib/api";
import { Section } from "@/components/ui/Section";
import { SpeakerGrid } from "@/components/speakers/SpeakerGrid";

export default function SpeakersPage() {
  const { data = [], isLoading, isError } = useQuery({
    queryKey: ["speakers"],
    queryFn: speakersApi.list,
  });

  return (
    <Section
      eyebrow="Lineup"
      title="Speakers"
      description="The builders reshaping systems, motion, and product craft."
      className="pt-12"
    >
      {isLoading && <p className="text-base text-muted">Loading speakers…</p>}
      {isError && (
        <p className="text-base text-warn">Failed to load speakers from API.</p>
      )}
      {!isLoading && !isError && <SpeakerGrid speakers={data} />}
    </Section>
  );
}
