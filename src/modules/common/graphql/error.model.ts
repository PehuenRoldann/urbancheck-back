import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class ErrorResponse {
  @Field()
  message: string;

  @Field({ nullable: true })
  code?: string;

  @Field({ nullable: true })
  path?: string;

  constructor (pMessage: string, pCode: string, pPath: string) {
    this.code = pCode;
    this.message = pMessage;
    this.path = pPath;
  }
}
