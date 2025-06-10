import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { PriorityHistory } from '@modules/entities/priority_history.entity';
import { StatusHistory } from '@modules/entities/status_history.entity';
import { Subscription } from '@modules/entities/subscription.entity';
import { Issue } from '@modules/entities/issue.entity';

@ObjectType()
export class Ticket {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Float, { nullable: true })
  latitude?: number;

  @Field(() => Float, { nullable: true })
  longitude?: number;

  @Field()
  timestamp: Date;

  @Field({ nullable: true })
  image_url?: string;

  @Field(() => Issue, { nullable: true })
  issue?: Issue;

  @Field(() => Date, { nullable: true })
  its?: Date;

  @Field(() => Date, { nullable: true })
  uts?: Date;

  @Field(() => Date, { nullable: true })
  dts?: Date;

  @Field(() => [PriorityHistory])
  priority_history: PriorityHistory[];

  @Field(() => [StatusHistory])
  status_history: StatusHistory[];

  @Field(() => [Subscription])
  subscription: Subscription[];
}
