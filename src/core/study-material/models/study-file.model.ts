import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { File } from '../../file/models/file.model';
import { StudyMaterial } from './study-material.model';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BelongsToGetAssociationMixin } from 'sequelize';

@ObjectType()
@Table({
  tableName: 'study_file',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  paranoid: true,
  underscored: true
})
export class StudyFile extends Model<StudyFile> {
  @Field()
  @ForeignKey(() => StudyMaterial)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4
  })
  public studyMaterialId: string;

  @Field(type => Int)
  @ForeignKey(() => File)
  @Column({
    type: DataType.INTEGER({ unsigned: true }),
    primaryKey: true,
    allowNull: false
  })
  public fileId: number;

  @Field(type => Int)
  @Column({
    type: DataType.SMALLINT({ unsigned: true }),
    allowNull: false,
    primaryKey: true
  })
  public page: number;

  @BelongsTo(() => StudyMaterial)
  public studyMaterial: StudyMaterial;

  @Field(type => File)
  @BelongsTo(() => File)
  public file: File;

  public getFile: BelongsToGetAssociationMixin<File>;

  public deletedAt?: Date;
}