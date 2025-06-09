import { InputType, Field, ID, PartialType } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field(() => ID)
  authProviderId: string;

  @Field(() => Number)
  dni: number;

  @Field(() => String)
  email: string;

  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  @Field(() => Date)
  birthDate: Date;

  @Field(() => Number, { nullable: true })
  postalCode?: number | null;

  @Field(() => String, { nullable: true })
  street?: string | null;

  @Field(() => Number, { nullable: true })
  streetNumber?: number | null;

  @Field(() => ID)
  roleId: string;
}

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => ID)
  id: string;
}

@InputType()
export class LazySyncUserInput {
  @Field(() => ID)
  auth_provider_id: string;
}
