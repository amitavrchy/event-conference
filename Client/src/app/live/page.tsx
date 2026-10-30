"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, isWithinInterval } from "date-fns";
import { sessionsApi } from "@/lib/api";
import { Section } from "@/components/ui/Section";
import { NowLine } from "@/components/schedule/NowLine";
import { Button } from "@/components/ui/Button";
import type { Speaker } from "@/lib/types";

export default function LivePage() {
  const [now, setNow] = useState(0);
  const { data = [], isLoading, isError } = useQuery({
    queryKey: ["sessions"],
    queryFn: sessionsApi.list,
    refetchInterval: 60_000,
  });

  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const { happening, upcoming } = useMemo(() => {
    const happening = data.filter((s) =>
      isWithinInterval(now, {
        start: new Date(s.startsAt),
        end: new Date(s.endsAt),
      }),
    );
    const upcoming = data
      .filter((s) => new Date(s.startsAt).getTime() > now)
      .sort(
        (a, b) =>
          new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
      )
      .slice(0, 5);
    return { happening, upcoming };
  }, [data, now]);

  return (
    <Section
      eyebrow="Live"
      title="Happening now"
      description="Sessions in progress across the venue. Refreshes every minute."
      className="pt-12"
    >
      <NowLine />

      {isLoading && <p className="text-base text-muted">Checking stages…</p>}
      {isError && (
        <p className="text-base text-warn">Could not load live sessions.</p>
      )}

      {!isLoading && happening.length === 0 && (
        <p className="mt-6 text-lg text-muted">
          Nothing on stage right now
          {upcoming[0]
            ? ` — next up at ${format(new Date(upcoming[0].startsAt), "HH:mm")} UTC.`
            : "."}
        </p>
      )}

      <ul className="mt-8 space-y-4">
        {happening.map((s) => {
          const speakers = (s.speakers ?? []).map((x) =>
            "speaker" in x ? x.speaker : (x as Speaker),
          );
          return (
            <li
              key={s.id}
              className="rounded-xl border border-neon/40 bg-surface/70 p-6"
            >
              <p className="font-mono text-sm text-neon">
                {format(new Date(s.startsAt), "HH:mm")} –{" "}
                {format(new Date(s.endsAt), "HH:mm")}
                {s.room ? ` · ${s.room.name}` : ""}
              </p>
              <h3 className="mt-2 font-display text-2xl uppercase text-text">
                {s.title}
              </h3>
              <p className="mt-2 text-base text-muted">
                {speakers.map((sp) => sp.name).join(", ")}
              </p>
            </li>
          );
        })}
      </ul>

      {upcoming.length > 0 && (
        <div className="mt-14">
          <h3 className="font-display text-2xl uppercase text-text">Up next</h3>
          <ul className="mt-4 space-y-3">
            {upcoming.map((s) => (
              <li
                key={s.id}
                className="border-l-2 border-magenta/50 pl-4 text-base text-muted"
              >
                <span className="font-mono text-sm text-magenta">
                  {format(new Date(s.startsAt), "EEE HH:mm")}
                </span>{" "}
                — {s.title}
              </li>
            ))}
          </ul>
        </div>
      )}

      <Button href="/schedule" variant="secondary" className="mt-10">
        Full schedule
      </Button>
    </Section>
  );
}
