import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { UserAccount } from '../../user/models/user-account.model';
import { Field, ObjectType } from '@nestjs/graphql';
import { HasManyCreateAssociationMixin, HasManyGetAssociationsMixin } from 'sequelize';
import { FileRequest } from './file-request.model';
import { FileSubmission } from './file-submission.model';

@ObjectType()
@Table({
  tableName: 'platform',
  underscored: true,
  timestamps: true,
  updatedAt: false,
  paranoid: true
})
export class Platform extends Model<Platform> {
  @Field()
  @Column({
    type: DataType.STRING({ length: 31 }),
    primaryKey: true,
    allowNull: false
  })
  public id: string;

  @Field({ nullable: true })
  @Column(DataType.TEXT)
  public details?: string;

  @HasMany(() => UserAccount)
  public userAccounts: UserAccount[];

  @Field(type => [UserAccount])
  public accounts: UserAccount[];

  @HasMany(() => FileRequest)
  public fileRequests: FileRequest[];

  @HasMany(() => FileSubmission)
  public fileSubmissions: FileSubmission[];

  public createFileRequest: HasManyCreateAssociationMixin<FileRequest>;

  public createFileSubmission: HasManyCreateAssociationMixin<FileSubmission>;

  public getUserAccounts: HasManyGetAssociationsMixin<UserAccount>;

  @Field(type => Date)
  public createdAt: Date;

  @Field(type => Date, { nullable: true })
  public deletedAt?: Date;
}