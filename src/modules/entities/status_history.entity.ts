import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '@modules/entities/user.entity';
import { Ticket } from './ticket.entity';
import { TicketStatus } from '@modules/entities/ticket_status.entity';

@ObjectType()
export class StatusHistory {
  @Field(() => ID)
  id: number;

  @Field()
  its: Date;

  @Field(() => ID)
  author_id: string;

  @Field(() => ID)
  ticket_id: string;

  @Field(() => ID)
  status_id: number;

  @Field(() => User)
  user_account: User;

  @Field(() => Ticket)
  ticket: Ticket;

  @Field(() => TicketStatus)
  status: TicketStatus;
}
