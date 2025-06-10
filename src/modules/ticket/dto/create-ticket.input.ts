import { InputType, Int, Field, Float } from '@nestjs/graphql';

@InputType()
export class CreateTicketInput {
  @Field()
  description: string;

  @Field(() => Float)
  latitude: number;

  @Field(() => Float)
  longitude: number;
  
  @Field({nullable: true})
  imageUrl?: string;

  @Field(() => Int, {nullable: true})
  statusId?: number;

  @Field(() => Int, {nullable: true})
  priorityId?: number;

  @Field(() => Int, {nullable: true})
  issueId?: number;
}