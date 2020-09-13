import { ArgsType, Field, InputType, IntersectionType, PartialType } from '@nestjs/graphql';
import { IsUUID, Length } from 'class-validator';
import { ParanoidArgs } from '../../../common/class/paranoid.args';

@ArgsType()
export class FindStudyMaterialArgs extends ParanoidArgs {
  @IsUUID()
  @Field()
  public id: string;
}

@InputType()
export class CreateStudyMaterialDto {
  @Field()
  @Length(1, 32)
  public activityTypeId: string;

  @Field()
  @Length(1, 12)
  public courseId: string;

  @Field()
  @Length(1, 8)
  public universityId: string;

  @Field()
  @Length(1, 8)
  public name: string;
}

@ArgsType()
export class FindStudyMaterialsArgs extends IntersectionType(
  PartialType(CreateStudyMaterialDto), ParanoidArgs, ArgsType
) {}

@ArgsType()
export class FindStudyMaterialActivityTypesArgs {
  @Field()
  @Length(1, 8)
  public universityId: string;

  @Field()
  @Length(1, 12)
  public courseId: string;
}

@InputType()
export class UpdateStudyMaterialDto extends PartialType(CreateStudyMaterialDto) {}