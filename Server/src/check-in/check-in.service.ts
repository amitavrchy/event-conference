import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TicketStatus } from '@prisma/client';
import { verifyQrPayload } from '../common/qr.js';
import { serializeTicket } from '../common/serialize.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class CheckInService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async checkIn(code: string, payload?: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { code },
      include: { ticketType: true },
    });
    if (!ticket) throw new NotFoundException('Ticket not found');

    if (payload) {
      const secret = this.config.getOrThrow<string>('QR_HMAC_SECRET');
      if (!verifyQrPayload(payload, code, secret)) {
        throw new BadRequestException('Invalid QR payload');
      }
    }

    if (ticket.status === TicketStatus.CHECKED_IN) {
      return {
        ...serializeTicket(ticket),
        alreadyCheckedIn: true,
      };
    }

    if (
      ticket.status !== TicketStatus.PAID &&
      ticket.status !== TicketStatus.PENDING
    ) {
      throw new BadRequestException(`Cannot check in ticket with status ${ticket.status}`);
    }

    const updated = await this.prisma.ticket.update({
      where: { id: ticket.id },
      data: {
        status: TicketStatus.CHECKED_IN,
        checkedInAt: new Date(),
      },
      include: { ticketType: true },
    });

    return serializeTicket(updated);
  }
}
