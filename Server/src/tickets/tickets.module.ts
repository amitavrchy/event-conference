import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { StripeService } from './stripe.service.js';
import { TicketsController } from './tickets.controller.js';
import { TicketsService } from './tickets.service.js';

@Module({
  imports: [AuthModule],
  controllers: [TicketsController],
  providers: [TicketsService, StripeService],
  exports: [TicketsService],
})
export class TicketsModule {}
