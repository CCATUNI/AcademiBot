import { ArgsType, Field, InputType, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@ArgsType()
export class FindCourseArgs {
  @IsString()
  @Field()
  public universityId: string;

  @IsString()
  @Field()
  public id: string;
}

@ArgsType()
export class FindCoursesArgs extends PartialType(FindCourseArgs) {}

@InputType()
export class CreateCourseDto {
  @IsNotEmpty()
  @Field()
  @IsString()
  public id: string;

  @IsNotEmpty()
  @Field()
  @IsString()
  public universityId: string;

  @IsNotEmpty()
  @Field()
  @IsString()
  public title: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  public details?: string;
}

@InputType()
export class UpdateCourseDto extends PartialType(CreateCourseDto) {
}