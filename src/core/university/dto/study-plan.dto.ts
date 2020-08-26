import { ArgsType, Field, InputType, Int, OmitType, PartialType, PickType } from '@nestjs/graphql';
import { ParanoidArgs } from '../../../common/class/paranoid.args';
import { IsNumber, IsOptional, Length, Min } from 'class-validator';

@ArgsType()
export class FindStudyPlanArgs extends ParanoidArgs {
  @Length(1, 12)
  @Field()
  public courseId: string;

  @Length(1, 8)
  @Field()
  public studyProgramId: string;

  @Length(1, 8)
  @Field()
  public universityId: string;

}

@ArgsType()
export class FindStudyPlansForUserArgs extends PickType(
  FindStudyPlanArgs, ['studyProgramId', 'universityId'] as const
) {
  @IsOptional()
  @IsNumber()
  @Field(type => Int, { nullable: true })
  public studyPeriodId: number;

  @IsOptional()
  @Field({ nullable: true })
  public includeElectives?: boolean;
}


@ArgsType()
export class FindStudyPlansArgs extends PartialType(FindStudyPlanArgs) {
  @IsOptional()
  @Length(1, 15)
  @Field({ nullable: true })
  public universityDivisionId?: string;

  @IsOptional()
  @Min(0)
  @IsNumber()
  @Field(type => Int, { nullable: true })
  public studyPeriodId?: number;
}

@InputType()
export class CreateStudyPlanDto extends OmitType(
  FindStudyPlanArgs, ['paranoid'] as const, InputType
  ) {
  @IsOptional()
  @Min(0)
  @IsNumber()
  @Field(type => Int, { nullable: true })
  public studyPeriodId?: number;

  @Length(1, 15)
  @Field()
  public universityDivisionId: string;
}

@InputType()
export class UpdateStudyPlanDto extends PartialType(CreateStudyPlanDto) {
}