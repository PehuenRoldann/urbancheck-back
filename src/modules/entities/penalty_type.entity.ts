import { ObjectType, Field, ID } from '@nestjs/graphql';
import { UserPenalty } from './user_penalty.entity';

@ObjectType()
export class PenaltyType {

  @Field(() => ID)
  id: number;

  @Field()
  code: string;

  @Field()
  description: string;

  @Field(() => [UserPenalty])
  user_penalty: UserPenalty[];


}
