import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { StudyProgram } from '../models/study-program.model';
import { FindStudyProgramsArgs } from '../dto/study-program.dto';
import { StudyPlan } from '../models/study-plan.model';

@Injectable()
export class StudyProgramService {
  constructor(
    @InjectModel(StudyProgram) private repository: typeof StudyProgram
  ) {}

  findAll(findArgs: FindStudyProgramsArgs) {
    return this.repository.findAll({ where: {...findArgs} });
  }

  findForSending(findArgs: FindStudyProgramsArgs) {
    return this.repository.findAll({ where: {...findArgs}, include: [{ model: StudyPlan, required: true }]});
  }
}