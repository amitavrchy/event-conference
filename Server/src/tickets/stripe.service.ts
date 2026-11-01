import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);
  private readonly stripe: Stripe | null;
  readonly enabled: boolean;

  constructor(private readonly config: ConfigService) {
    const key = this.config.get<string>('STRIPE_SECRET_KEY');
    this.enabled = Boolean(key);
    this.stripe = key
      ? new Stripe(key, {
          apiVersion: '2026-10-28.endive',
        })
      : null;
    if (!this.enabled) {
      this.logger.warn(
        'STRIPE_SECRET_KEY missing — checkout will use mock PAID mode',
      );
    }
  }

  get client(): Stripe {
    if (!this.stripe) {
      throw new Error('Stripe is not configured');
    }
    return this.stripe;
  }

  constructEvent(rawBody: Buffer, signature: string) {
    const secret = this.config.getOrThrow<string>('STRIPE_WEBHOOK_SECRET');
    return this.client.webhooks.constructEvent(rawBody, signature, secret);
  }
}
