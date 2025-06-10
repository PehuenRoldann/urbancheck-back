import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '@modules/entities/user.entity';
import { Ticket } from '@modules/entities/ticket.entity';

@ObjectType()
export class Subscription {
  @Field(() => ID)
  id: number;

  @Field(() => User, { nullable: true })
  user_account?: User;

  @Field(() => Ticket, { nullable: true })
  ticket?: Ticket;

  @Field(() => Date, { nullable: true })
  its?: Date;

  @Field(() => Date, { nullable: true })
  dts?: Date;
} 
