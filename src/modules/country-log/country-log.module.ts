import { Module } from '@nestjs/common';
import { CountryLogService } from './country-log.service';
import { CountryLogController } from './country-log.controller';
import { PrismaModule } from '../../database/prisma.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [PrismaModule, NotificationModule],
  controllers: [CountryLogController],
  providers: [CountryLogService],
  exports: [CountryLogService],
})
export class CountryLogModule {}
