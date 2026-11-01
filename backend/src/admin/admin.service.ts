import { Injectable, NotFoundException } from '@nestjs/common';
import { TicketStatus } from '@prisma/client';
import { serializeTicket } from '../common/serialize.js';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreateSessionDto } from './dto/create-session.dto.js';
import type { UpdateSessionDto } from './dto/update-session.dto.js';

const sessionInclude = {
  track: true,
  room: true,
  speakers: { include: { speaker: true } },
} as const;

function mapSession<T extends { speakers: { speaker: unknown }[] }>(session: T) {
  return {
    ...session,
    speakers: session.speakers.map((s) => s.speaker),
  };
}

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async listSessions() {
    const sessions = await this.prisma.session.findMany({
      include: sessionInclude,
      orderBy: { startsAt: 'asc' },
    });
    return sessions.map(mapSession);
  }

  async createSession(dto: CreateSessionDto) {
    const session = await this.prisma.session.create({
      data: {
        slug: dto.slug,
        title: dto.title,
        abstract: dto.abstract,
        startsAt: new Date(dto.startsAt),
        endsAt: new Date(dto.endsAt),
        trackId: dto.trackId,
        roomId: dto.roomId,
        level: dto.level,
        speakers: dto.speakerIds?.length
          ? {
              create: dto.speakerIds.map((speakerId) => ({ speakerId })),
            }
          : undefined,
      },
      include: sessionInclude,
    });
    return mapSession(session);
  }

  async updateSession(id: string, dto: UpdateSessionDto) {
    const existing = await this.prisma.session.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Session not found');

    if (dto.speakerIds) {
      await this.prisma.sessionSpeaker.deleteMany({ where: { sessionId: id } });
      if (dto.speakerIds.length) {
        await this.prisma.sessionSpeaker.createMany({
          data: dto.speakerIds.map((speakerId) => ({
            sessionId: id,
            speakerId,
          })),
        });
      }
    }

    const session = await this.prisma.session.update({
      where: { id },
      data: {
        slug: dto.slug,
        title: dto.title,
        abstract: dto.abstract,
        startsAt: dto.startsAt ? new Date(dto.startsAt) : undefined,
        endsAt: dto.endsAt ? new Date(dto.endsAt) : undefined,
        trackId: dto.trackId === undefined ? undefined : dto.trackId,
        roomId: dto.roomId === undefined ? undefined : dto.roomId,
        level: dto.level === undefined ? undefined : dto.level,
      },
      include: sessionInclude,
    });
    return mapSession(session);
  }

  async deleteSession(id: string) {
    const existing = await this.prisma.session.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Session not found');
    await this.prisma.session.delete({ where: { id } });
    return { ok: true };
  }

  async attendees() {
    const tickets = await this.prisma.ticket.findMany({
      include: { ticketType: true, user: true },
      orderBy: { createdAt: 'desc' },
    });
    return tickets.map((t) => ({
      ...serializeTicket(t),
      user: t.user
        ? {
            id: t.user.id,
            email: t.user.email,
            name: t.user.name,
            company: t.user.company,
            role: t.user.role,
          }
        : null,
    }));
  }

  async stats() {
    const [
      speakers,
      sessions,
      tickets,
      paid,
      checkedIn,
      users,
      ticketTypes,
    ] = await Promise.all([
      this.prisma.speaker.count(),
      this.prisma.session.count(),
      this.prisma.ticket.count(),
      this.prisma.ticket.count({ where: { status: TicketStatus.PAID } }),
      this.prisma.ticket.count({ where: { status: TicketStatus.CHECKED_IN } }),
      this.prisma.user.count(),
      this.prisma.ticketType.findMany({
        orderBy: { sortOrder: 'asc' },
        include: { _count: { select: { tickets: true } } },
      }),
    ]);

    return {
      speakers,
      sessions,
      tickets,
      paid,
      checkedIn,
      users,
      byTicketType: ticketTypes.map((tt) => ({
        id: tt.id,
        name: tt.name,
        price: Number(tt.price),
        capacity: tt.capacity,
        sold: tt._count.tickets,
      })),
    };
  }
}
