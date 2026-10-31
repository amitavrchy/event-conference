"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { sponsorsApi } from "@/lib/api";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

const packages = [
  {
    tier: "Platinum",
    price: "$45k",
    perks: [
      "Mainstage naming",
      "Booth + lounge",
      "5 VIP passes",
      "Keynote intro",
    ],
  },
  {
    tier: "Gold",
    price: "$22k",
    perks: ["Track sponsorship", "Booth", "3 VIP passes", "Logo on site"],
  },
  {
    tier: "Silver",
    price: "$9k",
    perks: ["Logo placement", "1 VIP pass", "Newsletter mention"],
  },
];

export default function SponsorsPage() {
  const { data: sponsors = [] } = useQuery({
    queryKey: ["sponsors"],
    queryFn: sponsorsApi.list,
  });

  const byTier = ["Platinum", "Gold", "Silver"] as const;

  return (
    <Section
      eyebrow="Sponsors"
      title="Partner with NEXUS"
      description="Packages for brands that want festival energy with builder credibility."
      className="pt-12"
    >
      <div className="grid gap-4 md:grid-cols-3">
        {packages.map((p) => (
          <div
            key={p.tier}
            className="rounded-xl border border-line bg-surface p-7"
          >
            <p className="text-sm uppercase tracking-wider text-neon">
              {p.tier}
            </p>
            <p className="mt-2 font-display text-4xl text-text">{p.price}</p>
            <ul className="mt-4 space-y-2">
              {p.perks.map((perk) => (
                <li key={perk} className="text-sm text-muted">
                  ▸ {perk}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Button href="mailto:sponsors@nexusconf.dev" variant="secondary">
          Talk sponsorship
        </Button>
      </div>

      <div className="mt-16 space-y-10">
        {byTier.map((tier) => {
          const list = sponsors.filter((s) => s.tier === tier);
          if (!list.length) return null;
          return (
            <div key={tier}>
              <h3 className="font-display text-2xl text-text">{tier}</h3>
              <div className="mt-4 flex flex-wrap items-center gap-8">
                {list.map((s) => (
                  <a
                    key={s.id}
                    href={s.url ?? "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="opacity-80 transition hover:opacity-100"
                  >
                    {s.logoUrl ? (
                      <Image
                        src={s.logoUrl}
                        alt={s.name}
                        width={140}
                        height={48}
                        className="partner-logo h-10 w-auto object-contain"
                      />
                    ) : (
                      <span className="text-xl font-semibold text-muted hover:text-neon">
                        {s.name}
                      </span>
                    )}
                  </a>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
