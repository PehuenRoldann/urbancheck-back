import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Dependency {
  @Field(() => ID)
  id: string;

  @Field()
  description: string;

  @Field()
  name: string; // Based on the MunicipalDependencies enum
}
