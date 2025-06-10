import { Module } from '@nestjs/common';
import { TicketStatusService } from '@modules/ticket-status/ticket-status.service'
import { TicketStatusResolver } from '@modules/ticket-status/ticket-status.resolver';
import { PrismaService } from '@modules/prisma/prisma.service';

@Module({
  providers: [TicketStatusService, TicketStatusResolver, PrismaService],
  exports: [TicketStatusService]
})
export class TicketStatusModule {}
