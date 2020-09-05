import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { InjectModel } from '@nestjs/sequelize';
import { StudyPeriod } from '../models/study-period.model';
import { QueryFields } from '../../../common/decorators/query-fields.decorator';
import { StudyPlan } from '../models/study-plan.model';
import { CREATE_MUTATION_INPUT, UPDATE_MUTATION_INPUT } from '../../../config/constants';
import {
  CreateStudyPeriodDto,
  FindStudyPeriodArgs,
  FindStudyPeriodsArgs,
  UpdateStudyPeriodDto,
} from '../dto/study-period.dto';

@Resolver(of => StudyPeriod)
export class StudyPeriodResolver {
  constructor(
    @InjectModel(StudyPeriod)
    private studyPeriodRepository: typeof StudyPeriod
  ) {}

  @Query(returns => [StudyPeriod])
  async studyPeriods(
    @Args() findArgs: FindStudyPeriodsArgs,
    @QueryFields(StudyPeriod) attributes: string[]
  ) {
    return this.studyPeriodRepository
      .findAll({ where: { ...findArgs }, attributes });
  }

  @Query(returns => StudyPeriod)
  async studyPeriod(
    @Args() findStudyPeriodArgs: FindStudyPeriodArgs,
    @QueryFields(StudyPeriod) attributes: string[]
  ) {
    return this.studyPeriodRepository
      .findOne({ where:{...findStudyPeriodArgs}, attributes });
  }

  @ResolveField(returns => [StudyPlan])
  async studyPlans(
    @Parent() studyPeriod: StudyPeriod,
    @QueryFields(StudyPlan) attributes: string[]
  ) {
    if (studyPeriod.studyPlans) return studyPeriod.studyPlans;
    return studyPeriod.getStudyPlans({ attributes });
  }

  @Mutation(returns => StudyPeriod)
  createStudyPeriod(
    @Args(CREATE_MUTATION_INPUT) createDto: CreateStudyPeriodDto
  ) {
    return this.studyPeriodRepository.create(createDto);
  }

  @Mutation(returns => StudyPeriod)
  async updateStudyPeriod(
    @Args() findStudyPeriodArgs: FindStudyPeriodArgs,
    @Args(UPDATE_MUTATION_INPUT) updateDto: UpdateStudyPeriodDto
  ) {
    const options = {
      where: { ...findStudyPeriodArgs},
      limit: 1,
      returning: true
    };
    const [, [data]] = await this.studyPeriodRepository.update(updateDto, options);
    return data;
  }
}
