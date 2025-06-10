import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketResolver } from './ticket.resolver';
import { PrismaService } from '@modules/prisma/prisma.service';

@Module({
  providers: [TicketResolver, TicketService, PrismaService],
})
export class TicketModule {}
