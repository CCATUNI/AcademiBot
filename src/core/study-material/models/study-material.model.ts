import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { ActivityType } from './activity-type.model';
import { Course } from '../../university/models/course.model';
import { University } from '../../university/models/university.model';
import { Field, ObjectType } from '@nestjs/graphql';
import { StudyFile } from './study-file.model';
import { HasManyCreateAssociationMixin, HasManyGetAssociationsMixin } from 'sequelize';
import { StudyPlan } from '../../university/models/study-plan.model';

@ObjectType()
@Table({
  tableName: 'study_material',
  underscored: true,
  timestamps: true,
  paranoid: true
})
export class StudyMaterial extends Model<StudyMaterial> {
  @Field()
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataType.UUIDV4
  })
  public id: string;

  @Field()
  @ForeignKey(() => ActivityType)
  @Column({
    type: DataType.STRING({ length: 32 }),
    allowNull: false
  })
  public activityTypeId: string;

  @Field()
  @ForeignKey(() => StudyPlan)
  @ForeignKey(() => Course)
  @Column({
    type: DataType.STRING({ length: 12 }),
    allowNull: false
  })
  public courseId: string;

  @Field()
  @ForeignKey(() => StudyPlan)
  @ForeignKey(() => University)
  @Column({
    type: DataType.STRING({ length: 8 }),
    allowNull: false
  })
  public universityId: string;

  @Field()
  @Column({
    type: DataType.STRING({ length: 72 }),
    allowNull: false
  })
  public name: string;

  @HasMany(() => StudyFile)
  @Field(() => [StudyFile])
  public files: StudyFile[];

  @BelongsTo(() => ActivityType)
  public activityType: ActivityType;

  public getFiles: HasManyGetAssociationsMixin<StudyFile>;

  public createFile: HasManyCreateAssociationMixin<StudyFile>;

  @Field()
  public createdAt: Date;

  @Field()
  public updatedAt: Date;

  @Field({ nullable: true })
  public deletedAt?: Date;
}