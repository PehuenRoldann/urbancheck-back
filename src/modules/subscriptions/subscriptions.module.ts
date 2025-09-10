import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { EmailModule } from '@modules/email/email.module';
import { PrismaService } from '@modules/prisma/prisma.service';
import { CustomLogger } from '@modules/common/logger/logger.service';
import { SubscriptionsResolver } from './subscriptions.resolver';
import { UsersModule } from '@modules/users/users.module';

@Module({
  imports: [EmailModule, UsersModule],
  providers: [
    SubscriptionsService,
    PrismaService,
    CustomLogger,
    SubscriptionsResolver
  ],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
