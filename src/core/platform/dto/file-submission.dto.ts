import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString } from 'class-validator';

@ArgsType()
export class FindFileSubmissionArgs {
  @IsNumber()
  @Field(type => Int)
  public id: number;
}

@ArgsType()
export class FindFileSubmissionsArgs {
  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  public userId?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  public platformId?: string;

  @IsOptional()
  @Field(type => Int, { nullable: true })
  public fileId?: number;
}