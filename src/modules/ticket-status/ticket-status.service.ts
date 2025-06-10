import { Injectable, Query, UseGuards } from '@nestjs/common';
import { PrismaService } from '@modules/prisma/prisma.service';
import { TicketStatus } from '@modules/entities/ticket_status.entity';
import { StatusHistory } from '@modules/entities/status_history.entity';


@Injectable()
export class TicketStatusService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<TicketStatus[]> {
    const ticket_status_arr =  await this.prisma.ticket_status.findMany();
    return ticket_status_arr as unknown as TicketStatus[];
  }

  async findTicketStatusHistory(pTicketId: string): Promise<StatusHistory[]> {

    const status_history = await this.prisma.status_history.findMany({
        where: {ticket_id: pTicketId},
        include: {
            ticket_status: true,
            user_account: true,
        },
        orderBy: {
            its: 'asc'
        }
    });

    return status_history as unknown as StatusHistory[];
  }
}