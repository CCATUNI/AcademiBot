import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Course } from '../models/course.model';
import { QueryFields } from '../../../common/decorators/query-fields.decorator';
import { InjectModel } from '@nestjs/sequelize';
import { CREATE_MUTATION_INPUT, UPDATE_MUTATION_INPUT } from '../../../config/constants';
import { CreateCourseDto, FindCourseArgs, FindCoursesArgs, UpdateCourseDto } from '../dto/course.dto';
import { QueryIncludes } from '../../../common/decorators/query-includes.decorator';
import { StudyPlan } from '../models/study-plan.model';
import { StudyMaterial } from '../../study-material/models/study-material.model';
import { Op } from 'sequelize';

@Resolver(of => Course)
export class CourseResolver {
  constructor(
    @InjectModel(Course)
    private courseRepository: typeof Course
  ) {}

  @Query(returns => Course)
  async course(
    @Args() findCourseArgs: FindCourseArgs,
    @QueryFields(Course) attributes: string[],
    @QueryIncludes(['studyPlans']) includes: boolean[]
  ) {
    const include = [StudyPlan].filter((v, i) => includes[i]);
    return this.courseRepository
      .findOne({ where: {...findCourseArgs}, attributes, include });
  }

  @Query(returns => [Course])
  async courses(
    @Args() findArgs: FindCoursesArgs,
    @QueryFields(Course) attributes: string[],
    @QueryIncludes(['studyPlans']) includes: boolean[]
  ) {
    if (findArgs.title) {
      findArgs.title = {
        [Op.like]: `%${findArgs.title}%`
      } as unknown as string
    }
    const include = [StudyPlan, StudyMaterial].filter((v, i) => includes[i]);
    return this.courseRepository
      .findAll({ where: { ...findArgs }, attributes, include });
  }

  @Mutation(returns => Course)
  async createCourse(
    @Args(CREATE_MUTATION_INPUT) createCourseDto: CreateCourseDto
  ) {
    return this.courseRepository.create(createCourseDto);
  }

  @Mutation(returns => Course)
  async updateCourse(
    @Args() findCourseArgs: FindCourseArgs,
    @Args(UPDATE_MUTATION_INPUT) updateDto: UpdateCourseDto
  ) {
    const options = { where: {...findCourseArgs}, returning: true, limit: 1};
    const [, [data]] = await this.courseRepository
      .update(updateDto, options);
    return data;
  }

  @ResolveField(() => [StudyPlan])
  studyPlans(
    @Parent() parent: Course,
    @QueryFields(StudyPlan) attributes: string[],
    @QueryIncludes(['studyMaterials']) includes: boolean[]
  ) {
    const bigReduce = includes.reduce((p, c) => p || c);
    if (!bigReduce) {
      if (parent.studyPlans) return parent.studyPlans;
    }
    const include = [StudyMaterial].filter((v, i) => includes[i]);
    return parent.getStudyPlans({ attributes, include });
  }
}
