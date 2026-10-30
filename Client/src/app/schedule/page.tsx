"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { isWithinInterval } from "date-fns";
import { sessionsApi } from "@/lib/api";
import { EVENT } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";
import { Section } from "@/components/ui/Section";
import { DayTabs } from "@/components/schedule/DayTabs";
import { TrackFilter } from "@/components/schedule/TrackFilter";
import { SessionCard } from "@/components/schedule/SessionCard";
import { SessionDrawer } from "@/components/schedule/SessionDrawer";
import { NowLine } from "@/components/schedule/NowLine";
import type { Session } from "@/lib/types";

export default function SchedulePage() {
  const [day, setDay] = useState<string>(EVENT.days[0]);
  const [trackId, setTrackId] = useState<string | null>(null);
  const [active, setActive] = useState<Session | null>(null);
  const [now, setNow] = useState(0);
  const sessionIds = useAppSelector((s) => s.agenda.sessionIds);

  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const scheduleQuery = useQuery({
    queryKey: ["schedule", day],
    queryFn: () => sessionsApi.schedule(day),
  });

  const tracksQuery = useQuery({
    queryKey: ["tracks"],
    queryFn: sessionsApi.tracks,
  });

  const sessions = useMemo(() => {
    const list = scheduleQuery.data ?? [];
    const filtered = trackId
      ? list.filter((s) => s.track?.id === trackId)
      : list;
    return [...filtered].sort(
      (a, b) =>
        new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
    );
  }, [scheduleQuery.data, trackId]);

  return (
    <Section
      eyebrow="Agenda"
      title="Schedule"
      description="Filter by day and track. Open a session to add it to your personal agenda."
      className="pt-12"
    >
      <div className="space-y-6">
        <DayTabs value={day} onChange={setDay} />
        <TrackFilter
          tracks={tracksQuery.data ?? []}
          value={trackId}
          onChange={setTrackId}
        />
      </div>

      <div className="mt-10 space-y-4">
        {scheduleQuery.isLoading && (
          <p className="text-base text-muted">Loading sessions…</p>
        )}
        {scheduleQuery.isError && (
          <p className="text-base text-warn">Could not load schedule.</p>
        )}
        {sessions.map((session, i) => {
          const start = new Date(session.startsAt);
          const end = new Date(session.endsAt);
          const isNow = isWithinInterval(now, { start, end });
          const prev = sessions[i - 1];
          const prevWasNow =
            prev &&
            isWithinInterval(now, {
              start: new Date(prev.startsAt),
              end: new Date(prev.endsAt),
            });
          const showNowLine =
            isNow && !prevWasNow
              ? true
              : !isNow &&
                prev &&
                new Date(prev.endsAt).getTime() < now &&
                start.getTime() > now;

          return (
            <div key={session.id}>
              {(isNow || showNowLine) && !prevWasNow && isNow && (
                <NowLine />
              )}
              {showNowLine && !isNow && <NowLine label="Coming up" />}
              <SessionCard
                session={session}
                onOpen={() => setActive(session)}
                inAgenda={sessionIds.includes(session.id)}
                isNow={isNow}
              />
            </div>
          );
        })}
        {!scheduleQuery.isLoading && sessions.length === 0 && (
          <p className="text-base text-muted">No sessions for this filter.</p>
        )}
      </div>

      <SessionDrawer session={active} onClose={() => setActive(null)} />
    </Section>
  );
}
