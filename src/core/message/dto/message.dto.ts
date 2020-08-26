import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsBoolean, IsNumber, IsOptional, IsUUID } from 'class-validator';

@ArgsType()
export class FindMessageArgs {
  @IsNumber()
  @Field(type => Int)
  public id: number;
}

@ArgsType()
export class FindMessagesArgs {
  @IsUUID()
  @Field()
  public accountId: string;

  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  public sentByUser?: boolean;
}

