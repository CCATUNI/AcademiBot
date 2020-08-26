import { Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { University } from './university.model';
import { StudyPlan } from './study-plan.model';
import { UniversityDivision } from './university-division.model';
import { Field, ObjectType } from '@nestjs/graphql';
import { HasManyGetAssociationsMixin } from 'sequelize';

@ObjectType()
@Table({
  tableName: 'study_program',
  underscored: true,
  timestamps: true,
  paranoid: true,
  createdAt: false,
  updatedAt: false
})
export class StudyProgram extends Model<StudyProgram> {
  @Field()
  @Column({
    type: DataType.STRING({ length: 8 }),
    primaryKey: true,
    allowNull: false
  })
  public id: string;

  @Field()
  @ForeignKey(() => University)
  @Column({
    type: DataType.STRING({ length: 8 }),
    allowNull: false,
    primaryKey: true
  })
  public universityId: string;

  @Field()
  @ForeignKey(() => UniversityDivision)
  @Column({
    type: DataType.STRING({ length: 15 }),
    allowNull: false
  })
  public universityDivisionId: string;

  @Field()
  @Column({
    type: DataType.STRING({ length: 32 }),
    allowNull: false
  })
  public title: string;

  @Field(type => [StudyPlan])
  @HasMany(() => StudyPlan)
  public studyPlans: StudyPlan[];

  public getStudyPlans: HasManyGetAssociationsMixin<StudyPlan>;

  @Field({ nullable: true })
  public deletedAt?: Date;
}