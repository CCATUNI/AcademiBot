import { ArgsType, Field, InputType, Int, PartialType, PickType } from '@nestjs/graphql';
import { IsBoolean, IsDate, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

@ArgsType()
export class FindMassiveMessageRequestArgs {
  @IsUUID()
  @Field()
  public id: string;
}
@InputType()
export class CreateMassiveMessageRequestDto {
  @IsString()
  @Field()
  public justification: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  public textContent?: string;

  @IsOptional()
  @IsNumber({}, { each: true })
  @Field(type => [Int], { nullable: true })
  public attachments?: number[];

  @Min(0)
  @IsOptional()
  @IsNumber()
  @Field(type => Int, { nullable: true })
  public groupsOf?: number;

  @IsBoolean()
  @Field()
  public exceptional: boolean;

  @IsDate()
  @Field(type => Date)
  public targetDate: Date;
}

@InputType()
export class UpdateMassiveMessageRequestDto {
  @IsBoolean()
  @Field()
  public approved: boolean;
}

@ArgsType()
export class FindMassiveMessageRequestsArgs extends PartialType(
  PickType(
    CreateMassiveMessageRequestDto,
    ['exceptional'] as const,
    ArgsType
  )
) {
  @IsBoolean()
  @Field()
  public approved: boolean;
}

