"use client";

import type { Track } from "@/lib/types";
import { cn, trackColor } from "@/lib/utils";

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
    <div
      className="flex flex-wrap gap-2"
      role="group"
      aria-label="Filter by track"
    >
      <button
        type="button"
        aria-pressed={value === null}
        onClick={() => onChange(null)}
        className={cn(
          "min-h-10 rounded-full border px-4 py-2 text-sm transition",
          value === null
            ? "border-text bg-text text-bg"
            : "border-line text-muted hover:border-text",
        )}
      >
        All tracks
      </button>
      {tracks.map((track) => (
        <button
          key={track.id}
          type="button"
          aria-pressed={value === track.id}
          onClick={() => onChange(track.id)}
          className={cn(
            "flex min-h-10 items-center gap-2 rounded-full border px-4 py-2 text-sm transition",
            value === track.id
              ? "text-white"
              : "border-line text-muted hover:border-text",
          )}
          style={
            value === track.id
              ? {
                  backgroundColor: trackColor(track.name),
                  borderColor: trackColor(track.name),
                }
              : undefined
          }
        >
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full"
            style={{
              backgroundColor:
                value === track.id ? "white" : trackColor(track.name),
            }}
          />
          {track.name}
        </button>
      ))}
    </div>
  );
}
