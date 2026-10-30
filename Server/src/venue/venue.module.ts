import { Module } from '@nestjs/common';
import { VenueController } from './venue.controller.js';
import { VenueService } from './venue.service.js';

@Module({
  controllers: [VenueController],
  providers: [VenueService],
})
export class VenueModule {}
