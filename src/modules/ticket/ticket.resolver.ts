import { Resolver, Query, Mutation, Args, Int, Context, createUnionType, Info } from '@nestjs/graphql';
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
import { GraphQLResolveInfo } from 'graphql';
import * as graphqlFields from 'graphql-fields';

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
    @Info() info: GraphQLResolveInfo,
    @Args('filter', { nullable: true }) filter?: TicketFilterInput,
  ): Promise<Ticket[]> {

    const requestedFields = graphqlFields(info);
    this.logger.log(`TicketResolver - findTicktes - requested fields: ${JSON.stringify(requestedFields)}`);
    this.logger.log(`TicketResolver - findTicktes - filter: ${JSON.stringify(filter)}`);
    try {

      const hasAuthor = 'author' in requestedFields;
      const hasCurrentStatus = 'current_status' in requestedFields;
      const hasDependency = 'dependency' in requestedFields;

      return this.ticketService.findFiltered(
        filter,
        hasAuthor,
        hasCurrentStatus,
        hasDependency
      );
    }
    catch (error) {
      this.logger.error(`TicketResolver - findTickets - error: ${error.message}`, error);
      return [];
    }
    
  }

  @Query(() => [Ticket], { name: 'tickets' })
  findAll() {
    return this.ticketService.findAll();
  }

  @Query(() => Ticket, { name: 'ticket' })
  @UseGuards(KeycloakProfileGuard)
  async findOne(@Args('id', { type: () => String }) id: string) {

    try {
      return await this.ticketService.findOne(id);
    }
    catch (error) {

      this.logger.error(`TicketResolver - findOne - ${error.message}`, error);
      return new ErrorResponse (error.message, String(500), 'TicketResolver - findOne');
    }
  }


  @Mutation(() => Ticket)
  updateTicket(@Args('updateTicketInput') updateTicketInput: UpdateTicketInput) {
    return this.ticketService.update(updateTicketInput.id, updateTicketInput);
  }

  @Mutation(() => Ticket)
  removeTicket(@Args('id', { type: () => String }) id: string) {
    return this.ticketService.remove(id);
  }

  @Query(() => Number)
  @UseGuards(KeycloakProfileGuard)
  async countTickets(
    @Args('filter', { nullable: true }) filter?: TicketFilterInput,
  ) {

    this.logger.log(`TicketResolver - countTickets - filter: ${JSON.stringify(filter)}`);

    try {
        return this.ticketService.countFiltered(filter);
    } catch (error) {
      this.logger.error(error.message, error);
      throw error;
    }
  }
}
