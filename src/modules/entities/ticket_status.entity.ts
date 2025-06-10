import { ObjectType, Field, ID } from '@nestjs/graphql';
import { StatusHistory } from './status_history.entity';

@ObjectType()
export class TicketStatus {
  @Field(() => ID)
  id: number;

  @Field()
  description: string;

  @Field(() => [StatusHistory])
  status_history: StatusHistory[];
}
