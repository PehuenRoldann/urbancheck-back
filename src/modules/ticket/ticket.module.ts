import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketResolver } from './ticket.resolver';
import { PrismaService } from '@modules/prisma/prisma.service';
import { CustomLogger } from '@modules/common/logger/logger.service';
import { UsersService } from '@modules/users/users.service';

@Module({
  providers: [TicketResolver, TicketService, PrismaService, CustomLogger, UsersService],
  exports: [TicketService]
})
export class TicketModule {}
