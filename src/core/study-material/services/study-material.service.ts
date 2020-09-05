import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { StudyMaterial } from '../models/study-material.model';
import {
  CreateStudyMaterialDto,
  FindStudyMaterialActivityTypesArgs,
  FindStudyMaterialArgs,
  FindStudyMaterialsArgs,
} from '../dto/study-material.dto';
import { ActivityType } from '../models/activity-type.model';
import { StudyFile } from '../models/study-file.model';
import { File } from '../../file/models/file.model';
import { FileAccount } from '../../file/models/file-account.model';

@Injectable()
export class StudyMaterialService {
  constructor(
    @InjectModel(StudyMaterial) private repository: typeof StudyMaterial
  ) {}

  findById(findArgs: FindStudyMaterialArgs) {
    return this.repository.findOne({ where: {...findArgs}, include: [StudyFile]});
  }

  findOne(findArgs: any) {
    return this.repository.findOne({ where: { ...findArgs } });
  }

  findAll(findArgs: FindStudyMaterialsArgs, attributes?: string[]) {
    const paranoid = findArgs.paranoid;
    delete findArgs.paranoid;
    return this.repository.findAll({
      where: {...findArgs},
      attributes,
      paranoid
    });
  }

  async findActivityTypes(findArgs: FindStudyMaterialActivityTypesArgs) {
    const where = {...findArgs};
    const partial = await this.repository
      .findAll({ where, include: [ActivityType] })
      .map(v => v.activityType);
    const result: ActivityType[] = [];
    for (const v of partial) {
      if (!result.find(v2 => v2.id === v.id)) {
        result.push(v);
      }
    }
    return result;
  }

  async create(createDto: CreateStudyMaterialDto) {
    return this.repository.create(createDto);
  }

  createMaterialFinder(platformId: string) {
    return (findArgs: FindStudyMaterialArgs) => {
      delete findArgs.paranoid;
      return this.repository.findOne({
        where: {...findArgs},
        include: [
          {
            model: StudyFile,
            required: true,
            include: [
              {
                model: File,
                required: true,
                include: [{model: FileAccount, where: {platformId}}]
              }
            ]
          }
        ]
      })
    }
  }

}