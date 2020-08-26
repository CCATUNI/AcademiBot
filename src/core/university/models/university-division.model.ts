import { Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { University } from './university.model';
import { StudyPlan } from './study-plan.model';
import { StudyProgram } from './study-program.model';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Table({
  tableName: 'university_division',
  underscored: true,
  timestamps: false
})
export class UniversityDivision extends Model<UniversityDivision> {
  @Field()
  @Column({
    type: DataType.STRING({ length: 15 }),
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
  @Column({
    type: DataType.STRING({ length: 72 }),
    allowNull: false
  })
  public title: string;

  @Field()
  @Column({
    type: DataType.STRING({ length: 32 }),
    allowNull: false
  })
  public typeId: string;

  @Field({ nullable: true })
  @Column(DataType.STRING({ length: 1024 }))
  public description?: string;

  @HasMany(() => StudyPlan)
  public studyPlans: StudyPlan[];

  @HasMany(() => StudyProgram)
  public studyPrograms: StudyProgram[];
}