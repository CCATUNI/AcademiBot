import { ArgsType, Field, InputType, OmitType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsUUID } from 'class-validator';
import { ParanoidArgs } from '../../../common/class/paranoid.args';

@ArgsType()
export class FindUserArgs extends ParanoidArgs {
  @Field()
  @IsUUID()
  public id: string;
}

@ArgsType()
export class FindUsersArgs extends ParanoidArgs {
  @IsOptional()
  @Field({ nullable: true })
  @IsBoolean()
  public acceptsMassiveMessage?: boolean;

  @IsOptional()
  @Field({ nullable: true })
  @IsBoolean()
  public lookingForElectives?: boolean;

  @IsOptional()
  @Field({ nullable: true })
  public universityId?: string;

  @IsOptional()
  @Field({ nullable: true })
  public studyProgramId?: string;

  @IsOptional()
  @Field({ nullable: true })
  public courseId?: string;

  @IsOptional()
  @Field({ nullable: true })
  public studyPeriodId?: number;

  @IsOptional()
  @Field({ nullable: true })
  public activityTypeId?: string;
}

@ArgsType()
export class DeleteUserArgs {
  @Field()
  @IsUUID()
  public id: string;
}

@ArgsType()
export class RestoreUserArgs {
  @Field()
  @IsUUID()
  public id: string;
}

@InputType()
export class UpdateUserDto extends OmitType(
  FindUsersArgs, ['paranoid'] as const, InputType
) {}


