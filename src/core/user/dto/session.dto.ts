import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsDate, IsNumber, IsOptional, IsUUID } from 'class-validator';

@ArgsType()
export class FindSessionArgs {
  @IsNumber()
  @Field()
  public id: string;
}

@ArgsType()
export class FindSessionsArgs {
  @IsOptional()
  @Field({ nullable: true })
  @IsUUID()
  public accountId?: string;

  @IsOptional()
  @Field({ nullable: true })
  @IsBoolean()
  public expired?: boolean = null;
}

@InputType()
export class UpdateSessionDto {
  @Field(type => Date)
  @IsDate()
  public expiresAt: Date;
}