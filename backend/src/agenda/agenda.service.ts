import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

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

function overlaps(
  aStart: Date,
  aEnd: Date,
  bStart: Date,
  bEnd: Date,
): boolean {
  return aStart < bEnd && bStart < aEnd;
}

@Injectable()
export class AgendaService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string) {
    const items = await this.prisma.agendaItem.findMany({
      where: { userId },
      include: { session: { include: sessionInclude } },
      orderBy: { session: { startsAt: 'asc' } },
    });

    return {
      sessionIds: items.map((i) => i.sessionId),
      sessions: items.map((i) => mapSession(i.session)),
    };
  }

  async add(userId: string, sessionId: string) {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
      include: sessionInclude,
    });
    if (!session) throw new NotFoundException('Session not found');

    const existing = await this.prisma.agendaItem.findUnique({
      where: { userId_sessionId: { userId, sessionId } },
    });
    if (existing) throw new ConflictException('Already on agenda');

    const others = await this.prisma.agendaItem.findMany({
      where: { userId },
      include: { session: true },
    });

    const hasOverlap = others.some((item) =>
      overlaps(
        session.startsAt,
        session.endsAt,
        item.session.startsAt,
        item.session.endsAt,
      ),
    );

    await this.prisma.agendaItem.create({
      data: { userId, sessionId },
    });

    const result: {
      session: ReturnType<typeof mapSession>;
      warning?: string;
    } = {
      session: mapSession(session),
    };
    if (hasOverlap) result.warning = 'overlap';
    return result;
  }

  async remove(userId: string, sessionId: string) {
    const existing = await this.prisma.agendaItem.findUnique({
      where: { userId_sessionId: { userId, sessionId } },
    });
    if (!existing) throw new NotFoundException('Agenda item not found');

    await this.prisma.agendaItem.delete({
      where: { id: existing.id },
    });
    return { ok: true };
  }
}
