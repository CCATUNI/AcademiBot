import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { StudyProgram } from './study-program.model';
import { University } from './university.model';
import { StudyPeriod } from './study-period.model';
import { UniversityDivision } from './university-division.model';
import { Course } from './course.model';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { StudyMaterial } from '../../study-material/models/study-material.model';
import { HasManyGetAssociationsMixin } from 'sequelize';

@ObjectType()
@Table({
  tableName: 'study_plan',
  underscored: true,
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  paranoid: true
})
export class StudyPlan extends Model<StudyPlan> {
  @Field()
  @ForeignKey(() => Course)
  @Column({
    primaryKey: true,
    type: DataType.STRING({ length: 12 }),
    allowNull: false
  })
  public courseId: string;

  @Field()
  @ForeignKey(() => StudyProgram)
  @Column({
    type: DataType.STRING({ length: 8 }),
    allowNull: false,
    primaryKey: true,
  })
  public studyProgramId: string;

  @Field()
  @ForeignKey(() => University)
  @Column({
    type: DataType.STRING({ length: 8 }),
    allowNull: false,
    primaryKey: true
  })
  public universityId: string;

  @Field(type => Int, { nullable: true })
  @ForeignKey(() => StudyPeriod)
  @Column(DataType.SMALLINT({ unsigned: true }))
  public studyPeriodId: number;

  @Field()
  @ForeignKey(() => UniversityDivision)
  @Column({
    allowNull: false,
    type: DataType.STRING({ length: 15 })
  })
  public universityDivisionId: string;

  @BelongsTo(() => StudyProgram)
  public studyProgram: StudyProgram;

  @BelongsTo(() => StudyPeriod)
  public studyPeriod: StudyPeriod;

  @BelongsTo(() => Course)
  public course: Course;

  @Field(() => [StudyMaterial])
  @HasMany(() => StudyMaterial)
  public studyMaterials: StudyMaterial[];

  public getStudyMaterials: HasManyGetAssociationsMixin<StudyMaterial>;

  @Field({ nullable: true })
  public deletedAt?: Date;
}