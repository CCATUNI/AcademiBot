import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { File } from '../models/file.model';
import { CreateFileDto, FindFileArgs, FindFilesArgs } from '../dto/file.dto';
import { FindOptions, Includeable, Op, WhereOptions } from 'sequelize';

@Injectable()
export class FileService {
  constructor(@InjectModel(File) private repository: typeof File) {}

  findOne(
    findArgs: FindFileArgs,
    options?: { attributes?: string[], include?: Includeable[] }
  ) {
    const { attributes, include } = options || {};
    const paranoid = findArgs.paranoid;
    delete findArgs.paranoid;
    return this.repository
      .findOne({ where: {...findArgs}, attributes, include, paranoid })
  }

  findAll(
    findArgs: FindFilesArgs,
    options?: FindOptions
  ) {
    const paranoid = findArgs.paranoid;
    delete findArgs.paranoid;
    const where: WhereOptions = findArgs ? {...findArgs} : undefined;
    if (findArgs && findArgs.filesystemKey) {
      where.filesystemKey = {
        [Op.like] : `${findArgs.filesystemKey}%`
      }
    }
    return this.repository
      .findAll({ where, ...options, paranoid });
  }

  create(createDto: CreateFileDto) {
    return this.repository.create(createDto);
  }


}