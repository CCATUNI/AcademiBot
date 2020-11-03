import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Platform } from '../../platform/models/platform.model';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

@ObjectType()
@Table({
  tableName: 'file_action',
  underscored: true,
  timestamps: true,
  updatedAt: false,
  createdAt: 'performedAt'
})
export class FileAction extends Model<FileAction> {
  @Field(type => Int)
  @Column({
    type: DataType.INTEGER({ unsigned: true }),
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  })
  public id: number;

  @Field()
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

  @Field(type => Int)
  @Column({
    type: DataType.INTEGER({ unsigned: true }),
    allowNull: false
  })
  public fileId: number;

  @Field()
  @Column({
    type: DataType.CHAR({ length: 1 }),
    allowNull: false,
    validate: {
      isIn: [['R', 'S']]
    }
  })
  public action: string;

  @Field(type => GraphQLJSON, { nullable: true })
  @Column(DataType.JSONB)
  public error?: object;

  @BelongsTo(() => Platform)
  public platform: Platform;

  @Field(type => Date)
  public performedAt: Date;
}
