import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Role, TicketStatus } from '@prisma/client';
import { signTicketCode } from '../common/qr.js';
import { serializeTicket, serializeTicketType } from '../common/serialize.js';
import { PrismaService } from '../prisma/prisma.service.js';
import type { AuthUser } from '../auth/decorators/current-user.decorator.js';
import type { CheckoutDto } from './dto/checkout.dto.js';
import { StripeService } from './stripe.service.js';

const ticketInclude = { ticketType: true } as const;

@Injectable()
export class TicketsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly stripeService: StripeService,
  ) {}

  async listTicketTypes() {
    const types = await this.prisma.ticketType.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    return types.map(serializeTicketType);
  }

  async checkout(dto: CheckoutDto, user?: AuthUser | null) {
    const ticketType = await this.prisma.ticketType.findUnique({
      where: { id: dto.ticketTypeId },
    });
    if (!ticketType) throw new NotFoundException('Ticket type not found');

    const sold = await this.prisma.ticket.count({
      where: {
        ticketTypeId: ticketType.id,
        status: {
          in: [
            TicketStatus.PENDING,
            TicketStatus.PAID,
            TicketStatus.CHECKED_IN,
          ],
        },
      },
    });
    if (sold >= ticketType.capacity) {
      throw new ForbiddenException('Ticket type sold out');
    }

    const ticket = await this.prisma.ticket.create({
      data: {
        ticketTypeId: ticketType.id,
        email: dto.email.toLowerCase(),
        name: dto.name,
        userId: user?.id,
        status: TicketStatus.PENDING,
      },
      include: ticketInclude,
    });

    // Local/demo without Stripe keys: keep previous mock PAID behavior.
    if (!this.stripeService.enabled) {
      const paid = await this.prisma.ticket.update({
        where: { id: ticket.id },
        data: { status: TicketStatus.PAID },
        include: ticketInclude,
      });
      return {
        mode: 'mock' as const,
        checkoutUrl: null,
        ticket: serializeTicket(paid),
      };
    }

    const clientOrigin =
      this.config.get<string>('CLIENT_ORIGIN') ?? 'http://localhost:3000';
    const unitAmount = Math.round(Number(ticketType.price) * 100);
    if (!Number.isFinite(unitAmount) || unitAmount < 50) {
      throw new BadRequestException('Invalid ticket price for Stripe');
    }

    const session = await this.stripeService.client.checkout.sessions.create({
      mode: 'payment',
      customer_email: dto.email.toLowerCase(),
      client_reference_id: ticket.id,
      metadata: {
        ticketId: ticket.id,
        ticketCode: ticket.code,
        ticketTypeId: ticketType.id,
      },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: unitAmount,
            product_data: {
              name: `NEXUS Conf 2026 — ${ticketType.name}`,
              description: ticketType.description,
            },
          },
        },
      ],
      success_url: `${clientOrigin}/ticket/pass?code=${encodeURIComponent(ticket.code)}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientOrigin}/tickets?canceled=1`,
    });

    await this.prisma.ticket.update({
      where: { id: ticket.id },
      data: { stripeSessionId: session.id },
    });

    return {
      mode: 'stripe' as const,
      checkoutUrl: session.url,
      ticket: serializeTicket(ticket),
    };
  }

  async confirmStripeSession(sessionId: string) {
    if (!this.stripeService.enabled) {
      throw new BadRequestException('Stripe is not configured');
    }
    const session =
      await this.stripeService.client.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== 'paid') {
      throw new BadRequestException('Payment not completed');
    }
    return this.markPaidFromSession(session.id, session.metadata?.ticketId);
  }

  async handleStripeWebhook(rawBody: Buffer, signature: string) {
    const event = this.stripeService.constructEvent(rawBody, signature);
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      await this.markPaidFromSession(session.id, session.metadata?.ticketId);
    }
    return { received: true };
  }

  private async markPaidFromSession(
    sessionId: string,
    ticketId?: string | null,
  ) {
    const ticket = ticketId
      ? await this.prisma.ticket.findUnique({
          where: { id: ticketId },
          include: ticketInclude,
        })
      : await this.prisma.ticket.findFirst({
          where: { stripeSessionId: sessionId },
          include: ticketInclude,
        });

    if (!ticket) throw new NotFoundException('Ticket not found for session');

    if (
      ticket.status === TicketStatus.PAID ||
      ticket.status === TicketStatus.CHECKED_IN
    ) {
      return serializeTicket(ticket);
    }

    const paid = await this.prisma.ticket.update({
      where: { id: ticket.id },
      data: {
        status: TicketStatus.PAID,
        stripeSessionId: sessionId,
      },
      include: ticketInclude,
    });
    return serializeTicket(paid);
  }

  async myTickets(userId: string) {
    const tickets = await this.prisma.ticket.findMany({
      where: { userId },
      include: ticketInclude,
      orderBy: { createdAt: 'desc' },
    });
    return tickets.map(serializeTicket);
  }

  async findByCode(code: string, user: AuthUser) {
    const ticket = await this.findByCodePublic(code);

    const isStaff = user.role === Role.ADMIN || user.role === Role.STAFF;
    const isOwner =
      ticket.userId === user.id ||
      ticket.email.toLowerCase() === user.email.toLowerCase();

    if (!isStaff && !isOwner) {
      throw new ForbiddenException('Not allowed to view this ticket');
    }

    return ticket;
  }

  async findByCodePublic(code: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { code },
      include: ticketInclude,
    });
    if (!ticket) throw new NotFoundException('Ticket not found');
    return serializeTicket(ticket);
  }

  async qrPayload(code: string, user: AuthUser) {
    await this.findByCode(code, user);
    return this.qrPayloadPublic(code);
  }

  async qrPayloadPublic(code: string) {
    await this.findByCodePublic(code);
    const secret = this.config.getOrThrow<string>('QR_HMAC_SECRET');
    return { payload: signTicketCode(code, secret) };
  }
}
