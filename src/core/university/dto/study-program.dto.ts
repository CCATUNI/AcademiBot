import { ArgsType, Field, InputType, PartialType } from '@nestjs/graphql';
import { Length } from 'class-validator';
import { ParanoidArgs } from '../../../common/class/paranoid.args';


@ArgsType()
export class FindStudyProgramArgs extends ParanoidArgs {
  @Length(1, 8)
  @Field()
  public id: string;

  @Length(1, 8)
  @Field()
  public universityId: string;
}

@ArgsType()
export class FindStudyProgramsArgs extends PartialType(FindStudyProgramArgs) {}

@InputType()
export class CreateStudyProgramDto {
  @Length(1, 8)
  @Field()
  public id: string;

  @Length(1, 8)
  @Field()
  public universityId: string;

  @Length(1, 15)
  @Field()
  public universityDivisionId: string;

  @Length(1, 32)
  @Field()
  public title: string;
}

@InputType()
export class UpdateStudyProgramDto extends PartialType(CreateStudyProgramDto) {
}