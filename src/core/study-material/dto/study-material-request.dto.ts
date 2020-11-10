import { ArgsType, Field } from '@nestjs/graphql';
import { IsDate, IsOptional } from 'class-validator';

@ArgsType()
export class FindStudyMaterialRequestsArgs {
  @IsDate()
  @Field()
  public startDate: Date;

  @IsOptional()
  @IsDate()
  @Field({ nullable: true })
  public endDate: Date = new Date();
}

