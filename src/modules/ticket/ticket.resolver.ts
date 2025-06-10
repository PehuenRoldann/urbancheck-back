import { Resolver, Query, Mutation, Args, Int, Context, createUnionType } from '@nestjs/graphql';
import { TicketService } from '@modules/ticket/ticket.service';
import { Ticket } from '@modules/entities/ticket.entity';
import { CreateTicketInput } from '@modules/ticket/dto/create-ticket.input';
import { UpdateTicketInput } from '@modules/ticket/dto/update-ticket.input';
import { UseGuards } from '@nestjs/common';
import { KeycloakProfileGuard } from '@modules/common/keycloakProfile/keycloak_profile.guard';
import { UsersService } from '@modules/users/users.service';
import { CustomLogger } from '@modules/common/logger/logger.service';
import { ErrorResponse } from '@modules/common/graphql/error.model';
import { TicketFilterInput } from './dto/filter-ticket.input';
import { User } from '@modules/entities/user.entity';

export const TicketResult = createUnionType({
  name: 'TicketResult',
  types: () => [Ticket, ErrorResponse] as const,
  resolveType(value) {
    if ('latitude' in value) return Ticket;
    if ('code' in value) return ErrorResponse;
    return null;
  },
});


@Resolver(() => Ticket)
export class TicketResolver {
  constructor(
    private readonly ticketService: TicketService,
    private readonly userService: UsersService,
    private readonly logger: CustomLogger,
  ) {}

  @Mutation(() => TicketResult)
  @UseGuards(KeycloakProfileGuard)
  async createTicket(
    @Args('input') input: CreateTicketInput,
    @Context('req') req: any,
  ): Promise<typeof TicketResult> {
    try {
      const userProfile = req.keycloakProfile;
      const user = await this.userService.findByAuthId(userProfile.sub);
      const ticket = await this.ticketService.create(input, user);
      this.logger.log(`TicketResolver - ticket creado correctamente - id: ${ticket.id}`);
      return ticket;
    }
    catch (err) {
      this.logger.error(`TicketResolver - ceateTicket - params: ${JSON.stringify(input)}`, (err as Error).stack);
      return new ErrorResponse(
        `TicketResolver - ceateTicket - params: ${JSON.stringify(input)}`,
        '500',
        JSON.stringify((err as Error).stack)
      )
    }
  }

  @Query(() => [Ticket])
  @UseGuards(KeycloakProfileGuard)
  async findTickets(
    @Args('filter', { nullable: true }) filter?: TicketFilterInput
  ): Promise<Ticket[]> {
    return this.ticketService.findFiltered(filter);
  }

  @Query(() => [Ticket], { name: 'tickets' })
  findAll() {
    return this.ticketService.findAll();
  }

  @Query(() => Ticket, { name: 'ticket' })
  @UseGuards(KeycloakProfileGuard)
  async findOne(@Args('id', { type: () => String }) id: string) {
    return await this.ticketService.findOne(id);
  }


  @Mutation(() => Ticket)
  updateTicket(@Args('updateTicketInput') updateTicketInput: UpdateTicketInput) {
    return this.ticketService.update(updateTicketInput.id, updateTicketInput);
  }

  @Mutation(() => Ticket)
  removeTicket(@Args('id', { type: () => String }) id: string) {
    return this.ticketService.remove(id);
  }
}
