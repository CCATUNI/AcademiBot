import { ArgsType, Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { IsNumber, IsOptional, Length } from 'class-validator';

@ArgsType()
export class FindStudyPeriodArgs {
  @IsNumber()
  @Field(type => Int)
  id: number;

  @Length(1, 8)
  @Field()
  public universityId: string;
}

@ArgsType()
export class FindStudyPeriodsArgs {
  @IsOptional()
  @Length(0, 8)
  @Field({ nullable: true })
  public universityId?: string;
}

@InputType()
export class CreateStudyPeriodDto {
  @IsNumber()
  @Field(type => Int)
  public id: number;

  @Length(1, 8)
  @Field()
  public universityId: string;

  @Length(1, 32)
  @Field()
  public name: string;
}

@InputType()
export class UpdateStudyPeriodDto extends PartialType(CreateStudyPeriodDto) {
}