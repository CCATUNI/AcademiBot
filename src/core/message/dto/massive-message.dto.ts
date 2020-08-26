import { ArgsType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsNumber, IsUUID } from 'class-validator';

@ArgsType()
export class FindMassiveMessageArgs {
  @IsUUID()
  @Field()
  public messageRequestId: string;

  @IsNumber()
  @Field(type => Int)
  public messageId: number;
}

@ArgsType()
export class FindMassiveMessagesArgs extends PartialType(FindMassiveMessageArgs){}