import { ArgsType, Field, InputType, IntersectionType, OmitType, PartialType } from '@nestjs/graphql';
import { ParanoidArgs } from '../../../common/class/paranoid.args';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import GraphQLJSON from 'graphql-type-json';

@ArgsType()
export class FindUserAccountArgs extends ParanoidArgs {
  @IsUUID()
  @Field()
  public userId: string;

  @IsString()
  @Field()
  public platformId: string;
}

@ArgsType()
export class FindUserAccountByPlatformArgs {
  @IsString()
  @Field()
  public platformId: string;

  @IsString()
  @Field()
  public identifierInPlatform: string;
}


@InputType()
export class CreateUserAccountDto {
  @IsOptional()
  @IsUUID()
  @Field({ nullable: true })
  public userId?: string;

  @IsString()
  @Field()
  public platformId: string;

  @IsString()
  @Field()
  public identifierInPlatform: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  public password?: string;

  @IsOptional()
  @Field(type => GraphQLJSON, { nullable: true })
  public publicInformation?: object;
}

@ArgsType()
export class FindUserAccountsArgs extends IntersectionType(
  ParanoidArgs,
  PartialType(OmitType(CreateUserAccountDto, ['password'])),
  InputType
) {}

@ArgsType()
export class FindUserAccountByPublicInfoArgs extends ParanoidArgs {
  @IsString()
  @Field()
  public name: string;
}