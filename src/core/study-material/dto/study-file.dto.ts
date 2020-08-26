import { ArgsType, Field, InputType, Int, OmitType, PartialType } from '@nestjs/graphql';
import { ParanoidArgs } from '../../../common/class/paranoid.args';
import { IsNumber, IsUUID, Min } from 'class-validator';

@ArgsType()
export class FindStudyFileArgs extends ParanoidArgs {
  @Field()
  @IsUUID()
  public studyMaterialId: string;

  @Field(type => Int)
  @IsNumber()
  public fileId: number;

  @Min(1)
  @Field(type => Int)
  @IsNumber()
  public page: number;
}

@ArgsType()
export class FindStudyFilesArgs extends PartialType(
  OmitType(FindStudyFileArgs, ['page'] as const)
) {}

@InputType()
export class CreateStudyFileDto extends OmitType(
  FindStudyFileArgs, ['paranoid'] as const, InputType
) {}

@InputType()
export class UpdateStudyFileDto extends PartialType(CreateStudyFileDto) {}