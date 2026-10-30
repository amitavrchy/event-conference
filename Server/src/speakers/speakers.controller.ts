import { Controller, Get, Param } from '@nestjs/common';
import { SpeakersService } from './speakers.service.js';

@Controller('speakers')
export class SpeakersController {
  constructor(private readonly speakers: SpeakersService) {}

  @Get()
  findAll() {
    return this.speakers.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.speakers.findBySlug(slug);
  }
}
