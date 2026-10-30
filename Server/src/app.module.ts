import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './admin/admin.module.js';
import { AgendaModule } from './agenda/agenda.module.js';
import { AppController } from './app.controller.js';
import { AuthModule } from './auth/auth.module.js';
import { CheckInModule } from './check-in/check-in.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { SessionsModule } from './sessions/sessions.module.js';
import { SpeakersModule } from './speakers/speakers.module.js';
import { SponsorsModule } from './sponsors/sponsors.module.js';
import { TicketsModule } from './tickets/tickets.module.js';
import { VenueModule } from './venue/venue.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    SpeakersModule,
    SessionsModule,
    TicketsModule,
    AgendaModule,
    CheckInModule,
    SponsorsModule,
    VenueModule,
    AdminModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
