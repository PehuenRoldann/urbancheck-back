import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { TicketService } from '@modules/ticket/ticket.service';
import { Ticket } from '@modules/entities/ticket.entity';
import { CreateTicketInput } from '@modules/ticket/dto/create-ticket.input';
import { UpdateTicketInput } from '@modules/ticket/dto/update-ticket.input';
import { UseGuards } from '@nestjs/common';
import { KeycloakProfileGuard } from '@modules/common/keycloakProfile/keycloak_profile.guard';
import { UsersService } from '@modules/users/users.service';

@Resolver(() => Ticket)
export class TicketResolver {
  constructor(
    private readonly ticketService: TicketService,
    private readonly userService: UsersService
  ) {}

  @Mutation(() => Ticket)
  @UseGuards(KeycloakProfileGuard)
  createTicket(
    @Args('createTicketInput') createTicketInput: CreateTicketInput,
    @Context('req') req: any,
  ) {
    try {
      const userProfile = req.keycloak_profile;
      const user = await this.userService.findByAuthId(userProfile.sub);
      return this.ticketService.create(createTicketInput, user);
    }
  }

  @Query(() => [Ticket], { name: 'tickets' })
  findAll() {
    return this.ticketService.findAll();
  }

  @Query(() => Ticket, { name: 'ticket' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.ticketService.findOne(id);
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
