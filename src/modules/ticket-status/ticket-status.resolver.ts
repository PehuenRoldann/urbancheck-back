import { Resolver, Query, Args } from '@nestjs/graphql';
import { TicketStatus } from '@modules/entities/ticket_status.entity';
import { TicketStatusService } from './ticket-status.service';
import { StatusHistory } from '@modules/entities/status_history.entity';

@Resolver(() => TicketStatus)
export class TicketStatusResolver {
  constructor(private readonly ticketStatusService: TicketStatusService) {}

  @Query(() => [TicketStatus])
  ticketStatuses(): Promise<TicketStatus[]> {
    return this.ticketStatusService.findAll();
  }

  @Query(() => [StatusHistory])
  async ticketStatusHistory(
    @Args('id', { type: () => String }) id: string,
  ): Promise<StatusHistory[]> {

        const res = await this.ticketStatusService.findTicketStatusHistory(id);
        return res;
  }
}