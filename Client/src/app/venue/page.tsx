"use client";

import { useQuery } from "@tanstack/react-query";
import { venueApi } from "@/lib/api";
import { Section } from "@/components/ui/Section";

export default function VenuePage() {
  const { data: venue, isLoading } = useQuery({
    queryKey: ["venue"],
    queryFn: venueApi.get,
  });

  const mapSrc = venue
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${venue.lng - 0.02}%2C${venue.lat - 0.015}%2C${venue.lng + 0.02}%2C${venue.lat + 0.015}&layer=mapnik&marker=${venue.lat}%2C${venue.lng}`
    : "";

  return (
    <Section
      eyebrow="Venue"
      title={venue?.name ?? "NEXUS Arena"}
      description={venue?.description ?? "Loading venue…"}
      className="pt-12"
    >
      {isLoading ? (
        <p className="text-base text-muted">Loading…</p>
      ) : (
        <>
          <p className="text-base text-muted">{venue?.address}</p>
          <div className="mt-8 overflow-hidden rounded-xl border border-line">
            <iframe
              title="Venue map"
              src={mapSrc}
              className="h-[360px] w-full bg-surface"
              loading="lazy"
            />
          </div>
          <div className="mt-10 max-w-2xl">
            <h3 className="font-display text-2xl text-text">Hotels nearby</h3>
            <p className="mt-3 text-base text-muted">{venue?.hotelTips}</p>
          </div>
        </>
      )}
    </Section>
  );
}
