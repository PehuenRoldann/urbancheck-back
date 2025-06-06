import { Field } from '@nestjs/graphql';

export class Ticket {
  @Field()
  id: string;
}
