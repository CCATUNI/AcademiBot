import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { University } from './models/university.model';
import { Course } from './models/course.model';
import { StudyPeriod } from './models/study-period.model';
import { StudyPlan } from './models/study-plan.model';
import { StudyProgram } from './models/study-program.model';
import { UniversityDivision } from './models/university-division.model';
import { UniversityResolver } from './resolvers/university.resolver';
import { CourseResolver } from './resolvers/course.resolver';
import { StudyPlanResolver } from './resolvers/study-plan.resolver';
import { StudyProgramResolver } from './resolvers/study-program.resolver';
import { StudyPeriodResolver } from './resolvers/study-period.resolver';
import { UniversityDivisionResolver } from './resolvers/university-division.resolver';
import { UniversityService } from './services/university.service';
import { CourseService } from './services/course.service';
import { StudyPlanService } from './services/study-plan.service';
import { StudyProgramService } from './services/study-program.service';
import { StudyPeriodService } from './services/study-period.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      University,
      Course,
      StudyPeriod,
      StudyPlan,
      StudyProgram,
      UniversityDivision
    ])
  ],
  providers: [
    UniversityResolver,
    CourseResolver,
    StudyPlanResolver,
    StudyProgramResolver,
    StudyPeriodResolver,
    UniversityDivisionResolver,
    UniversityService,
    CourseService,
    StudyPlanService,
    StudyProgramService,
    StudyPeriodService
  ],
  exports: [
    SequelizeModule,
    UniversityService,
    StudyProgramService,
    StudyPeriodService,
    StudyPlanService
  ]
})
export class UniversityModule {}
