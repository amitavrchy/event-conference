"use client";

import type { Speaker } from "@/lib/types";
import { SpeakerCard } from "./SpeakerCard";

export function SpeakerGrid({ speakers }: { speakers: Speaker[] }) {
  if (!speakers.length) {
    return (
      <p className="text-lg text-muted">Lineup loading — check back soon.</p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {speakers.map((s) => (
        <SpeakerCard key={s.id} speaker={s} />
      ))}
    </div>
  );
}
