import { ArgsType, Field, InputType, Int, OmitType, PartialType } from '@nestjs/graphql';
import { ParanoidArgs } from '../../../common/class/paranoid.args';
import { IsEmpty, IsNumber, IsOptional, IsString, Length, Min } from 'class-validator';

@ArgsType()
export class FindFileArgs extends ParanoidArgs {
  @IsOptional()
  @IsNumber()
  @Field(type => Int, { nullable: true })
  public id?: number;

  @IsOptional()
  @Length(0, 255)
  @Field({ nullable: true })
  public filesystemKey?: string;

  @IsOptional()
  @Length(64, 64)
  @IsString()
  @Field({ nullable: true })
  public contentSha256?: string;
}

@ArgsType()
export class FindFilesArgs extends ParanoidArgs {
  @IsOptional()
  @Length(0, 255)
  @Field({ nullable: true })
  public contentType?: string;

  @IsOptional()
  @Length(0, 10)
  @Field({ nullable: true })
  public extension?: string;

  @IsOptional()
  @Length(0, 255)
  @Field({ nullable: true })
  public filesystemKey?: string;

  @IsOptional()
  @Field({ nullable: true })
  public publicUrl?: string;
}

@InputType()
export class CreateFileDto {
  @Length(1, 255)
  @Field()
  public filesystemKey: string;

  @Length(64, 64)
  @IsString()
  @Field()
  public contentSha256: string;

  @IsOptional()
  @Length(0, 255)
  @Field({ nullable: true })
  public contentType?: string;

  @IsEmpty()
  public extension?: string;

  @Min(1)
  @Field(type => Int)
  public sizeInBytes: number;

  @IsOptional()
  @Length(0, 64)
  @Field({ nullable: true })
  public name?: string;
}

@InputType()
export class UpdateFileDto extends PartialType(
  OmitType(CreateFileDto, ['contentSha256'] as const)
) {}