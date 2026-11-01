"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { sponsorsApi } from "@/lib/api";
import { Container } from "@/components/ui/Container";

const partners = [
  { id: "vercel", name: "Vercel", url: "https://vercel.com" },
  { id: "figma", name: "Figma", url: "https://figma.com" },
  { id: "linear", name: "Linear", url: "https://linear.app" },
  { id: "stripe", name: "stripe", url: "https://stripe.com" },
  { id: "adobe", name: "Adobe", url: "https://adobe.com" },
  { id: "cursor", name: "Cursor", url: "https://cursor.com" },
];

function PartnerSymbol({ name }: { name: string }) {
  const key = name.toLowerCase();
  if (key === "figma")
    return (
      <span aria-hidden="true" className="grid grid-cols-2 gap-0.5">
        <i className="h-2.5 w-2.5 rounded-l-full bg-current" />
        <i className="h-2.5 w-2.5 rounded-r-full bg-current" />
        <i className="h-2.5 w-2.5 rounded-l-full bg-current" />
        <i className="h-2.5 w-2.5 rounded-full bg-current" />
        <i className="h-2.5 w-2.5 rounded-l-full rounded-br-full bg-current" />
      </span>
    );
  if (key === "vercel")
    return (
      <span
        aria-hidden="true"
        className="h-0 w-0 border-x-[11px] border-b-[20px] border-x-transparent border-b-current"
      />
    );
  if (key === "linear")
    return (
      <span
        aria-hidden="true"
        className="h-6 w-6 rounded-full bg-[repeating-linear-gradient(45deg,currentColor_0px,currentColor_2px,transparent_2px,transparent_4px)]"
      />
    );
  if (key === "adobe")
    return (
      <span
        aria-hidden="true"
        className="font-display text-[32px] leading-none"
      >
        A
      </span>
    );
  if (key === "cursor")
    return (
      <span
        aria-hidden="true"
        className="h-5 w-5 -rotate-30 border-[5px] border-current"
      />
    );
  return null;
}

export function SponsorsMarquee() {
  const { data: sponsors = [] } = useQuery({
    queryKey: ["sponsors"],
    queryFn: sponsorsApi.list,
  });
  const items = sponsors.length ? sponsors : partners;
  return (
    <section aria-label="Conference partners" className="pb-3 pt-8 sm:pt-9">
      <Container className="flex flex-col items-center gap-7 border-b border-line pb-10 lg:flex-row lg:gap-12">
        <Link
          href="/sponsors"
          className="shrink-0 text-center text-sm leading-relaxed text-muted lg:text-left"
        >
          In good company.
          <br />
          <span className="text-text">Our community partners</span>
        </Link>
        <div className="grid w-full grid-cols-3 items-center justify-between gap-x-5 gap-y-7 sm:grid-cols-6 lg:flex lg:flex-wrap">
          {items.slice(0, 6).map((partner) => (
            <a
              key={partner.id}
              href={partner.url ?? "/sponsors"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 font-display text-xl font-semibold! tracking-[-.04em]! text-text/70 transition hover:text-neon sm:text-[23px]"
            >
              <PartnerSymbol name={partner.name} />
              {partner.name.toLowerCase() === "stripe"
                ? "stripe"
                : partner.name}
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
