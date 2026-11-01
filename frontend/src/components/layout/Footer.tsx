import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="mt-auto overflow-hidden bg-[#252722] pt-14 text-[#f8f7f3] sm:pt-20">
      <Container>
        <div className="grid gap-12 border-b border-white/15 pb-12 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-3 font-display text-3xl tracking-[-.05em]"
            >
              <span className="nexus-mark text-[#f28b6b]" aria-hidden="true" />
              nexus conf.
            </Link>
            <p className="mt-5 max-w-[300px] text-sm leading-relaxed text-white/60">
              An intersection of ideas, people, and possibilities. Made for the
              beautifully curious.
            </p>
            <p className="mt-5 text-sm text-[#f28b6b]">
              September 18–20, 2026 · Dhaka
            </p>
          </div>
          <div>
            <p className="mb-5 text-sm text-white/45">Find your way</p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              {[
                ["/speakers", "Speakers"],
                ["/schedule", "Schedule"],
                ["/tickets", "Tickets"],
                ["/venue", "The venue"],
                ["/sponsors", "Partners"],
                ["/live", "Watch live"],
              ].map(([href, label]) => (
                <Link
                  key={href}
                  href={href}
                  className="text-white/80 transition hover:text-[#f28b6b]"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-5 text-sm text-white/45">
              See you at the intersection.
            </p>
            <Link
              href="/register"
              className="flex items-center justify-between border-b border-white/25 pb-3 text-base hover:text-[#f28b6b]"
            >
              Join the community <ArrowUpRight size={18} />
            </Link>
            <Link
              href="/ticket/pass"
              className="mt-4 inline-block text-sm text-white/60 hover:text-[#f28b6b]"
            >
              Already joining? Open your pass ↗
            </Link>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="select-none whitespace-nowrap pb-3 pt-8 font-display text-[clamp(3rem,14.7vw,13.3rem)] font-medium! leading-none! tracking-[-.065em]! text-[#ee8766]"
        >
          stay curious.
        </div>
        <div className="flex flex-col justify-between gap-3 border-t border-white/15 py-6 text-sm text-white/45 sm:flex-row">
          <p>© 2026 NEXUS Conf. All rights reserved.</p>
          <p>Design × technology × human connection</p>
        </div>
      </Container>
    </footer>
  );
}
