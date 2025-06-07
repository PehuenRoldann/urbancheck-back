import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '@modules/entities/users.model';

@ObjectType()
export class Subscription {
  @Field(() => ID)
  id: string;

  @Field(() => User)
  user: User;
}
