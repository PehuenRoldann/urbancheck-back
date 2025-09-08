import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketResolver } from './ticket.resolver';
import { PrismaService } from '@modules/prisma/prisma.service';
import { CustomLogger } from '@modules/common/logger/logger.service';
import { UsersService } from '@modules/users/users.service';
import { TicketStatusService } from '@modules/ticket-status/ticket-status.service';
import { DependencyService } from '@modules/dependency/dependency.service';
import { SubscriptionsModule } from '@modules/subscriptions/subscriptions.module';

@Module({
  imports: [SubscriptionsModule],
  providers: [
    TicketResolver,
    TicketService,
    PrismaService,
    CustomLogger,
    UsersService,
    TicketStatusService,
    DependencyService,
  ],
  exports: [TicketService]
})
export class TicketModule {}
