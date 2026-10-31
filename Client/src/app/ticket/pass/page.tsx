"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ticketsApi } from "@/lib/api";
import { useAppSelector } from "@/store/hooks";
import { Section } from "@/components/ui/Section";
import { TicketPass } from "@/components/tickets/TicketPass";
import { Button } from "@/components/ui/Button";
import type { Ticket } from "@/lib/types";

function readStoredTicket(): Ticket | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem("nexus_last_ticket");
    return raw ? (JSON.parse(raw) as Ticket) : null;
  } catch {
    return null;
  }
}

function PassContent() {
  const searchParams = useSearchParams();
  const codeParam = searchParams.get("code");
  const sessionId = searchParams.get("session_id");
  const token = useAppSelector((s) => s.auth.token);
  const [code, setCode] = useState(codeParam ?? "");
  const [stored, setStored] = useState<Ticket | null>(null);

  useEffect(() => {
    if (codeParam) setCode(codeParam);
    setStored(readStoredTicket());
  }, [codeParam]);

  const confirmQuery = useQuery({
    queryKey: ["tickets", "confirm", sessionId],
    queryFn: () => ticketsApi.confirm(sessionId!),
    enabled: !!sessionId,
    retry: 2,
  });

  const meQuery = useQuery({
    queryKey: ["tickets", "me"],
    queryFn: ticketsApi.me,
    enabled: !!token && !codeParam,
  });

  const resolvedCode = useMemo(
    () =>
      codeParam ||
      code ||
      confirmQuery.data?.code ||
      stored?.code ||
      meQuery.data?.[0]?.code ||
      "",
    [codeParam, code, confirmQuery.data, stored, meQuery.data],
  );

  const ticketQuery = useQuery({
    queryKey: ["tickets", resolvedCode],
    queryFn: () => ticketsApi.byCode(resolvedCode),
    enabled: !!resolvedCode,
    retry: false,
  });

  const qrQuery = useQuery({
    queryKey: ["tickets", resolvedCode, "qr"],
    queryFn: () => ticketsApi.qrPayload(resolvedCode),
    enabled: !!resolvedCode,
    retry: false,
  });

  const ticket: Ticket | undefined =
    confirmQuery.data ??
    ticketQuery.data ??
    (stored && stored.code === resolvedCode ? stored : undefined) ??
    meQuery.data?.find((t) => t.code === resolvedCode) ??
    meQuery.data?.[0] ??
    stored ??
    undefined;

  return (
    <Section
      eyebrow="Pass"
      title="Ticket pass"
      description="Show this QR at the door. Staff can scan or paste the payload."
      className="pt-12"
    >
      {sessionId && confirmQuery.isLoading && (
        <p className="mb-6 text-base text-neon">Confirming Stripe payment…</p>
      )}
      {sessionId && confirmQuery.isError && (
        <p className="mb-6 text-base text-warn">
          Payment confirmation pending. If you were charged, refresh in a
          moment.
        </p>
      )}

      <form
        className="mb-10 flex max-w-md flex-col gap-3 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          setCode(String(fd.get("code") || ""));
        }}
      >
        <input
          name="code"
          defaultValue={code || resolvedCode}
          placeholder="Ticket code"
          className="min-w-0 flex-1 rounded-lg border border-line bg-bg px-4 py-3 text-base text-text outline-none focus:border-neon"
        />
        <Button type="submit" variant="secondary">
          Load
        </Button>
      </form>

      {ticket && qrQuery.data?.payload ? (
        <TicketPass ticket={ticket} payload={qrQuery.data.payload} />
      ) : (
        <div className="space-y-4">
          {(ticketQuery.isLoading ||
            qrQuery.isLoading ||
            meQuery.isLoading) && (
            <p className="text-base text-muted">Loading pass…</p>
          )}
          {(ticketQuery.isError || qrQuery.isError) && (
            <p className="text-base text-warn">Could not load ticket pass.</p>
          )}
          {!resolvedCode && (
            <p className="text-base text-muted">
              Enter a code or{" "}
              <Button href="/tickets" variant="ghost" className="inline px-0">
                buy a pass
              </Button>
              .
            </p>
          )}
        </div>
      )}
    </Section>
  );
}

export default function TicketPassPage() {
  return (
    <Suspense
      fallback={
        <Section title="Ticket pass" className="pt-12">
          <p className="text-base text-muted">Loading…</p>
        </Section>
      }
    >
      <PassContent />
    </Suspense>
  );
}
