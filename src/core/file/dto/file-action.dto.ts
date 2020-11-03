import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString, Length } from 'class-validator';

@ArgsType()
export class FindFileActionArgs {
  @IsNumber()
  @Field(type => Int)
  public id: number;
}

@ArgsType()
export class FindFileActionsArgs {
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

  @Length(0, 1)
  @IsOptional()
  @Field({ nullable: true })
  public action: string;
}
