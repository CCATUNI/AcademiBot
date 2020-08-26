import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { UserAccount } from '../../user/models/user-account.model';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import graphqlTypeJson from 'graphql-type-json';
import { File } from '../../file/models/file.model';
import { BelongsToGetAssociationMixin } from 'sequelize';

@ObjectType()
@Table({
  tableName: 'message',
  timestamps: true,
  underscored: true,
  updatedAt: false,
  createdAt: 'sentAt'
})
export class Message extends Model<Message> {
  @Field(type => Int)
  @Column({
    type: DataType.INTEGER({ unsigned: true }),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  })
  public id: number;

  @Field()
  @ForeignKey(() => UserAccount)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  public accountId: string;

  @Field({ nullable: true })
  @Column(DataType.STRING({ length: 1024 }))
  public textContent?: string;


  @Field(type => [File], { nullable: true })
  @Column(DataType.ARRAY(DataType.INTEGER({ unsigned: true })))
  public attachments?: number[];

  @Field()
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false
  })
  public sentByUser: boolean;

  @Field(type => graphqlTypeJson, { nullable: true })
  @Column(DataType.JSONB)
  public error?: object;

  @Field({ nullable: true })
  public sentAt: Date;

  @BelongsTo(() => UserAccount)
  public userAccount: UserAccount;

  @Field(type => UserAccount)
  public user: UserAccount;

  public getUserAccount: BelongsToGetAssociationMixin<UserAccount>;
}
