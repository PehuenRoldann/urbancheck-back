import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class TicketStatus {
  @Field(() => ID)
  id: string;

  @Field()
  description: string;

  @Field()
  its: Date;
}
