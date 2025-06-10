import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { PriorityHistory } from '@modules/entities/priority_history.entity';
import { StatusHistory } from '@modules/entities/status_history.entity';
import { Subscription } from '@modules/entities/subscription.entity';
import { Role } from '@modules/entities/role.entity';
import { UserPenalty } from '@modules/entities/user_penalty.entity';
import { WorksAt } from '@modules/entities/works_at.entity';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  auth_provider_id: string;

  @Field(() => BigInt)
  dni: bigint; // Si querés que sea compatible con GraphQL, podés usar `String` en lugar de `bigint`

  @Field()
  email: string;

  @Field({ nullable: true })
  email_alt?: string;

  @Field()
  first_name: string;

  @Field()
  last_name: string;

  @Field()
  birth_date: Date;

  @Field(() => Int, { nullable: true })
  postal_code?: number;

  @Field({ nullable: true })
  street?: string;

  @Field(() => Int, { nullable: true })
  street_number?: number;

  @Field({ nullable: true })
  is_resident?: boolean;

  @Field(() => Int)
  role_id: number;

  @Field(() => Date, { nullable: true })
  its?: Date;

  @Field(() => Date, { nullable: true })
  uts?: Date;

  @Field(() => Date, { nullable: true })
  dts?: Date;

  @Field(() => Role)
  role: Role;

  @Field(() => [PriorityHistory])
  priority_history: PriorityHistory[];

  @Field(() => [StatusHistory])
  status_history: StatusHistory[];

  @Field(() => [Subscription])
  subscription: Subscription[];

  @Field(() => [UserPenalty])
  user_penalty: UserPenalty[];

  @Field(() => [WorksAt])
  works_at: WorksAt[];
}
