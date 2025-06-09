import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '@modules/users/entities/user.entity';
import { Ticket } from '../ticket/entities/ticket.entity';
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
