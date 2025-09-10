import { ObjectType, Field, ID, InputType } from '@nestjs/graphql';
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


@InputType()
export class GetSubscriptionsInput {

  @Field(() => ID, { nullable: true })
  ticketId?: string;

  @Field(() => Boolean, { nullable: true })
  active?: boolean;

}


@InputType()
export class CreateSubscriptionInput {

  @Field(() => ID)
  ticketId: string;

}

@InputType()
export class DeleteSubscriptionInput {

  @Field(() => ID, { nullable: true })
  subscriptionId?: number;

  @Field(() => ID, { nullable: true })
  ticketId?: string;

}