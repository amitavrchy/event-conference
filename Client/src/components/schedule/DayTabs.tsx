"use client";

import { EVENT, cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";

export function DayTabs({
  value,
  onChange,
}: {
  value: string;
  onChange: (day: string) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Conference day"
      className="flex flex-wrap gap-2"
    >
      {EVENT.days.map((day, i) => {
        const active = value === day;
        return (
          <button
            key={day}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onChange(day)}
            className={cn(
              "rounded-md border px-4 py-3 font-mono text-sm uppercase tracking-wide transition",
              active
                ? "border-neon bg-neon/15 text-neon"
                : "border-violet/30 text-muted hover:border-neon/40 hover:text-text",
            )}
          >
            Day {i + 1}
            <span className="ml-2 text-muted">
              {format(parseISO(day), "MMM d")}
            </span>
          </button>
        );
      })}
    </div>
  );
}
