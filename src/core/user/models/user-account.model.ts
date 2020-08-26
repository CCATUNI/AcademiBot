import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { User } from './user.model';
import { Platform } from '../../platform/models/platform.model';
import { Message } from '../../message/models/message.model';
import { Session } from './session.model';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { HasManyCreateAssociationMixin } from 'sequelize';

@ObjectType()
@Table({
  tableName: 'account_user_platform',
  timestamps: true,
  paranoid: true,
  underscored: true
})
export class UserAccount extends Model<UserAccount> {
  @Field()
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4
  })
  public id: string;

  @Field()
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  public userId: string;

  @Field()
  @ForeignKey(() => Platform)
  @Column({
    type: DataType.STRING({ length: 31 }),
    allowNull: false
  })
  public platformId: string;

  @Field()
  @Column({
    type: DataType.STRING({ length: 36 }),
    allowNull: false
  })
  public identifierInPlatform: string;

  @Column(DataType.STRING({ length: 60 }))
  public password?: string;

  @Field(type => Int)
  @Column({
    type: DataType.SMALLINT({ unsigned: true }),
    allowNull: false,
    defaultValue: 0
  })
  public privileges: number;

  @Field(type => GraphQLJSON, { nullable: true })
  @Column(DataType.JSONB)
  public publicInformation?: object;

  @Field(type => Int)
  @Column({
    type: DataType.INTEGER({ unsigned: true }),
    allowNull: false,
    defaultValue: 0
  })
  public messagesSent: number;

  @Field(type => Int)
  @Column({
    type: DataType.INTEGER({ unsigned: true }),
    allowNull: false,
    defaultValue: 0
  })
  public donationsSent: number;

  @Field(type => Int)
  @Column({
    type: DataType.INTEGER({ unsigned: true }),
    allowNull: false,
    defaultValue: 0
  })
  public successfulRequests: number;

  @Field(type => Int)
  @Column({
    type: DataType.INTEGER({ unsigned: true }),
    allowNull: false,
    defaultValue: 0
  })
  public failedRequests: number;

  @Field(type => [Message])
  @HasMany(() => Message)
  public messages: Message[];

  @Field(type => [Session])
  @HasMany(() => Session)
  public sessions: Session[];

  @BelongsTo(() => User)
  public user: User;

  @Field(type => Date)
  public createdAt: Date;

  @Field(type => Date)
  public updatedAt: Date;

  @Field(type => Date, { nullable: true })
  public deletedAt?: Date;
  
  public createMessage: HasManyCreateAssociationMixin<Message>;
}