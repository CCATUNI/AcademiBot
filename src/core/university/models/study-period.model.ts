import { Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { University } from './university.model';
import { StudyPlan } from './study-plan.model';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { HasManyGetAssociationsMixin } from 'sequelize';

@ObjectType()
@Table({
  tableName: 'study_period',
  underscored: true,
  timestamps: false
})
export class StudyPeriod extends Model<StudyPeriod> {
  @Field(type => Int)
  @Column({
    primaryKey: true,
    allowNull: false,
    type: DataType.SMALLINT({ unsigned: true })
  })
  public id: number;

  @Field()
  @Column({
    allowNull: false,
    type: DataType.STRING({ length: 32 })
  })
  public name: string;

  @Field()
  @ForeignKey(() => University)
  @Column({
    primaryKey: true,
    type: DataType.STRING({ length: 8 }),
    allowNull: false
  })
  public universityId: string;

  @HasMany(() => StudyPlan)
  @Field(type => [StudyPlan])
  public studyPlans: StudyPlan[];

  public getStudyPlans: HasManyGetAssociationsMixin<StudyPlan>;

}