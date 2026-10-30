"use client";

import { format } from "date-fns";
import type { Session, Speaker } from "@/lib/types";
import { cn } from "@/lib/utils";

function speakerNames(session: Session) {
  const list = session.speakers ?? [];
  return list
    .map((s) => ("speaker" in s ? s.speaker?.name : (s as Speaker).name))
    .filter(Boolean)
    .join(", ");
}

export function SessionCard({
  session,
  onOpen,
  inAgenda,
  isNow,
}: {
  session: Session;
  onOpen: () => void;
  inAgenda?: boolean;
  isNow?: boolean;
}) {
  const start = new Date(session.startsAt);
  const end = new Date(session.endsAt);

  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "w-full rounded-lg border bg-surface/80 p-5 text-left transition hover:border-neon/50",
        isNow ? "border-neon/60" : "border-violet/25",
        inAgenda && "ring-1 ring-magenta/40",
      )}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-mono text-sm text-neon">
          {format(start, "HH:mm")} – {format(end, "HH:mm")}
        </p>
        {session.track && (
          <span
            className="rounded px-2 py-1 text-sm text-bg"
            style={{ backgroundColor: session.track.color }}
          >
            {session.track.name}
          </span>
        )}
      </div>
      <h3 className="mt-3 font-display text-xl uppercase leading-snug text-text">
        {session.title}
      </h3>
      <p className="mt-2 text-sm text-muted">
        {session.room?.name ?? "TBA"}
        {speakerNames(session) ? ` · ${speakerNames(session)}` : ""}
      </p>
      {inAgenda && (
        <p className="mt-2 text-sm text-magenta">On my schedule</p>
      )}
    </button>
  );
}
