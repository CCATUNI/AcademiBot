import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InjectModel } from '@nestjs/sequelize';
import { StudyPlan } from '../models/study-plan.model';
import { CREATE_MUTATION_INPUT, UPDATE_MUTATION_INPUT } from '../../../config/constants';
import {
  CreateStudyPlanDto,
  FindStudyPlanArgs,
  FindStudyPlansArgs,
  FindStudyPlansForUserArgs,
  UpdateStudyPlanDto,
} from '../dto/study-plan.dto';
import { QueryIncludes } from '../../../common/decorators/query-includes.decorator';
import { StudyMaterial } from '../../study-material/models/study-material.model';
import { StudyPlanService } from '../services/study-plan.service';

@Resolver(of => StudyPlan)
export class StudyPlanResolver {
  constructor(
    @InjectModel(StudyPlan)
    private studyPlanRepository: typeof StudyPlan,
    private studyPlanService: StudyPlanService
  ) {}

  @Query(returns => [[StudyPlan]])
  studyPlanMatrix(@Args() findArgs: FindStudyPlansForUserArgs) {
    return this.studyPlanService.findForUser(findArgs);
  }

  @Query(returns => StudyPlan)
  studyPlan(
    @Args() findArgs: FindStudyPlanArgs,
    @QueryIncludes(['studyMaterials']) includes: boolean[]
  ) {
    const include = [StudyMaterial].filter((v, i) => includes[i]);
    return this.studyPlanService.findOne(findArgs, { include });
  }

  @Query(returns => [StudyPlan])
  studyPlans(
    @Args() findArgs: FindStudyPlansArgs,
    @QueryIncludes(['studyMaterials']) includes: boolean[]
  ) {
    const include = [StudyMaterial].filter((v, i) => includes[i]);
    return this.studyPlanService
      .findAll(findArgs, { include });
  }

  @Mutation(returns => StudyPlan)
  createStudyPlan(
    @Args(CREATE_MUTATION_INPUT) createDto: CreateStudyPlanDto
  ) {
    return this.studyPlanRepository.create(createDto);
  }

  @Mutation(returns => StudyPlan)
  async updateStudyPlan(
    @Args() findArgs: FindStudyPlanArgs,
    @Args(UPDATE_MUTATION_INPUT) updateDto: UpdateStudyPlanDto
  ) {
    const options = {where:{...findArgs}, returning: true, limit: 1};
    const [, [data]] = await this.studyPlanRepository.update(updateDto, options);
    return data;
  }

}
