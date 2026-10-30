import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  CurrentUser,
  type AuthUser,
} from '../auth/decorators/current-user.decorator.js';
import { AgendaService } from './agenda.service.js';

@Controller('agenda')
@UseGuards(AuthGuard('jwt'))
export class AgendaController {
  constructor(private readonly agenda: AgendaService) {}

  @Get()
  list(@CurrentUser() user: AuthUser) {
    return this.agenda.list(user.id);
  }

  @Post(':sessionId')
  add(@CurrentUser() user: AuthUser, @Param('sessionId') sessionId: string) {
    return this.agenda.add(user.id, sessionId);
  }

  @Delete(':sessionId')
  remove(
    @CurrentUser() user: AuthUser,
    @Param('sessionId') sessionId: string,
  ) {
    return this.agenda.remove(user.id, sessionId);
  }
}
