import { Controller, Get } from '@nestjs/common';
import { VenueService } from './venue.service.js';

@Controller('venue')
export class VenueController {
  constructor(private readonly venue: VenueService) {}

  @Get()
  getVenue() {
    return this.venue.getVenue();
  }
}
