import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  type RawBodyRequest,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import {
  CurrentUser,
  type AuthUser,
} from '../auth/decorators/current-user.decorator.js';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard.js';
import { CheckoutDto } from './dto/checkout.dto.js';
import { TicketsService } from './tickets.service.js';

@Controller()
export class TicketsController {
  constructor(private readonly tickets: TicketsService) {}

  @Get('ticket-types')
  listTypes() {
    return this.tickets.listTicketTypes();
  }

  @Post('tickets/checkout')
  @UseGuards(OptionalJwtAuthGuard)
  checkout(
    @Body() dto: CheckoutDto,
    @CurrentUser() user?: AuthUser,
  ) {
    return this.tickets.checkout(dto, user);
  }

  @Get('tickets/confirm')
  confirm(@Query('session_id') sessionId: string) {
    return this.tickets.confirmStripeSession(sessionId);
  }

  @Post('tickets/stripe/webhook')
  stripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    const raw = req.rawBody;
    if (!raw || !signature) {
      throw new BadRequestException('Missing Stripe webhook payload');
    }
    return this.tickets.handleStripeWebhook(raw, signature);
  }

  @Get('tickets/me')
  @UseGuards(AuthGuard('jwt'))
  myTickets(@CurrentUser() user: AuthUser) {
    return this.tickets.myTickets(user.id);
  }

  /** Ticket code acts as a bearer secret for pass links after checkout. */
  @Get('tickets/:code/qr-payload')
  qrPayload(@Param('code') code: string) {
    return this.tickets.qrPayloadPublic(code);
  }

  @Get('tickets/:code')
  findByCode(@Param('code') code: string) {
    return this.tickets.findByCodePublic(code);
  }
}
