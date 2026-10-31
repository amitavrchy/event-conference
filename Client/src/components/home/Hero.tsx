import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-0 pt-10 sm:pt-16 lg:pt-[72px]">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-12 xl:gap-20">
          <div className="hero-reveal pb-4">
            <p className="eyebrow text-muted">
              Where design meets what&apos;s next
            </p>
            <h1 className="mt-7 font-display text-[clamp(3.75rem,7.1vw,6.5rem)] font-medium! leading-[1.02]! tracking-[-0.075em]!">
              Big ideas.
              <br />
              Real people.
              <br />
              <span className="accent-serif text-neon">New possibilities.</span>
            </h1>
            <p className="mt-7 max-w-[390px] text-base leading-[1.8] text-muted">
              A meeting of curious minds. Three days of design, technology, and
              conversations that move us forward.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button href="/tickets" className="min-w-40">
                Find your pass <ArrowUpRight size={17} />
              </Button>
              <Button
                href="/schedule"
                variant="ghost"
                className="px-2 text-text"
              >
                Explore the schedule <ArrowUpRight size={16} />
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted">
              <span className="flex items-center gap-2">
                <CalendarDays size={16} className="text-neon" /> September
                18–20, 2026
              </span>
              <span className="flex items-center gap-2">
                <MapPin size={16} className="text-neon" /> Dhaka, Bangladesh
              </span>
            </div>
          </div>
          <div className="hero-reveal-delay relative mb-8 ml-0 lg:ml-4">
            <div className="hero-photo relative aspect-[1/1.06] overflow-hidden rounded-[12px] sm:aspect-[1.1/1] lg:aspect-[1/1.04]">
              <Image
                src="/images/conference.jpg"
                alt="A room full of curious minds coming together at a conference"
                fill
                preload
                sizes="(max-width: 1024px) 90vw, 45vw"
                className="object-cover object-center"
              />
              <div className="absolute left-6 top-6 z-10 flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-sm text-white backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-[#f8b79c]" /> The
                design × tech gathering
              </div>
              <div className="hero-orbit" aria-hidden="true" />
              <span className="orbit-cross" aria-hidden="true">
                ✳
              </span>
              <div className="absolute inset-x-6 bottom-16 z-10 flex items-end justify-between gap-4 text-white">
                <div>
                  <p className="text-sm text-white/70">
                    Different perspectives.
                  </p>
                  <p className="mt-1 font-display text-[26px] font-medium! tracking-[-.04em]! sm:text-[32px]">
                    One shared future.
                  </p>
                </div>
                <span
                  className="nexus-mark mb-1 text-[#ff906f]"
                  aria-hidden="true"
                />
              </div>
            </div>
            <div className="hero-date-card absolute -bottom-7 left-4 right-4 z-20 flex items-center justify-between gap-3 rounded-lg border border-line bg-bg px-4 py-4 sm:-left-7 sm:right-auto sm:gap-5 sm:px-6">
              <span className="whitespace-nowrap font-display text-[34px] font-medium! tracking-[-.065em]! sm:text-[42px]">
                18—20
              </span>
              <span className="h-10 w-px bg-line" />
              <span className="whitespace-nowrap text-sm leading-[1.5] text-muted">
                SEPTEMBER
                <br />
                <span className="font-medium text-text">DHAKA · 2026</span>
              </span>
              <ArrowUpRight
                size={21}
                className="hidden text-neon sm:ml-3 sm:block"
              />
            </div>
            <span className="absolute -right-3 -top-4 z-20 flex h-[70px] w-[70px] rotate-12 items-center justify-center rounded-full bg-[#e5e8d7] text-center font-mono text-sm leading-[1.25] text-text sm:-right-5">
              STAY
              <br />
              CURIOUS.
            </span>
          </div>
        </div>
        <div className="mt-12 flex flex-col justify-between gap-6 border-b border-line pb-7 pt-5 sm:mt-14 sm:flex-row sm:items-center lg:mt-16">
          <p className="max-w-sm text-sm text-muted">
            For the designers, the builders,
            <br className="hidden sm:block" /> and the beautifully curious.
          </p>
          <div className="grid grid-cols-3 gap-4 sm:flex sm:items-center sm:gap-10">
            {[
              ["03", "Days of discovery"],
              ["04", "Unique tracks"],
              ["01", "Shared experience"],
            ].map(([number, label]) => (
              <div
                key={number}
                className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-3"
              >
                <span className="font-display text-[30px] font-medium! sm:text-[34px]">
                  {number}
                </span>
                <span className="max-w-[80px] text-sm leading-snug text-muted">
                  {label}
                </span>
              </div>
            ))}
          </div>
          <Link
            href="#the-lineup"
            aria-label="Discover the speaker lineup"
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-line transition hover:border-neon hover:text-neon xl:flex"
          >
            <ArrowDown size={16} />
          </Link>
        </div>
      </Container>
    </section>
  );
}
