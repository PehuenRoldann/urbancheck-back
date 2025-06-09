import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '@modules/users/entities/user.entity';
import { Ticket } from '@modules/ticket/entities/ticket.entity';
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

  @Field()
  its: Date;
}
