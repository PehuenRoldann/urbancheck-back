import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '@modules/entities/users.model';
import { Ticket } from '@modules/entities/ticket.model';
import { Priority } from '@modules/entities/priority.model';

@ObjectType()
export class PriorityHistory {
  @Field(() => ID)
  id: string;

  @Field()
  date: Date;

  @Field(() => User)
  author: User;

  @Field(() => Ticket)
  ticket: Ticket;

  @Field(() => Priority)
  priority: Priority;
}
