import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  authProviderId: string;

  @Field()
  email: string;

  @Field(() => Int)
  dni: number;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field(() => Date)
  birthDate: Date;

  @Field(() => Int, { nullable: true })
  postalCode?: number | null;

  @Field(() => String, { nullable: true })
  street?: string | null;

  @Field(() => Int, { nullable: true })
  streetNumber?: number | null;

  @Field(() => ID)
  roleId: number;

  @Field(() => Date)
  its: Date;

  @Field(() => Date, { nullable: true })
  uts?: Date | null;

  @Field(() => Date, { nullable: true })
  dts?: Date | null;
}
