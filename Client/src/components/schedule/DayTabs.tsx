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
              "rounded-lg border px-5 py-3 text-sm transition",
              active
                ? "border-neon bg-neon/5 text-neon"
                : "border-line text-muted hover:border-neon/40 hover:text-text",
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
