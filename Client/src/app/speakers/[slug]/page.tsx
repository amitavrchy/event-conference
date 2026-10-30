"use client";

import Image from "next/image";
import Link from "next/link";
import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { speakersApi } from "@/lib/api";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function SpeakerDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { data: speaker, isLoading, isError } = useQuery({
    queryKey: ["speakers", slug],
    queryFn: () => speakersApi.bySlug(slug),
  });

  if (isLoading) {
    return (
      <Container className="py-20">
        <p className="text-base text-muted">Loading…</p>
      </Container>
    );
  }

  if (isError || !speaker) {
    return (
      <Container className="py-20">
        <p className="text-lg text-warn">Speaker not found.</p>
        <Button href="/speakers" variant="secondary" className="mt-6">
          Back to lineup
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-16 sm:py-24">
      <div className="grid gap-10 lg:grid-cols-[320px_1fr]">
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-violet/25 bg-surface">
          {speaker.photoUrl ? (
            <Image
              src={speaker.photoUrl}
              alt={speaker.name}
              fill
              className="object-cover"
              sizes="320px"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center font-display text-6xl text-violet">
              {speaker.name.slice(0, 1)}
            </div>
          )}
        </div>
        <div>
          <p className="font-mono text-sm uppercase tracking-widest text-neon">
            Speaker
          </p>
          <h1 className="mt-2 font-display text-4xl uppercase text-text sm:text-5xl">
            {speaker.name}
          </h1>
          <p className="mt-3 text-lg text-magenta">
            {speaker.title}
            {speaker.company ? ` · ${speaker.company}` : ""}
          </p>
          <p className="mt-6 max-w-2xl text-lg text-muted">{speaker.bio}</p>

          {speaker.sessions && speaker.sessions.length > 0 && (
            <div className="mt-10">
              <h2 className="font-display text-2xl uppercase text-text">
                Sessions
              </h2>
              <ul className="mt-4 space-y-3">
                {speaker.sessions.map((s) => (
                  <li
                    key={s.id}
                    className="rounded-lg border border-violet/20 bg-surface/50 px-4 py-3"
                  >
                    <Link
                      href="/schedule"
                      className="font-medium text-neon hover:underline"
                    >
                      {s.title}
                    </Link>
                    <p className="font-mono text-sm text-muted">
                      {format(new Date(s.startsAt), "EEE · HH:mm")}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Button href="/speakers" variant="secondary" className="mt-10">
            All speakers
          </Button>
        </div>
      </div>
    </Container>
  );
}
