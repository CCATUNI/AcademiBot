import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Platform } from '../../platform/models/platform.model';
import { StudyMaterial } from './study-material.model';
import { User } from '../../user/models/user.model';


@ObjectType()
@Table({
  tableName: 'study_material_request',
  underscored: true,
  updatedAt: false,
  createdAt: 'requestedAt'
})
export class StudyMaterialRequest extends Model<StudyMaterialRequest> {
  @Field(type => Int)
  @Column({
    type: DataType.INTEGER({ unsigned: true }),
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  })
  public id: number;

  @Field()
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  public userId: string;

  @Field()
  @ForeignKey(() => Platform)
  @Column({
    type: DataType.STRING({ length: 31 }),
    allowNull: false
  })
  public platformId: string;

  @Field()
  @ForeignKey(() => StudyMaterial)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  public studyMaterialId: string;

  @Field(type => Date)
  public requestedAt: Date;
}
