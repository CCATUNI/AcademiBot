import { ArgsType, Field, InputType } from '@nestjs/graphql';

@ArgsType()
export class FindPlatformArgs {
  @Field()
  public id: string;
}

@InputType()
export class CreatePlatformDto extends FindPlatformArgs {
  @Field({ nullable: true })
  public details?: string;
}