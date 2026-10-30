import { Controller, Get, Param, Query } from '@nestjs/common';
import { SessionsService } from './sessions.service.js';

@Controller()
export class SessionsController {
  constructor(private readonly sessions: SessionsService) {}

  @Get('sessions')
  findAll() {
    return this.sessions.findAll();
  }

  @Get('sessions/:slug')
  findOne(@Param('slug') slug: string) {
    return this.sessions.findBySlug(slug);
  }

  @Get('schedule')
  schedule(@Query('day') day: string) {
    return this.sessions.scheduleByDay(day);
  }

  @Get('tracks')
  tracks() {
    return this.sessions.findTracks();
  }
}
