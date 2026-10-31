"use client";

import { format } from "date-fns";
import { ArrowUpRight, Bookmark } from "lucide-react";
import type { Session, Speaker } from "@/lib/types";
import { cn, trackColor } from "@/lib/utils";

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
  const names = (session.speakers ?? [])
    .map((s) => ("speaker" in s ? s.speaker.name : (s as Speaker).name))
    .filter(Boolean)
    .join(", ");
  const color = trackColor(session.track?.name ?? "");
  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "group grid w-full items-center gap-4 rounded-xl border bg-surface p-5 text-left transition hover:border-neon/60 hover:shadow-sm sm:grid-cols-[125px_1fr_auto] sm:gap-6 sm:p-7",
        isNow ? "border-neon" : "border-line",
        inAgenda && "ring-1 ring-neon/30",
      )}
    >
      <div className="flex items-center gap-2 font-mono text-sm text-muted sm:block">
        <p className="text-base text-text">
          {format(new Date(session.startsAt), "HH:mm")}
        </p>
        <p className="sm:mt-1">— {format(new Date(session.endsAt), "HH:mm")}</p>
      </div>
      <div>
        <div className="mb-3 flex flex-wrap items-center gap-3">
          {session.track && (
            <span
              className="rounded-full px-3 py-1 text-sm"
              style={{ color, backgroundColor: color + "12" }}
            >
              {session.track.name}
            </span>
          )}
          {inAgenda && (
            <span className="flex items-center gap-1.5 text-sm text-neon">
              <Bookmark size={13} fill="currentColor" />
              Saved
            </span>
          )}
        </div>
        <h3 className="font-display text-[23px] font-medium! tracking-[-.04em]!">
          {session.title}
        </h3>
        <p className="mt-2 text-sm text-muted">
          {session.room?.name ?? "Room to be announced"}
          {names ? " · " + names : ""}
        </p>
      </div>
      <ArrowUpRight
        size={20}
        className="hidden text-muted transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-neon sm:block"
      />
    </button>
  );
}
