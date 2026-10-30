import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { CheckInController } from './check-in.controller.js';
import { CheckInService } from './check-in.service.js';

@Module({
  imports: [AuthModule],
  controllers: [CheckInController],
  providers: [CheckInService],
})
export class CheckInModule {}
