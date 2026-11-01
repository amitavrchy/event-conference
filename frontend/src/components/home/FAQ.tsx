"use client";

import { useState } from "react";
import { Plus, Minus, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

const faqs = [
  {
    q: "When and where is NEXUS Conf?",
    a: "September 18–20, 2026 at NEXUS Arena, Gulshan, Dhaka. Join us for three days of design, technology, and connection.",
  },
  {
    q: "What’s included in a pass?",
    a: "Choose the pass that fits you. Regular includes all sessions, the sponsor expo, and networking night. VIP adds speaker dinner, lounge access, and priority seating. Remote includes the livestream and 30-day replay.",
  },
  {
    q: "Can I build my own schedule?",
    a: "Absolutely. Sign in, explore the schedule, and save the sessions you’d like to attend. We’ll let you know if your selections overlap.",
  },
  {
    q: "Can I join from another city?",
    a: "Yes. The Remote pass gives you access to livestreams across all stages, 30-day session replays, and the online community.",
  },
  {
    q: "How does check-in work?",
    a: "Your conference pass includes a personal QR code. Have it ready on your phone when you arrive, and our team will take care of the rest.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="border-t border-line pb-20 pt-16 sm:py-24">
      <Container className="grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:gap-24">
        <div>
          <p className="eyebrow text-muted">A few useful things</p>
          <h2 className="section-heading mt-5">
            Curious?
            <br />
            <span className="accent-serif text-neon">We figured.</span>
          </h2>
          <p className="mt-6 max-w-[290px] text-sm leading-relaxed text-muted">
            A little clarity before the big ideas. Here&apos;s what you need to
            know.
          </p>
          <Link
            href="/tickets"
            className="mt-6 inline-flex items-center gap-2 text-sm text-neon"
          >
            Explore passes & details <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="border-t border-line">
          {faqs.map((item, i) => (
            <div key={item.q} className="border-b border-line">
              <h3>
                <button
                  type="button"
                  id={`faq-question-${i}`}
                  aria-expanded={open === i}
                  aria-controls={`faq-answer-${i}`}
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-center justify-between gap-5 py-6 text-left text-base font-medium sm:text-lg"
                >
                  <span>{item.q}</span>
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${open === i ? "bg-[#f5e5dc] text-neon" : "text-muted"}`}
                  >
                    {open === i ? <Minus size={16} /> : <Plus size={16} />}
                  </span>
                </button>
              </h3>
              <div
                id={`faq-answer-${i}`}
                role="region"
                aria-labelledby={`faq-question-${i}`}
                hidden={open !== i}
              >
                <p className="max-w-[520px] pb-6 pr-8 text-sm leading-[1.85] text-muted">
                  {item.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
