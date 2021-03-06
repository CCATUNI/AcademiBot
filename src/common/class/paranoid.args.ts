import { IsBoolean } from 'class-validator';
import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class ParanoidArgs {
  @IsBoolean()
  @Field({ nullable: true, defaultValue: true })
  public paranoid?: boolean = true;
}
