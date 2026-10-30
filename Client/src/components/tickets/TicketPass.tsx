"use client";

import { QRCodeSVG } from "qrcode.react";
import type { Ticket } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export function TicketPass({
  ticket,
  payload,
}: {
  ticket: Ticket;
  payload: string;
}) {
  return (
    <div className="mx-auto max-w-sm overflow-hidden rounded-2xl border border-neon/40 bg-surface shadow-[0_0_40px_rgba(182,255,59,0.12)]">
      <div className="bg-gradient-to-r from-violet/40 via-magenta/30 to-neon/20 px-6 py-5">
        <p className="font-display text-2xl uppercase text-neon">NEXUS</p>
        <p className="font-mono text-sm tracking-widest text-text">CONF 2026</p>
      </div>
      <div className="flex flex-col items-center gap-4 px-6 py-8">
        <QRCodeSVG
          value={payload}
          size={200}
          bgColor="#1A1527"
          fgColor="#B6FF3B"
          level="M"
          includeMargin
        />
        <div className="w-full text-center">
          <p className="font-display text-xl uppercase text-text">{ticket.name}</p>
          <p className="mt-1 text-sm text-muted">{ticket.email}</p>
          <p className="mt-3 font-mono text-sm text-neon">{ticket.code}</p>
          {ticket.ticketType && (
            <p className="mt-2 text-base text-magenta">
              {ticket.ticketType.name} · {formatCurrency(ticket.ticketType.price)}
            </p>
          )}
          <p className="mt-2 text-sm uppercase tracking-wide text-muted">
            Status: {ticket.status}
          </p>
        </div>
      </div>
    </div>
  );
}
