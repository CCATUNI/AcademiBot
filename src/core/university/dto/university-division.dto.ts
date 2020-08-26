import { ArgsType, Field, InputType, PartialType } from '@nestjs/graphql';
import { IsOptional, IsString, Length } from 'class-validator';
import { ParanoidArgs } from '../../../common/class/paranoid.args';


@ArgsType()
export class FindUniversityDivisionArgs extends ParanoidArgs {
  @Length(1, 15)
  @Field()
  public id: string;

  @Field()
  @Length(1, 8)
  public universityId: string;
}

@ArgsType()
export class FindUniversityDivisionsArgs extends PartialType(FindUniversityDivisionArgs) {}

@InputType()
export class CreateUniversityDivisionDto {

  @Length(1, 15)
  @Field()
  public id: string;

  @Length(1, 8)
  @Field()
  public universityId: string;

  @Length(1, 72)
  @Field()
  public title: string;

  @Length(1, 32)
  @Field()
  public typeId: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  public description?: string;


}

@InputType()
export class UpdateUniversityDivisionDto extends PartialType(CreateUniversityDivisionDto) {
}