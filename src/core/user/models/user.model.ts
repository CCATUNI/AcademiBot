import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { University } from '../../university/models/university.model';
import { StudyProgram } from '../../university/models/study-program.model';
import { Course } from '../../university/models/course.model';
import { StudyPeriod } from '../../university/models/study-period.model';
import { ActivityType } from '../../study-material/models/activity-type.model';
import { UserAccount } from './user-account.model';
import { Field, ObjectType } from '@nestjs/graphql';
import { BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, HasManyGetAssociationsMixin } from 'sequelize';

@ObjectType()
@Table({
  tableName: 'user',
  underscored: true,
  timestamps: true,
  paranoid: true
})
export class User extends Model<User> {
  @Field()
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataType.UUIDV4
  })
  public id: string;

  @Field()
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true
  })
  public acceptsMassiveMessage: boolean;

  @Field()
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false
  })
  public lookingForElectives: boolean;

  @Field({ nullable: true })
  @ForeignKey(() => University)
  @Column({
    type: DataType.STRING({ length: 8 }),
    set(this: User, v: string) {
      this.studyProgramId = null;
      this.setDataValue('universityId', v);
    }
  })
  public universityId?: string;

  @Field({ nullable: true })
  @ForeignKey(() => StudyProgram)
  @Column({
    type: DataType.STRING({ length: 8 }),
    set(this: User, v: string) {
      this.studyPeriodId = null;
      this.setDataValue('studyProgramId', v);
    }
  })
  public studyProgramId?: string;

  @ForeignKey(() => Course)
  @Column({
    type: DataType.STRING({ length: 12 }),
    set(this: User, v: string) {
      this.activityTypeId = null;
      this.setDataValue('courseId', v);
    }
  })
  public courseId?: string;

  @Field({ nullable: true })
  @ForeignKey(() => StudyPeriod)
  @Column({
    type: DataType.SMALLINT({ unsigned: true }),
    set(this: User, v: number | string) {
      v = parseInt(String(v)) as number;
      if (isNaN(v)) {
        v = null as number;
      }
      this.courseId = null;
      this.setDataValue('studyPeriodId', v);
    }
  })
  public studyPeriodId?: number;

  @Field({ nullable: true })
  @ForeignKey(() => ActivityType)
  @Column(DataType.STRING({ length: 32 }))
  public activityTypeId?: string;

  @Field(type => [UserAccount])
  public accounts: UserAccount[];

  @Field(type => Date)
  public createdAt: Date;

  @Field(type => Date)
  public updatedAt: Date;

  @Field(type => Date, { nullable: true })
  public deletedAt?: Date;

  @Field(type => Course, { nullable: true })
  @BelongsTo(() => Course)
  public course?: Course;

  //Associations for the model
  @BelongsTo(() => University)
  public university?: University;

  @BelongsTo(() => StudyProgram)
  public studyProgram?: StudyProgram;

  @BelongsTo(() => StudyPeriod)
  public studyPeriod?: StudyPeriod;

  @BelongsTo(() => ActivityType)
  public activityType?: ActivityType;

  @HasMany(() => UserAccount)
  public userAccounts: UserAccount[];

  // Methods for getting associations from current user
  public getUserAccounts: HasManyGetAssociationsMixin<UserAccount>;

  public getCourse: BelongsToGetAssociationMixin<Course>;

  public setCourse: BelongsToSetAssociationMixin<Course, string>;

  public setActivityType: BelongsToSetAssociationMixin<ActivityType, string>;

  // Virtual properties
  public get canQueryCourses() {
    return !!this.universityId && !!this.studyProgramId && !!this.studyPeriodId;
  }

  public get canQueryStudyMaterial() {
    return !!this.universityId && !!this.courseId && !!this.activityTypeId;
  }
}
