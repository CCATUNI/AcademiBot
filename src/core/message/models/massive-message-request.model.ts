import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { File } from '../../file/models/file.model';
import { MassiveMessage } from './massive-message.model';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BelongsToGetAssociationMixin, HasManyGetAssociationsMixin } from 'sequelize';
import { Message } from './message.model';

@ObjectType()
@Table({
  tableName: 'massive_message_request',
  underscored: true,
  timestamps: true,
  updatedAt: false
})
export class MassiveMessageRequest extends Model<MassiveMessageRequest> {
  @Field()
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4
  })
  public id: string;

  @Field()
  @Column({
    type: DataType.TEXT,
    allowNull: false
  })
  public justification: string;

  @Field()
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false
  })
  public approved: boolean;

  @Field({ nullable: true })
  @Column(DataType.STRING({ length: 1024 }))
  public textContent?: string;

  @Field(type => [Int], { nullable: true })
  @Column(DataType.ARRAY(DataType.INTEGER({ unsigned: true })))
  public attachments?: number[];

  @Field(type => Int, { nullable: true })
  @ForeignKey(() => File)
  @Column(DataType.INTEGER({ unsigned: true }))
  public reportId?: number;

  @Field(type => Int, { nullable: true })
  @Column(DataType.SMALLINT({ unsigned: true }))
  public groupsOf?: number;

  @Field()
  @Column({
    type: DataType.DATE,
    allowNull: false,
    validate: {
      isDate: true,
      greaterThanNow: (value: Date) => value > (new Date())
    }
  })
  public targetDate: Date;

  @Field()
  @Column({
   type: DataType.BOOLEAN,
   allowNull: false,
   defaultValue: false
  })
  public exceptional: boolean;

  @Field({ nullable: true })
  @Column(DataType.DATE)
  public startedAt?: Date;

  @Field({ nullable: true })
  @Column(DataType.DATE)
  public finishedAt?: Date;

  @Field(type => File ,{ nullable: true })
  @BelongsTo(() => File, 'reportId')
  public file?: File;

  @HasMany(() => MassiveMessage)
  public massiveMessages: MassiveMessage[];

  @Field(type => MassiveMessage)
  public messages: MassiveMessage[];

  @Field()
  public createdAt: Date;

  public getMessages: HasManyGetAssociationsMixin<Message>;

  public getFile: BelongsToGetAssociationMixin<File>;
}