import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Penalty } from './user_penalty.entity';

@ObjectType()
export class PenaltyType {

  @Field(() => ID)
  id: number;

  @Field()
  code: string;

  @Field()
  description: string;

  @Field(() => [Penalty])
  user_penalty: Penalty[];


}
