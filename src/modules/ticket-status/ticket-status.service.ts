import { Injectable } from '@nestjs/common';
import { PrismaService } from '@modules/prisma/prisma.service';
import { TicketStatus } from '@modules/entities/ticket_status.entity';
import { StatusHistory } from '@modules/entities/status_history.entity';
import { TicketStatusLabels } from '@modules/utils/mappers';
import { CustomLogger } from '@modules/common/logger/logger.service';


@Injectable()
export class TicketStatusService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: CustomLogger
  ) {}

  async findAll(): Promise<TicketStatus[]> {
    const ticket_status_arr =  await this.prisma.ticket_status.findMany();

    

    const ticketStatus =  ticket_status_arr as unknown as TicketStatus[];

    ticketStatus.forEach(elem => {
      elem.description = TicketStatusLabels[elem.description]
    });

    return ticketStatus;
  }

  async findTicketStatusHistory(pTicketId: string): Promise<StatusHistory[]> {

    try {
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
    catch (error) {
      this.logger.error(`TicketStatusService - findTicketStatusHistory - error: ${error.message}`, error);
      throw error;
    }
  }


  async findTicketStatusById(id: number):Promise<TicketStatus> {


    const ticket_status_db = await this.prisma.ticket_status.findFirst({
      where: {id: id}
    });

    const statusToReturn = ticket_status_db as unknown as TicketStatus;

    statusToReturn.description = TicketStatusLabels[statusToReturn.description];

    return statusToReturn;
  }
}