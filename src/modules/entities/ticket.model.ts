import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { User } from '@modules/entities/users.model';
import { TicketStatus } from '@modules/entities/ticket_status.model';
import { Priority } from '@modules/entities/priority.model';
import { Issue } from 'modules/entities/issue.model';

@ObjectType()
export class Ticket {
  @Field(() => ID)
  id: string;

  @Field()
  description: string;

  @Field(() => Float)
  latitude: number;

  @Field(() => Float)
  longitude: number;

  @Field()
  timestamp: Date;

  @Field(() => User)
  createdBy: User;

  @Field(() => User)
  modifiedBy: User;

  @Field()
  imageUrl: string;

  @Field(() => TicketStatus)
  status: TicketStatus;

  @Field(() => Priority)
  priority: Priority;

  @Field(() => Issue)
  issue: Issue;
}
