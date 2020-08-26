import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Course } from '../models/course.model';
import { QueryFields } from '../../../common/decorators/query-fields.decorator';
import { InjectModel } from '@nestjs/sequelize';
import { CREATE_MUTATION_INPUT, UPDATE_MUTATION_INPUT } from '../../../config/constants';
import { CreateCourseDto, FindCourseArgs, FindCoursesArgs, UpdateCourseDto } from '../dto/course.dto';

@Resolver(of => Course)
export class CourseResolver {
  constructor(
    @InjectModel(Course)
    private courseRepository: typeof Course
  ) {}

  @Query(returns => Course)
  async course(
    @Args() findCourseArgs: FindCourseArgs,
    @QueryFields(Course) attributes: string[]
  ) {
    return this.courseRepository
      .findOne({ where: {...findCourseArgs}, attributes });
  }

  @Query(returns => [Course])
  async courses(
    @Args() findArgs: FindCoursesArgs,
    @QueryFields(Course) attributes: string[]
  ) {
    return this.courseRepository
      .findAll({ where: { ...findArgs }, attributes });
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
}
