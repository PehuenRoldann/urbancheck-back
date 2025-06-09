import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Role {
  @Field(() => ID)
  id: number;

  @Field()
  description: string;

  constructor (id: number, description: string) {
    this.id = id;
    this.description = description;
  }
}
