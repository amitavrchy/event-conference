import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function TicketCTA() {
  return (
    <section className="pb-16 pt-2 sm:pb-24">
      <Container>
        <div className="relative isolate overflow-hidden rounded-xl bg-[#ed623e] px-7 py-12 text-[#252722] sm:px-12 sm:py-16 lg:px-16">
          <div
            aria-hidden="true"
            className="absolute -right-24 -top-28 -z-10 h-[600px] w-[600px] rounded-full border border-[#6c271b]/15"
          >
            {[1, 2, 3, 4, 5].map((i) => (
              <span
                key={i}
                className="absolute rounded-full border border-[#6c271b]/15"
                style={{ inset: i * 42 }}
              />
            ))}
          </div>
          <div className="flex flex-col justify-between gap-9 lg:flex-row lg:items-end">
            <div>
              <p className="mb-6 text-sm font-medium uppercase tracking-[.15em] text-[#542c21]">
                The next connection is yours
              </p>
              <h2 className="section-heading max-w-[700px] text-[clamp(2.75rem,5.5vw,5rem)]!">
                Your next big idea
                <br />
                starts with <span className="accent-serif">a hello.</span>
              </h2>
              <p className="mt-6 max-w-[490px] text-base text-[#542c21]">
                In the room or from wherever you are. Find your people, follow
                your curiosity, and make a little room for what&apos;s next.
              </p>
            </div>
            <div className="shrink-0">
              <Button
                href="/tickets"
                variant="magenta"
                className="min-h-14 px-8"
              >
                Find your NEXUS <ArrowUpRight size={19} />
              </Button>
              <p className="mt-4 text-sm text-[#542c21]">
                In-person & remote passes available
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
