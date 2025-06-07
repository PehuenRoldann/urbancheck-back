import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class PenaltyType {
  @Field(() => ID)
  id: string;

  @Field()
  code: string;

  @Field()
  description: string;
}
