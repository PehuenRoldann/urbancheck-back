import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Issue } from './issue.entity';
import { User } from './user.entity';

@ObjectType()
export class Dependency {

  @Field(() => ID)
  id: number;

  @Field()
  name: string; // Based on the MunicipalDependencies enum

  @Field()
  is_operationg: boolean;

  @Field(() => [Issue])
  problematica: Issue[];

  @Field(() => [User])
  works_at: User[];

}
