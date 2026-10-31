import Link from "next/link";
import {
  ArrowUpRight,
  Layers,
  MousePointer2,
  Sparkles,
  Mic2,
} from "lucide-react";
import { Container } from "@/components/ui/Container";

const tracks = [
  {
    number: "01",
    name: "Design Systems",
    description:
      "The foundations of great experiences. Type, tokens, and systems built to grow.",
    icon: Layers,
  },
  {
    number: "02",
    name: "Product Craft",
    description:
      "The details that make the difference. Thoughtful products, from idea to impact.",
    icon: MousePointer2,
  },
  {
    number: "03",
    name: "AI & Interfaces",
    description:
      "New tools. Human perspectives. Exploring the next chapter of how we create.",
    icon: Sparkles,
  },
  {
    number: "04",
    name: "Mainstage",
    description:
      "Big questions and shared discoveries. Conversations that stay with you.",
    icon: Mic2,
  },
];

export function Themes() {
  return (
    <section className="overflow-hidden bg-[#282b25] py-20 text-[#f8f7f3] sm:py-24">
      <Container className="grid gap-12 lg:grid-cols-[.85fr_1.15fr] lg:gap-24">
        <div className="relative">
          <p className="eyebrow text-white/55">Explore the tracks</p>
          <h2 className="section-heading mt-6">
            A little curiosity.
            <br />A lot of{" "}
            <span className="accent-serif text-[#f29172]">possibility.</span>
          </h2>
          <p className="mt-6 max-w-[330px] text-base leading-relaxed text-white/55">
            Four different ways in. A whole new way of looking at things. Find
            the conversations that speak to you.
          </p>
          <Link
            href="/schedule"
            className="mt-7 inline-flex items-center gap-3 border-b border-white/30 pb-2 text-sm transition hover:border-[#f29172] hover:text-[#f29172]"
          >
            Explore the full program <ArrowUpRight size={16} />
          </Link>
          <div
            aria-hidden="true"
            className="relative mt-12 hidden h-[110px] w-[240px] overflow-hidden lg:block"
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="absolute rounded-full border border-[#f29172]/35"
                style={{
                  width: 210 - i * 32,
                  height: 210 - i * 32,
                  top: i * 16,
                  left: i * 16,
                }}
              />
            ))}
          </div>
        </div>
        <div>
          {tracks.map(({ number, name, description, icon: Icon }) => (
            <Link
              href="/schedule"
              key={name}
              className="group flex items-start gap-5 border-t border-white/15 py-7 first:pt-6 last:border-b sm:gap-6"
            >
              <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 text-[#f29172] transition group-hover:border-[#f29172] group-hover:bg-[#f29172] group-hover:text-[#282b25]">
                <Icon size={19} strokeWidth={1.5} />
              </span>
              <div className="flex-1">
                <p className="mb-1 font-mono text-sm text-white/40">
                  TRACK / {number}
                </p>
                <h3 className="font-display text-[26px] font-medium! tracking-[-.035em]! sm:text-[29px]">
                  {name}
                </h3>
                <p className="mt-2 max-w-[350px] text-sm leading-relaxed text-white/55">
                  {description}
                </p>
              </div>
              <ArrowUpRight
                size={19}
                className="mt-7 shrink-0 text-white/40 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#f29172]"
              />
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
