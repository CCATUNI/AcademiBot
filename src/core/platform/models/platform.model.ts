import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { UserAccount } from '../../user/models/user-account.model';
import { Field, ObjectType } from '@nestjs/graphql';
import {
  HasManyCreateAssociationMixin,
  HasManyCreateAssociationMixinOptions,
  HasManyGetAssociationsMixin,
} from 'sequelize';
import { FileAction } from '../../file/models/file-action.model';

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

  @HasMany(() => FileAction)
  public fileActions: FileAction[];

  public createFileAction: HasManyCreateAssociationMixin<FileAction>;

  public createFileRequest(
    values?: {[p: string]: unknown},
    options?: HasManyCreateAssociationMixinOptions
  ) {
    values.action = 'R';
    return this.createFileAction(values, options);
  }

  public createFileSubmission(
    values?: {[p: string]: unknown},
    options?: HasManyCreateAssociationMixinOptions
  ) {
    values.action = 'S';
    return this.createFileAction(values, options);
  }

  public getUserAccounts: HasManyGetAssociationsMixin<UserAccount>;

  @Field(type => Date)
  public createdAt: Date;

  @Field(type => Date, { nullable: true })
  public deletedAt?: Date;
}
