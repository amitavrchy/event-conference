"use client";

import { ArrowUpRight, Check, CheckCircle2 } from "lucide-react";
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
  if (!types.length) return null;
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {types.map((tier) => {
        const selected = selectedId === tier.id;
        const isVip = tier.name.toLowerCase().includes("vip");
        return (
          <div
            key={tier.id}
            className={cn(
              "relative flex flex-col rounded-xl border p-6 transition duration-200",
              isVip
                ? "border-[#282b25] bg-[#282b25] text-white"
                : "border-line bg-surface",
              selected && "ring-2 ring-neon ring-offset-4 ring-offset-bg",
            )}
          >
            <div className="flex items-center justify-between">
              <p
                className={cn(
                  "text-sm font-medium",
                  isVip ? "text-[#f29172]" : "text-neon",
                )}
              >
                {tier.name}
              </p>
              {selected && (
                <CheckCircle2
                  size={19}
                  className={isVip ? "text-[#f29172]" : "text-neon"}
                />
              )}
            </div>
            <p className="mt-7 font-display text-[48px] font-medium! tracking-[-.065em]!">
              {formatCurrency(tier.price)}
            </p>
            <p
              className={cn(
                "mt-1 text-sm",
                isVip ? "text-white/50" : "text-muted",
              )}
            >
              per person
            </p>
            <p
              className={cn(
                "mt-5 min-h-[72px] text-sm leading-relaxed",
                isVip ? "text-white/65" : "text-muted",
              )}
            >
              {tier.description}
            </p>
            <ul
              className={cn(
                "mt-6 flex-1 space-y-3 border-t pt-6",
                isVip ? "border-white/15" : "border-line",
              )}
            >
              {tier.perks.map((perk) => (
                <li
                  key={perk}
                  className={cn(
                    "flex items-start gap-2.5 text-sm",
                    isVip ? "text-white/80" : "text-text",
                  )}
                >
                  <Check
                    size={16}
                    className={cn(
                      "mt-1 shrink-0",
                      isVip ? "text-[#f29172]" : "text-neon",
                    )}
                  />
                  {perk}
                </li>
              ))}
            </ul>
            <Button
              variant={selected || isVip ? "primary" : "secondary"}
              aria-pressed={selected}
              className="mt-8 w-full"
              onClick={() => onSelect(tier.id)}
            >
              {selected ? "Your selected pass" : "Choose this pass"}
              <ArrowUpRight size={16} />
            </Button>
          </div>
        );
      })}
    </div>
  );
}
