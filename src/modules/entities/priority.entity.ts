import { ObjectType, Field, ID } from '@nestjs/graphql';
import { PriorityHistory } from './priority_history.entity';

@ObjectType()
export class Priority {
  @Field(() => ID)
  id: number;

  @Field()
  description: string;

  @Field(() => [PriorityHistory])
  priority_history: PriorityHistory[];
}
