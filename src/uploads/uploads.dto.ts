import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString, Length, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class UploadFileDto {
  @Field()
  @Length(1, 32)
  public activityTypeId: string;

  @Field()
  @Length(1, 12)
  public courseId: string;

  @Field()
  @Length(1, 8)
  public universityId: string;

  @Field()
  @Length(1, 72)
  public name: string;

  @Min(1)
  @Field(type => Int)
  @IsNumber()
  public page: number;
}

export class UploadFileBodyDto {
  @ValidateNested({ each: true })
  @Type(() => UploadFileDto)
  public data: UploadFileDto[];

  @IsString()
  @IsOptional()
  public name?: string;
}

export class AssignFileDto {
  @Field()
  @Length(1, 32)
  public activityTypeId: string;

  @Field()
  @Length(1, 12)
  public courseId: string;

  @Field()
  @Length(1, 8)
  public universityId: string;

  @Field()
  @Length(1, 72)
  public name: string;

  @Field(type => Int)
  @IsNumber()
  public fileId: number;

  @Min(1)
  @Field(type => Int)
  @IsNumber()
  public page: number;
}

