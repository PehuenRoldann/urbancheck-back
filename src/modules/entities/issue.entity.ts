import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Ticket } from './ticket.entity';
import { Dependency } from './dependency.entity';

@ObjectType()
export class Issue {
  @Field(() => ID)
  id: number;

  @Field()
  description: string;

  @Field()
  code: string;

  @Field()
  enabled: boolean;

  @Field(() => ID, {nullable: true})
  dependency_id?: number;

  @Field(() => [Dependency])
  dependency: Dependency[];

  @Field(() => [Ticket])
  ticket: Ticket[];
}
