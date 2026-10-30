import Link from "next/link";
import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-surface/30 py-16">
      <Container className="flex flex-col gap-12 md:flex-row md:justify-between">
        <div>
          <p className="font-display text-5xl text-neon">NEXUS</p>
          <p className="mt-4 max-w-sm text-base text-muted">
            Conf 2026 · Sep 18–20 · Dhaka. Three days that reshape how you build.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-14 gap-y-3 text-sm uppercase tracking-[0.12em]">
          {[
            ["/schedule", "Schedule"],
            ["/speakers", "Speakers"],
            ["/tickets", "Tickets"],
            ["/venue", "Venue"],
            ["/sponsors", "Sponsors"],
            ["/register", "Register"],
            ["/ticket/pass", "Pass"],
            ["/live", "Live"],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="text-muted transition hover:text-neon"
            >
              {label}
            </Link>
          ))}
        </div>
      </Container>
      <Container className="mt-12 border-t border-line pt-6">
        <p className="font-mono text-sm text-muted">© 2026 NEXUS Conf</p>
      </Container>
    </footer>
  );
}
