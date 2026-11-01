import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

const sessionInclude = {
  track: true,
  room: true,
  speakers: {
    include: { speaker: true },
  },
} as const;

function mapSession<
  T extends {
    speakers: { speaker: unknown }[];
  },
>(session: T) {
  return {
    ...session,
    speakers: session.speakers.map((s) => s.speaker),
  };
}

@Injectable()
export class SessionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const sessions = await this.prisma.session.findMany({
      include: sessionInclude,
      orderBy: { startsAt: 'asc' },
    });
    return sessions.map(mapSession);
  }

  async findBySlug(slug: string) {
    const session = await this.prisma.session.findUnique({
      where: { slug },
      include: sessionInclude,
    });
    if (!session) throw new NotFoundException('Session not found');
    return mapSession(session);
  }

  async scheduleByDay(day: string) {
    if (!day || !/^\d{4}-\d{2}-\d{2}$/.test(day)) {
      throw new BadRequestException('Query day=YYYY-MM-DD is required');
    }
    const start = new Date(`${day}T00:00:00.000Z`);
    if (Number.isNaN(start.getTime())) {
      throw new BadRequestException('Invalid day');
    }
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);

    const sessions = await this.prisma.session.findMany({
      where: {
        startsAt: { gte: start, lt: end },
      },
      include: sessionInclude,
      orderBy: { startsAt: 'asc' },
    });
    return sessions.map(mapSession);
  }

  findTracks() {
    return this.prisma.track.findMany({
      orderBy: { name: 'asc' },
    });
  }
}
