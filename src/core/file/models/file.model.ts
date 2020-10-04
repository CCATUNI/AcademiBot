import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { FileAccount } from './file-account.model';
import { StudyFile } from '../../study-material/models/study-file.model';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { HasManyGetAssociationsMixin } from 'sequelize';

@ObjectType()
@Table({
  tableName: 'file',
  underscored: true,
  timestamps: true,
  paranoid: true
})
export class File extends Model<File> {
  @Field(type => Int)
  @Column({
    type: DataType.INTEGER({ unsigned: true }),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  })
  public id: number;

  @Field()
  @Column({
    type: DataType.CHAR({ binary: true, length: 64 }),
    allowNull: false,
    unique: true
  })
  public contentSha256: string;

  @Field(type => Int)
  @Column({
    type: DataType.INTEGER({ unsigned: true }),
    allowNull: false,
    validate: {
      min: 1
    }
  })
  public sizeInBytes: number;

  @Field()
  @Column({
    type: DataType.STRING({ length: 255 }),
    allowNull: false,
    unique: true
  })
  public filesystemKey: string;

  @Field({ nullable: true })
  @Column(DataType.STRING({ length: 255 }))
  public publicUrl?: string;

  @Field({ nullable: true })
  @Column(DataType.STRING({ length: 64 }))
  public name?: string;

  @Field({ nullable: true })
  @Column(DataType.STRING({ length: 10 }))
  public extension?: string;

  @Field({ nullable: true })
  @Column({
    type: DataType.STRING({ length: 255 }),
    defaultValue: 'text/plain'
  })
  public contentType?: string;

  @Field(type => [FileAccount])
  @HasMany(() => FileAccount)
  public accounts: FileAccount[];

  @Field(type => [StudyFile])
  @HasMany(() => StudyFile)
  public studyFiles: StudyFile[];

  public getAccounts: HasManyGetAssociationsMixin<FileAccount>;

  public getStudyFiles: HasManyGetAssociationsMixin<StudyFile>;

  public getPrivateUrl(): string {
    if (!this.name) return null;
    return `${this.contentSha256}/${this.name}${this.extension ? '.'+this.extension : ''}`
  }

  @Field()
  public createdAt: Date;

  @Field()
  public updatedAt: Date;

  @Field({ nullable: true })
  public deletedAt?: Date;
}