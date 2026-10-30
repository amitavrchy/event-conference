"use client";

import type { Track } from "@/lib/types";
import { cn } from "@/lib/utils";

export function TrackFilter({
  tracks,
  value,
  onChange,
}: {
  tracks: Track[];
  value: string | null;
  onChange: (id: string | null) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by track">
      <button
        type="button"
        onClick={() => onChange(null)}
        className={cn(
          "rounded-md border px-4 py-2 text-sm transition",
          value === null
            ? "border-neon text-neon"
            : "border-violet/30 text-muted hover:text-text",
        )}
      >
        All tracks
      </button>
      {tracks.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          className={cn(
            "rounded-md border px-4 py-2 text-sm transition",
            value === t.id
              ? "border-transparent text-bg"
              : "border-violet/30 text-muted hover:text-text",
          )}
          style={
            value === t.id
              ? { backgroundColor: t.color, borderColor: t.color }
              : { borderColor: `${t.color}66` }
          }
        >
          {t.name}
        </button>
      ))}
    </div>
  );
}
