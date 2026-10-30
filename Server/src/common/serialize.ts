/** Normalize ticket type / money fields for JSON responses. */
export function serializeTicketType<T extends { price: number; perks: unknown }>(
  ticketType: T,
) {
  return {
    ...ticketType,
    price: Number(ticketType.price),
    perks: Array.isArray(ticketType.perks)
      ? (ticketType.perks as string[])
      : [],
  };
}

export function serializeTicket<
  T extends {
    ticketType?: { price: number; perks: unknown } | null;
  },
>(ticket: T) {
  if (!ticket.ticketType) return ticket;
  return {
    ...ticket,
    ticketType: serializeTicketType(ticket.ticketType),
  };
}
