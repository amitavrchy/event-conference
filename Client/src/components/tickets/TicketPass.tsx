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
    <div className="mx-auto max-w-sm overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_12px_35px_#2527220a]">
      <div className="border-b border-line bg-bg px-6 py-5">
        <p className="flex items-center gap-3 font-display text-3xl text-text">
          <span className="nexus-mark text-neon" aria-hidden="true" />
          nexus
        </p>
        <p className="font-mono text-sm tracking-widest text-text">CONF 2026</p>
      </div>
      <div className="flex flex-col items-center gap-4 px-6 py-8">
        <QRCodeSVG
          value={payload}
          size={200}
          bgColor="#ffffff"
          fgColor="#252722"
          level="M"
          includeMargin
        />
        <div className="w-full text-center">
          <p className="font-display text-xl uppercase text-text">
            {ticket.name}
          </p>
          <p className="mt-1 break-all text-sm text-muted">{ticket.email}</p>
          <p className="mt-3 break-all font-mono text-sm text-neon">
            {ticket.code}
          </p>
          {ticket.ticketType && (
            <p className="mt-2 text-base text-magenta">
              {ticket.ticketType.name} ·{" "}
              {formatCurrency(ticket.ticketType.price)}
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
