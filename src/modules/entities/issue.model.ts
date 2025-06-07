import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Issue {
  @Field(() => ID)
  id: string;

  @Field()
  description: string;

  @Field()
  code: string;

  @Field()
  enabled: boolean;
}
