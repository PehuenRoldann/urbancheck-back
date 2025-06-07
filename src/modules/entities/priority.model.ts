import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Priority {
  @Field(() => ID)
  id: string;

  @Field()
  description: string;
}
