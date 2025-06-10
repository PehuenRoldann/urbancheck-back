import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Dependency } from '@modules/entities/dependency.entity';
import { User } from '@modules/entities/user.entity';

@ObjectType()
export class WorksAt {
  @Field(() => Int)
  id: number;

  @Field(() => ID)
  user_id: string;

  @Field(() => Int)
  dependency_id: number;

  @Field(() => Date, { nullable: true })
  started?: Date;

  @Field(() => Date, { nullable: true })
  ended?: Date;

  @Field(() => Dependency)
  dependency: Dependency;

  @Field(() => User)
  user_account: User;
}
