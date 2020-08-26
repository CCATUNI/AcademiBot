import { ArgsType, Field, InputType, OmitType, PartialType } from '@nestjs/graphql';
import { ParanoidArgs } from '../../../common/class/paranoid.args';
import { IsNumber, IsOptional, Length } from 'class-validator';

@ArgsType()
export class FindFileAccountArgs extends ParanoidArgs {
  @IsNumber()
  @Field()
  public fileId: number;

  @Length(1, 31)
  @Field()
  public platformId: string;
}

@ArgsType()
export class FindFileAccountsArgs extends PartialType(FindFileAccountArgs) {
  @IsOptional()
  @Length(0, 32)
  @Field({ nullable: true })
  public fileType?: string;

  @IsOptional()
  @Length(0, 32)
  @Field({ nullable: true })
  public reUtilizationCode?: string;
}

@InputType()
export class CreateFileAccountDto extends OmitType(
  FindFileAccountArgs, ['paranoid'] as const, InputType
) {
  @IsOptional()
  @Length(0, 32)
  @Field({ nullable: true })
  public fileType?: string;

  @IsOptional()
  @Length(0, 32)
  @Field({ nullable: true })
  public reUtilizationCode?: string;
}

@InputType()
export class UpdateFileAccountDto extends OmitType(
  FindFileAccountsArgs, ['paranoid'] as const, InputType
) {}