import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class VenueService {
  constructor(private readonly prisma: PrismaService) {}

  async getVenue() {
    const venue = await this.prisma.venueInfo.findFirst({
      orderBy: { id: 'asc' },
    });
    if (!venue) throw new NotFoundException('Venue not configured');
    return venue;
  }
}
