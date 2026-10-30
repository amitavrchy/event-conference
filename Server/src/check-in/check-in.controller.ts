import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { CheckInService } from './check-in.service.js';
import { CheckInDto } from './dto/check-in.dto.js';

@Controller('check-in')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class CheckInController {
  constructor(private readonly checkIn: CheckInService) {}

  @Post(':code')
  @Roles(Role.STAFF, Role.ADMIN)
  run(@Param('code') code: string, @Body() body: CheckInDto = {}) {
    return this.checkIn.checkIn(code, body.payload);
  }
}
