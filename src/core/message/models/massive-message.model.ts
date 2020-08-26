import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Message } from './message.model';
import { MassiveMessageRequest } from './massive-message-request.model';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BelongsToGetAssociationMixin } from 'sequelize';

@ObjectType()
@Table({
  tableName: 'massive_message',
  underscored: true,
  timestamps: false
})
export class MassiveMessage extends Model<MassiveMessage> {
  @Field()
  @ForeignKey(() => MassiveMessageRequest)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true
  })
  public messageRequestId: string;

  @Field(type => Int)
  @ForeignKey(() => Message)
  @Column({
    type: DataType.INTEGER({ unsigned: true }),
    allowNull: false,
    primaryKey: true,
    unique: true
  })
  public messageId: number;

  @Field(type => Message)
  @BelongsTo(() => Message)
  public message: Message;

  @Field(type => MassiveMessageRequest)
  public request: MassiveMessageRequest;

  @BelongsTo(() => MassiveMessageRequest)
  public massiveMessageRequest: MassiveMessageRequest;

  public getMessage: BelongsToGetAssociationMixin<Message>;

  public getMassiveMessageRequest: BelongsToGetAssociationMixin<MassiveMessageRequest>;
}