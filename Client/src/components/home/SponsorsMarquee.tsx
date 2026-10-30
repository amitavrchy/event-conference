"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { sponsorsApi } from "@/lib/api";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function SponsorsMarquee() {
  const { data: sponsors = [] } = useQuery({
    queryKey: ["sponsors"],
    queryFn: sponsorsApi.list,
  });

  const items = sponsors.length
    ? sponsors
    : [
        {
          id: "1",
          name: "Vercel",
          url: "https://vercel.com",
          logoUrl: "/sponsors/vercel.svg",
          tier: "Platinum",
        },
        {
          id: "2",
          name: "Figma",
          url: "https://figma.com",
          logoUrl: "/sponsors/figma.svg",
          tier: "Platinum",
        },
        {
          id: "3",
          name: "Linear",
          url: "https://linear.app",
          logoUrl: "/sponsors/linear.svg",
          tier: "Gold",
        },
        {
          id: "4",
          name: "Stripe",
          url: "https://stripe.com",
          logoUrl: "/sponsors/stripe.svg",
          tier: "Gold",
        },
        {
          id: "5",
          name: "Adobe",
          url: "https://adobe.com",
          logoUrl: "/sponsors/adobe.svg",
          tier: "Silver",
        },
        {
          id: "6",
          name: "Cursor",
          url: "https://cursor.com",
          logoUrl: "/sponsors/cursor.svg",
          tier: "Silver",
        },
      ];

  const row = [...items, ...items];

  return (
    <section className="relative border-y border-line py-24 sm:py-28">
      <Container className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-sm uppercase tracking-[0.22em] text-neon">
            Partners
          </p>
          <h2 className="mt-3 font-display text-[clamp(2.25rem,7vw,3.75rem)] leading-[1.05] text-text">
            Powered by
          </h2>
        </div>
        <Button href="/sponsors" variant="secondary">
          Sponsor packages
        </Button>
      </Container>

      <div className="overflow-hidden">
        <div className="animate-marquee flex w-max items-center gap-10 px-6 sm:gap-16">
          {row.map((s, i) => (
            <a
              key={`${s.id}-${i}`}
              href={s.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-w-[9rem] items-center justify-center opacity-80 transition hover:opacity-100"
            >
              {"logoUrl" in s && s.logoUrl ? (
                <Image
                  src={s.logoUrl}
                  alt={s.name}
                  width={140}
                  height={48}
                  className="h-10 w-auto object-contain sm:h-12"
                />
              ) : (
                <span className="font-display text-3xl text-muted hover:text-neon">
                  {s.name}
                </span>
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
