import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '@modules/entities/users.model';
import { Ticket } from './ticket.model';
import { TicketStatus } from 'modules/entities/ticket_status.model';

@ObjectType()
export class StatusHistory {
  @Field(() => ID)
  id: string;

  @Field()
  date: Date;

  @Field(() => User)
  author: User;

  @Field(() => Ticket)
  ticket: Ticket;

  @Field(() => TicketStatus)
  status: TicketStatus;
}
