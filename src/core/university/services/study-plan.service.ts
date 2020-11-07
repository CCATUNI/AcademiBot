import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { StudyPlan } from '../models/study-plan.model';
import { FindStudyPlanArgs, FindStudyPlansArgs, FindStudyPlansForUserArgs } from '../dto/study-plan.dto';
import { Includeable, Op } from 'sequelize';
import { Course } from '../models/course.model';
import { StudyMaterial } from '../../study-material/models/study-material.model';
import { Model } from 'sequelize-typescript';

@Injectable()
export class StudyPlanService {
  constructor(
    @InjectModel(StudyPlan) private repository: typeof StudyPlan
  ) {}

  private static addMultipleForeignKey(
    options: {attributes?: string[], include?: Includeable[]}
  ) {
    if (options.include!.includes(StudyMaterial)) {
      const i = options.include.indexOf(StudyMaterial);
      options.include[i] = {
        model: StudyMaterial,
        on: {
          'course_id': {[Op.col]: 'StudyPlan.course_id'},
          'university_id': {[Op.col]: 'StudyPlan.university_id'}
        },
        duplicating: true
      }
    }
  }

  private static addRequiredMultipleForeignKey(
    options: {attributes?: string[], include?: Includeable[]}
  ) {
    if (options.include!.includes(StudyMaterial)) {
      const i = options.include.indexOf(StudyMaterial);
      options.include[i] = {
        model: StudyMaterial,
        on: {
          'course_id': {[Op.col]: 'StudyPlan.course_id'},
          'university_id': {[Op.col]: 'StudyPlan.university_id'}
        },
        duplicating: true,
        required: true
      }
    }
  }


  async findOne(findArgs: FindStudyPlanArgs, options?: {attributes?: string[], include?:typeof Model[]}) {
    const paranoid = findArgs.paranoid;
    delete findArgs.paranoid;
    if (options && options.include) {
      StudyPlanService.addMultipleForeignKey(options);
    }
    return this.repository.findOne({ where: {...findArgs}, ...options, paranoid });
  }

  async findAll(findArgs: FindStudyPlansArgs, options?: {attributes?: string[], include?:typeof Model[]}) {
    const paranoid = findArgs.paranoid;
    delete findArgs.paranoid;
    if (options && options.include) {
      StudyPlanService.addMultipleForeignKey(options);
    }
    return this.repository.findAll({ where: {...findArgs}, ...options, paranoid });
  }

  async findValid(findArgs: FindStudyPlansArgs) {
    const paranoid = findArgs.paranoid;
    delete findArgs.paranoid;
    const options = {include:[Course, StudyMaterial]};
    StudyPlanService.addRequiredMultipleForeignKey(options);
    return this.repository.findAll({ where: {...findArgs}, ...options, paranoid });
  }

  async findForUser(findArgs: FindStudyPlansForUserArgs) {
    const results: StudyPlan[][] = [];
    const options = {include:[Course, StudyMaterial]};
    StudyPlanService.addRequiredMultipleForeignKey(options);
    const { universityId, studyProgramId } = findArgs;
    const periods: (number|null)[] = [];
    const where = {
      universityId,
      studyProgramId,
      studyPeriodId: {[Op.or]: [{[Op.in]: periods}]}
    };
    if (findArgs.includeElectives) {
      periods.push(null);
      where.studyPeriodId[Op.or].push({[Op.is]: null} as any);
    }
    if (typeof findArgs.studyPeriodId === 'number') {
      const i = findArgs.studyPeriodId;
      periods.push(i);
      for (let j = 1; j < 3; j++) {
        periods.push(i - j);
        periods.push(i + j);
      }
    }
    for (let i = 0; i < periods.length; i++) {
      results.push([]);
    }
    // IncludeElectives is only relevant if study period is set to other than null
    const partials = await this.repository.findAll({ where, ...options });
    /*if (findArgs.includeElectives) {
      delete findArgs.includeElectives;
      const secondWhere = {...findArgs};
      secondWhere.studyPeriodId = null;
      const partial = await this.repository
        .findAll({ where: secondWhere, ...options });
      results.push(partial);
    }
    delete findArgs.includeElectives;
    let num: number;
    if (findArgs.studyPeriodId) {
      num = findArgs.studyPeriodId;
      findArgs.studyPeriodId = {
        [Op.between]: [findArgs.studyPeriodId - 2, findArgs.studyPeriodId + 2]
      } as unknown as number;
    }
    const partials = await this.repository
      .findAll({ where: {...findArgs}, ...options})*/
    for (const partial of partials) {
      for (let i = 0; i < periods.length; i++) {
        if (partial.studyPeriodId === periods[i]) {
          results[i].push(partial);
        }
      }
    }
    /*if (findArgs.studyPeriodId) {
      for (let abs = 0; abs <= 2; abs++) {
        const partial = partials
          .filter(v => Math.abs(v.studyPeriodId - num) === abs);
        if (partial.length)
          results.push(partial);
      }
    } else {
      results.push(partials);
    }*/
    return results;
  }
}
