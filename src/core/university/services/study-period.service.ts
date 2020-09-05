import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { StudyPeriod } from '../models/study-period.model';
import { FindStudyPeriodsArgs } from '../dto/study-period.dto';
import { StudyPlan } from '../models/study-plan.model';

@Injectable()
export class StudyPeriodService {
  constructor(
    @InjectModel(StudyPeriod) private repository: typeof StudyPeriod
  ) {}

  findAll(findArgs: FindStudyPeriodsArgs) {
    return this.repository.findAll({ where: {...findArgs} });
  }

  findForSend(findArgs: FindStudyPeriodsArgs) {
    return this.repository
      .findAll({
        where: {...findArgs},
        include: [{ model: StudyPlan, required: true }],
        order: ['id']
      });
  }

}