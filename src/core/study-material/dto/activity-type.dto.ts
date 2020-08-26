import { ArgsType, Field, InputType, OmitType, PartialType } from '@nestjs/graphql';
import { IsOptional, IsString, Length } from 'class-validator';
import { ParanoidArgs } from '../../../common/class/paranoid.args';

@ArgsType()
export class FindActivityTypeArgs extends ParanoidArgs {
  @Length(1, 12)
  @Field()
  public id: string;

  @Length(1, 32)
  @Field()
  public name: string;
}


@InputType()
export class CreateActivityTypeDto extends OmitType(
  FindActivityTypeArgs, ['paranoid'] as const, InputType
){
  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  public description?: string;
}

@InputType()
export class UpdateActivityTypeDto extends PartialType(CreateActivityTypeDto) {}