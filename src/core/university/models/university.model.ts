import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { UniversityDivision } from './university-division.model';
import { Course } from './course.model';
import { StudyProgram } from './study-program.model';
import { StudyPeriod } from './study-period.model';
import { StudyPlan } from './study-plan.model';
import { StudyMaterial } from '../../study-material/models/study-material.model';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { HasManyGetAssociationsMixin } from 'sequelize';

@ObjectType()
@Table({
  tableName: 'university',
  timestamps: false,
  underscored: true
})
export class University extends Model<University> {
  @Field(type => ID)
  @Column({
    primaryKey: true,
    type: DataType.STRING({ length: 8 }),
    allowNull: false
  })
  public id: string;

  @Field()
  @Column({
    type: DataType.STRING({ length: 72 }),
    allowNull: false
  })
  public name: string;

  @Field({ nullable: true })
  @Column(DataType.TEXT)
  public description?: string;

  public getUniversityDivisions: HasManyGetAssociationsMixin<UniversityDivision>;

  public getCourses: HasManyGetAssociationsMixin<Course>;

  public getStudyPrograms: HasManyGetAssociationsMixin<StudyProgram>;

  public getStudyPeriods: HasManyGetAssociationsMixin<StudyPeriod>;

  public getStudyPlans: HasManyGetAssociationsMixin<StudyPlan>;

  public getStudyMaterials: HasManyGetAssociationsMixin<StudyMaterial>;


  @HasMany(() => UniversityDivision)
  public universityDivisions: UniversityDivision[];

  @Field(type => [UniversityDivision])
  public divisions: UniversityDivision[];

  @HasMany(() => Course)
  @Field(type => [Course])
  public courses: Course[];

  @HasMany(() => StudyProgram)
  @Field(type => [StudyProgram])
  public studyPrograms: StudyProgram[];

  @HasMany(() => StudyPeriod)
  @Field(type => [StudyPeriod])
  public studyPeriods: StudyPeriod[];

  @HasMany(() => StudyPlan)
  @Field(() => [StudyPlan])
  public studyPlans: StudyPlan[];

  @HasMany(() => StudyMaterial)
  @Field(() => [StudyMaterial])
  public studyMaterials: StudyMaterial[];


}