import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { UserAccount } from './user-account.model';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Table({
  tableName: 'platform_session',
  timestamps: true,
  underscored: true
})
export class Session extends Model<Session> {
  @Field()
  @Column({
    type: DataType.INTEGER({ unsigned: true }),
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  })
  public id: string;

  @Field()
  @ForeignKey(() => UserAccount)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  public accountId: string;

  @Field()
  @Column({
    type: DataType.UUID,
    allowNull: false,
    defaultValue: DataType.UUIDV4
  })
  public state: string;

  @Field()
  @Column({
    type: DataType.SMALLINT({ unsigned: true }),
    allowNull: false,
    defaultValue: 1
  })
  public uses: number;

  @Field()
  @Column({
    type: DataType.DATE,
    allowNull: false
  })
  public expiresAt: Date;

  @Field()
  public createdAt: Date;

  @Field()
  public updatedAt: Date;

  @BelongsTo(() => UserAccount)
  public userAccount: UserAccount;

  @Field(type => UserAccount)
  public user: UserAccount;

}
