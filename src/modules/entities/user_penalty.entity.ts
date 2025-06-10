import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { PenaltyType } from '@modules/entities/penalty_type.entity';
import { User } from '@modules/entities/user.entity';

@ObjectType()
export class UserPenalty {
  @Field(() => Int)
  id: number;

  @Field(() => Int, { nullable: true })
  penalty_type_id?: number;

  @Field(() => Date)
  date: Date;

  @Field(() => ID, { nullable: true })
  user_id?: string;

  @Field(() => PenaltyType, { nullable: true })
  penalty_type?: PenaltyType;

  @Field(() => User, { nullable: true })
  user_account?: User;
}