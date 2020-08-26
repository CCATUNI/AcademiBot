import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { University } from '../models/university.model';
import { Course } from '../models/course.model';
import { StudyPeriod } from '../models/study-period.model';
import { StudyProgram } from '../models/study-program.model';
import { UniversityDivision } from '../models/university-division.model';
import { StudyPlan } from '../models/study-plan.model';
import { StudyMaterial } from '../../study-material/models/study-material.model';
import { QueryFields } from '../../../common/decorators/query-fields.decorator';
import { InjectModel } from '@nestjs/sequelize';
import { CREATE_MUTATION_INPUT, UPDATE_MUTATION_INPUT } from '../../../config/constants';
import { QueryIncludes } from '../../../common/decorators/query-includes.decorator';
import { CreateUniversityDto, UpdateUniversityDto } from '../dto/university.dto';
import { UniversityService } from '../services/university.service';

@Resolver(of => University)
export class UniversityResolver {
  constructor(
    @InjectModel(University)
    private universityRepository: typeof University,
    private universityService: UniversityService
  ) {}

  @Query(returns => [University])
  async universities(@QueryFields(University) attributes: string[]) {
    return this.universityService.findAll({ attributes });
  }

  // Example of an optimized query
  @Query(returns => University)
  async university(
    @Args('id') id: string,
    @QueryFields(University) attributes: string[],
    @QueryIncludes(['courses']) includes: boolean[]
  ) {
    const relations = [Course].filter((value, index) => includes[index]);
    return this.universityRepository
      .findByPk(id, { attributes, include: relations });
  }

  @ResolveField(returns => [Course])
  async courses(
    @Parent() university: University,
    @QueryFields(Course) attributes: string[]
  ) {
    if (university.courses) return university.courses;
    return university.getCourses({ attributes });
  }

  @ResolveField(returns => [StudyPeriod])
  async studyPeriods(
    @Parent() university: University,
    @QueryFields(StudyPeriod) attributes: string[]
  ) {
    if (university.studyPeriods) return university.studyPeriods;
    return university.getStudyPeriods({ attributes });
  }

  @ResolveField(returns => [StudyProgram])
  async studyPrograms(
    @Parent() university: University,
    @QueryFields(StudyProgram) attributes: string[]
  ) {
    if (university.studyPrograms) return university.studyPrograms;
    return university.getStudyPrograms({ attributes });
  }

  @ResolveField(returns => [UniversityDivision])
  async divisions(
    @Parent() university: University,
    @QueryFields(UniversityDivision) attributes: string[]
  ) {
    if (university.divisions) return university.divisions;
    return university.getUniversityDivisions({ attributes });
  }

  @ResolveField(returns => [StudyPlan])
  async studyPlans(
    @Parent() university: University,
    @QueryFields(StudyPlan) attributes: string[]
  ) {
    if (university.studyPlans) return university.studyPlans;
    return university.getStudyPlans({ attributes });
  }

  @ResolveField(returns => [StudyMaterial])
  async studyMaterials(
    @Parent() university: University,
    @QueryFields(StudyMaterial) attributes: string[]
  ) {
    if (university.studyMaterials) return university.studyMaterials;
    return university.getStudyMaterials();
  }

  @Mutation(returns => University)
  createUniversity(
    @Args(CREATE_MUTATION_INPUT) createDto: CreateUniversityDto
  ) {
    return this.universityRepository.create(createDto);
  }

  @Mutation(returns => University)
  async updateUniversity(
    @Args('id') id: string,
    @Args(UPDATE_MUTATION_INPUT) updateData: UpdateUniversityDto
  ) {
    const options = { where: {id}, returning: true, limit: 1 };
    const [, [data]] = await this.universityRepository.update(updateData, options);
    return data;
  }

}
