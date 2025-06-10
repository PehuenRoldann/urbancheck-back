import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from './user.entity';

@ObjectType()
export class Role {
  @Field(() => ID)
  id: number;

  @Field()
  description: string;

  @Field(() => [User])
  user_account: User[];

  constructor (id: number, description: string) {
    this.id = id;
    this.description = description;
  }
}
