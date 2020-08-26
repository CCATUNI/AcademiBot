import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Platform } from './platform.model';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

@ObjectType()
@Table({
  tableName: 'file_request',
  underscored: true,
  timestamps: true,
  updatedAt: false,
  createdAt: 'requestedAt'
})
export class FileRequest extends Model<FileRequest> {
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

  @Field(type => GraphQLJSON, { nullable: true })
  @Column(DataType.JSONB)
  public error?: object;

  @Field(type => Date)
  public requestedAt: Date;
}