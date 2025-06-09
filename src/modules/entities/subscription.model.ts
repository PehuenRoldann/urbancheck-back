import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '@modules/entities/user.model';

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
