import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './database/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { TaskModule } from './modules/task/task.module';
import { ExpenseModule } from './modules/expense/expense.module';
import { MeetingModule } from './modules/meeting/meeting.module';
import { CountryLogModule } from './modules/country-log/country-log.module';
import { NotificationModule } from './modules/notification/notification.module';
import { ImageModule } from './modules/image/image.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    TaskModule,
    ExpenseModule,
    MeetingModule,
    CountryLogModule,
    NotificationModule,
    ImageModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
