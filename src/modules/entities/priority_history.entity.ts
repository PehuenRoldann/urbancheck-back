import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '@modules/entities/user.entity';
import { Priority } from '@modules/entities/priority.entity';
import { Ticket } from '@modules/entities/ticket.entity';

@ObjectType()
export class PriorityHistory {
  @Field(() => ID)
  id: number;

  @Field(() => ID, { nullable: true })
  author_id?: string;

  @Field(() => ID, { nullable: true })
  ticket_id?: string;

  @Field(() => Priority, { nullable: true })
  priority?: Priority;

  @Field(() => User, { nullable: true })
  user_account?: User;

  @Field(() => Ticket, { nullable: true })
  ticket?: Ticket;

  @Field(() => Date, { nullable: true })
  its?: Date;

} 
