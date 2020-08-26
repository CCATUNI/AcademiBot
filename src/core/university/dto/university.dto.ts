import { ArgsType, Field, InputType, PartialType } from '@nestjs/graphql';
import { Length } from 'class-validator';

@ArgsType()
export class FindUniversityArgs {
  @Length(1, 8)
  @Field()
  public id: string;
}

@InputType()
export class CreateUniversityDto {
  @Field()
  public id: string;

  @Field()
  public name: string;

  @Field({ nullable: true })
  public description?: string;
}

@InputType()
export class UpdateUniversityDto extends PartialType(CreateUniversityDto) {}