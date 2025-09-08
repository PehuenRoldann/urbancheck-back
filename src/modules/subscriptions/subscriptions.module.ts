import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { EmailModule } from '@modules/email/email.module';
import { PrismaService } from '@modules/prisma/prisma.service';
import { CustomLogger } from '@modules/common/logger/logger.service';

@Module({
  imports: [EmailModule],
  providers: [
    SubscriptionsService,
    PrismaService,
    CustomLogger
  ],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
