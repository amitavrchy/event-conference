import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class SpeakersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const speakers = await this.prisma.speaker.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { sessions: true } } },
    });

    return speakers.map(({ _count, ...speaker }) => ({
      ...speaker,
      sessionCount: _count.sessions,
    }));
  }

  async findBySlug(slug: string) {
    const speaker = await this.prisma.speaker.findUnique({
      where: { slug },
      include: {
        sessions: {
          include: {
            session: {
              include: {
                track: true,
                room: true,
              },
            },
          },
        },
      },
    });
    if (!speaker) throw new NotFoundException('Speaker not found');

    return {
      ...speaker,
      sessions: speaker.sessions.map((ss) => ss.session),
    };
  }
}
