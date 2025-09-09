import { Resolver, Query, Args, createUnionType } from '@nestjs/graphql';
import { TicketStatus } from '@modules/entities/ticket_status.entity';
import { TicketStatusService } from '@modules/ticket-status/ticket-status.service';
import { StatusHistory } from '@modules/entities/status_history.entity';
import { UseGuards } from '@nestjs/common';
import { KeycloakProfileGuard } from '@modules/common/keycloakProfile/keycloak_profile.guard';
import { ErrorResponse } from '@modules/common/graphql/error.model';
import { CustomLogger } from '@modules/common/logger/logger.service';

export const TicketStatusResult = createUnionType({
  name: 'TicketStatusResult',
  types: () => [TicketStatus, ErrorResponse] as const,
  resolveType(value) {
    if ('id' in value) return TicketStatus;
    if ('code' in value) return ErrorResponse;
    return null;
  },
});


@Resolver(() => TicketStatus)
export class TicketStatusResolver {
  constructor(
    private readonly ticketStatusService: TicketStatusService,
    private readonly logger: CustomLogger,
  ) {}

  @Query(() => [TicketStatusResult])
  @UseGuards(KeycloakProfileGuard)
  async ticketStatus(): Promise<TicketStatus[] | ErrorResponse> {
    try {
      return await this.ticketStatusService.findAll();
    }
    catch(error) {
      this.logger.error(`TicketStatusResolver - ticketStatus - error: ${error.message}`, error);
      return new ErrorResponse(
        error.message,
        '500',
        'TicketStatusResolver -> ticketStatus -> TicketStatusService.findAll()'
      );
    }
  }

  @Query(() => [StatusHistory])
  async ticketStatusHistory(
    @Args('id', { type: () => String }) id: string,
  ): Promise<StatusHistory[]> {

    try {
      const res = await this.ticketStatusService.findTicketStatusHistory(id);
      return res;
    }
    catch (error) {
      this.logger.error(`TicketStatusResolver - ticketStatusHistory - error: ${error.message}`, error);
      throw error;
    }
  }
}