import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  dni: number;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  birthDate: Date;

  @Field()
  postalCode: number;

  @Field()
  street: string;

  @Field()
  streetNumber: number;
}
