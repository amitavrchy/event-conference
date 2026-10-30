import { Controller, Get } from '@nestjs/common';
import { SponsorsService } from './sponsors.service.js';

@Controller('sponsors')
export class SponsorsController {
  constructor(private readonly sponsors: SponsorsService) {}

  @Get()
  findAll() {
    return this.sponsors.findAll();
  }
}
