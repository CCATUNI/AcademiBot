import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Field, ObjectType } from '@nestjs/graphql';
import { StudyMaterial } from './study-material.model';
import { HasManyGetAssociationsMixin } from 'sequelize';

@ObjectType()
@Table({
  tableName: 'activity_type',
  underscored: true,
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  paranoid: true
})
export class ActivityType extends Model<ActivityType> {
  @Field()
  @Column({
    type: DataType.STRING({ length: 12 }),
    allowNull: false,
    primaryKey: true
  })
  public id: string;

  @Field()
  @Column({
    type: DataType.STRING({ length: 32 }),
    allowNull: false,
    unique: true
  })
  public name: string;

  @Field({ nullable: true })
  @Column(DataType.TEXT)
  public description?: string;

  @HasMany(() => StudyMaterial)
  @Field(type => [StudyMaterial])
  public studyMaterials: StudyMaterial[];

  public getStudyMaterials: HasManyGetAssociationsMixin<StudyMaterial>;

  public deletedAt?: Date;
}