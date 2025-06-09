import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '@modules/users/entities/user.entity';

@ObjectType()
export class Subscription {
  @Field(() => ID)
  id: string;

  @Field(() => User)
  user: User;

  @Field()
  its: Date;

  @Field({ nullable: true })
  dts: Date;
}
