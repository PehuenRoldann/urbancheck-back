import { CreateTicketInput } from './create-ticket.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateTicketInput extends PartialType(CreateTicketInput) {
  @Field(() => ID)
  id: string;
}
