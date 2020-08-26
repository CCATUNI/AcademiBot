import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { StudyProgram } from '../models/study-program.model';
import { InjectModel } from '@nestjs/sequelize';
import { QueryFields } from '../../../common/decorators/query-fields.decorator';
import { CREATE_MUTATION_INPUT, UPDATE_MUTATION_INPUT } from '../../../config/constants';
import {
  CreateStudyProgramDto,
  FindStudyProgramArgs,
  FindStudyProgramsArgs,
  UpdateStudyProgramDto,
} from '../dto/study-program.dto';
import { StudyPlan } from '../models/study-plan.model';

@Resolver(of => StudyProgram)
export class StudyProgramResolver {
  constructor(
    @InjectModel(StudyProgram)
    private studyProgramRepository: typeof StudyProgram
  ) {}

  @Query(returns => StudyProgram)
  studyProgram(
    @Args() findArgs: FindStudyProgramArgs,
    @QueryFields(StudyProgram) attributes: string[]
  ) {
    const paranoid = findArgs.paranoid;
    delete findArgs.paranoid;
    return this.studyProgramRepository
      .findOne({ where: {...findArgs}, attributes, paranoid });
  }


  @Query(returns => [StudyProgram])
  studyPrograms(
    @Args() findArgs: FindStudyProgramsArgs,
    @QueryFields(StudyProgram) attributes: string[]
  ) {
    const paranoid = findArgs.paranoid;
    delete findArgs.paranoid;
    return this.studyProgramRepository
      .findAll({ where: { ...findArgs }, attributes, paranoid });
  }

  @Mutation(returns => StudyProgram)
  createStudyProgram(
    @Args(CREATE_MUTATION_INPUT) createDto: CreateStudyProgramDto
  ) {
    return this.studyProgramRepository.create(createDto);
  }

  @ResolveField(returns => [StudyPlan])
  studyPlans(@Parent() parent: StudyProgram) {
    if (parent.studyPlans) return parent.studyPlans;
    return parent.getStudyPlans();
  }

  @Mutation(returns => StudyProgram)
  async updateStudyProgram(
    @Args() findArgs: FindStudyProgramArgs,
    @Args(UPDATE_MUTATION_INPUT) updateDto: UpdateStudyProgramDto
  ) {
    const options = { where: {...findArgs}, returning: true, limit: 1 };
    const [, [data]] = await this.studyProgramRepository.update(updateDto, options);
    return data;
  }
}
