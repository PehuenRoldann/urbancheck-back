import { InputType, Field, ID, Int } from '@nestjs/graphql';

@InputType()
export class TicketFilterInput {
  @Field(() => ID, { nullable: true })
  user_id?: string;

  @Field(() => Int, { nullable: true })
  status_id?: number;

  @Field(() => Int, { nullable: true })
  priority_id?: number;

  @Field(() => Int, { nullable: true })
  dependency_id?: number;

  @Field(() => Int, { nullable: true })
  page?: number;

  @Field(() => Int, { nullable: true })
  limit?: number;
}
