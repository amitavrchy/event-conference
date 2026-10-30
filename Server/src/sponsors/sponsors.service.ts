import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class SponsorsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.sponsor.findMany({
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
  }
}
