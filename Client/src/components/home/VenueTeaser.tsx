"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, MapPin } from "lucide-react";
import { venueApi } from "@/lib/api";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function VenueTeaser() {
  const { data: venue } = useQuery({
    queryKey: ["venue"],
    queryFn: venueApi.get,
  });
  return (
    <section className="py-20 sm:py-24 lg:py-28">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-24">
        <div className="relative aspect-[1.12/1] overflow-hidden rounded-xl">
          <Image
            src="/images/venue.jpg"
            alt="A lively festival crowd beneath a shower of confetti"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 90vw, 45vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white">
            <div>
              <p className="mb-2 font-mono text-sm text-white/65">
                THE MEETING POINT
              </p>
              <p className="font-display text-3xl font-medium!">
                NEXUS Arena · Dhaka
              </p>
            </div>
            <MapPin size={23} strokeWidth={1.5} />
          </div>
        </div>
        <div>
          <p className="eyebrow text-muted">More than a venue</p>
          <h2 className="section-heading mt-6">
            Come for the ideas.
            <br />
            <span className="accent-serif text-neon">
              Stay for the feeling.
            </span>
          </h2>
          <p className="mt-6 max-w-[390px] text-base leading-[1.8] text-muted">
            {venue?.description ??
              "From the mainstage to the courtyard, there’s always another conversation waiting. Make yourself at home at NEXUS Arena."}
          </p>
          <div className="mt-7 flex items-start gap-3 border-t border-line pt-6">
            <MapPin size={19} className="mt-1 shrink-0 text-neon" />
            <div>
              <p className="text-sm font-medium">
                {venue?.name ?? "NEXUS Arena · Dhaka"}
              </p>
              <p className="mt-1 text-sm text-muted">
                {venue?.address ??
                  "Plot 12, Gulshan Avenue, Dhaka 1212, Bangladesh"}
              </p>
            </div>
          </div>
          <Button href="/venue" variant="secondary" className="mt-7">
            Plan your visit <ArrowUpRight size={16} />
          </Button>
        </div>
      </Container>
    </section>
  );
}
