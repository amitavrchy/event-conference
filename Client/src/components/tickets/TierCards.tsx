"use client";

import type { TicketType } from "@/lib/types";
import { cn, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export function TierCards({
  types,
  selectedId,
  onSelect,
}: {
  types: TicketType[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  if (!types.length) {
    return <p className="text-base text-muted">Ticket tiers loading…</p>;
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {types.map((t) => {
        const selected = selectedId === t.id;
        const isVip = t.name.toLowerCase().includes("vip");
        return (
          <div
            key={t.id}
            className={cn(
              "flex flex-col rounded-xl border bg-surface/70 p-6 transition",
              selected
                ? "border-neon shadow-[0_0_30px_rgba(182,255,59,0.15)]"
                : "border-violet/25 hover:border-violet/50",
            )}
          >
            <p className="font-mono text-sm uppercase tracking-widest text-muted">
              {t.name}
            </p>
            <p className="mt-3 font-display text-4xl text-neon">
              {formatCurrency(t.price)}
            </p>
            <p className="mt-3 text-base text-muted">{t.description}</p>
            <ul className="mt-5 flex-1 space-y-2">
              {t.perks.map((p) => (
                <li key={p} className="text-sm text-text before:mr-2 before:text-neon before:content-['▸']">
                  {p}
                </li>
              ))}
            </ul>
            <Button
              variant={isVip ? "magenta" : selected ? "primary" : "secondary"}
              className="mt-6 w-full"
              onClick={() => onSelect(t.id)}
            >
              {selected ? "Selected" : "Select"}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
