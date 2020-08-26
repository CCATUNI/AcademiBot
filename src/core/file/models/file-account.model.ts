import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { File } from './file.model';
import { Platform } from '../../platform/models/platform.model';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Table({
  tableName: 'account_file_platform',
  underscored: true,
  timestamps: true,
  paranoid: true
})
export class FileAccount extends Model<FileAccount> {
  @Field()
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4
  })
  public id: string;

  @Field(type => Int)
  @ForeignKey(() => File)
  @Column({
    type: DataType.INTEGER({ unsigned: true }),
    allowNull: false
  })
  public fileId: number;

  @Field()
  @ForeignKey(() => Platform)
  @Column({
    type: DataType.STRING({ length: 31 }),
    allowNull: false
  })
  public platformId: string;

  @Field()
  @Column({
    type: DataType.STRING({ length: 32 }),
    allowNull: false,
    defaultValue: 'file'
  })
  public fileType: string;

  @Field({ nullable: true })
  @Column(DataType.STRING({ length: 32 }))
  public reUtilizationCode?: string;

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

  @Field()
  public createdAt: Date;

  @Field()
  public updatedAt: Date;

  @Field({ nullable: true })
  public deletedAt?: Date;
}