import { ObjectType, Field, ID } from '@nestjs/graphql';
import { PenaltyType } from '@modules/entities/penalty_type.model';
import { User } from '@modules/users/entities/user.entity';

@ObjectType()
export class Penalty {
  @Field(() => ID)
  id: string;

  @Field(() => PenaltyType)
  type: PenaltyType;

  @Field()
  date: Date;

  @Field(() => User)
  user: User;
}
