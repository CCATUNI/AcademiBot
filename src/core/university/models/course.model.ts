import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { University } from './university.model';
import { StudyMaterial } from '../../study-material/models/study-material.model';
import { HasManyGetAssociationsMixin } from 'sequelize';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Table({
  tableName: 'course',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  paranoid: true,
  underscored: true
})
export class Course extends Model<Course> {
  @Field()
  @Column({
    type: DataType.STRING({ length: 12 }),
    primaryKey: true,
    allowNull: false
  })
  public id: string;

  @Field()
  @ForeignKey(() => University)
  @Column({
    type: DataType.STRING({ length: 8 }),
    primaryKey: true,
    allowNull: false,
  })
  public universityId: string;

  @Field()
  @Column({
    type: DataType.STRING({ length: 72 }),
    allowNull: false
  })
  public title: string;

  @Field({ nullable: true })
  @Column(DataType.TEXT)
  public details?: string;

  public getStudyMaterials!: HasManyGetAssociationsMixin<StudyMaterial>;

  @Field({ nullable: true })
  public deletedAt?: Date;
}