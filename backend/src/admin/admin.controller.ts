import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { AdminService } from './admin.service.js';
import { CreateSessionDto } from './dto/create-session.dto.js';
import { UpdateSessionDto } from './dto/update-session.dto.js';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Get('sessions')
  listSessions() {
    return this.admin.listSessions();
  }

  @Post('sessions')
  createSession(@Body() dto: CreateSessionDto) {
    return this.admin.createSession(dto);
  }

  @Patch('sessions/:id')
  updateSession(@Param('id') id: string, @Body() dto: UpdateSessionDto) {
    return this.admin.updateSession(id, dto);
  }

  @Delete('sessions/:id')
  deleteSession(@Param('id') id: string) {
    return this.admin.deleteSession(id);
  }

  @Get('attendees')
  attendees() {
    return this.admin.attendees();
  }

  @Get('stats')
  stats() {
    return this.admin.stats();
  }
}
