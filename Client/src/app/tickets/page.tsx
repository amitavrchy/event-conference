"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ticketsApi } from "@/lib/api";
import { Section } from "@/components/ui/Section";
import { TierCards } from "@/components/tickets/TierCards";
import { CheckoutForm } from "@/components/tickets/CheckoutForm";
import { FAQ } from "@/components/home/FAQ";

export default function TicketsPage() {
  const { data: types = [], isLoading, isError } = useQuery({
    queryKey: ["ticket-types"],
    queryFn: ticketsApi.types,
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <>
      <Section
        eyebrow="Passes"
        title="Tickets"
        description="Early Bird · Regular · VIP · Remote — pick your format."
        className="pt-12"
      >
        {isLoading && <p className="text-base text-muted">Loading tiers…</p>}
        {isError && (
          <p className="text-base text-warn">Could not load ticket types.</p>
        )}
        <TierCards
          types={types}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
        <div className="mt-14">
          <CheckoutForm ticketTypeId={selectedId} />
        </div>
      </Section>
      <FAQ />
    </>
  );
}
