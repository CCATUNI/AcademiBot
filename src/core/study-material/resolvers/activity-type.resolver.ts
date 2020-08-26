import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ActivityType } from '../models/activity-type.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateActivityTypeDto, FindActivityTypeArgs, UpdateActivityTypeDto } from '../dto/activity-type.dto';
import { StudyMaterial } from '../models/study-material.model';
import { QueryFields } from '../../../common/decorators/query-fields.decorator';
import { CREATE_MUTATION_INPUT, UPDATE_MUTATION_INPUT } from '../../../config/constants';

@Resolver(of => ActivityType)
export class ActivityTypeResolver {
  constructor(
    @InjectModel(ActivityType)
    private activityTypeRepository: typeof ActivityType
  ) {}

  @Query(returns => ActivityType)
  activityType(
    @Args() findArgs: FindActivityTypeArgs
  ) {
    const paranoid = findArgs.paranoid;
    delete findArgs.paranoid;
    return this.activityTypeRepository
      .findOne({ where: {...findArgs }, paranoid });
  }

  @Query(returns => [ActivityType])
  activityTypes() {
    return this.activityTypeRepository
      .findAll();
  }

  @ResolveField(returns => [StudyMaterial])
  studyMaterials(
    @Parent() activityType: ActivityType,
    @QueryFields(StudyMaterial) attributes: string[]
  ) {
    if (activityType.studyMaterials) return activityType.studyMaterials;
    return activityType.getStudyMaterials({ attributes });
  }

  @Mutation(returns => ActivityType)
  createActivityType(
    @Args(CREATE_MUTATION_INPUT) createDto: CreateActivityTypeDto
  ) {
    return this.activityTypeRepository.create(createDto);
  }

  @Mutation(returns => ActivityType)
  async updateActivityType(
    @Args() findArgs: FindActivityTypeArgs,
    @Args(UPDATE_MUTATION_INPUT) updateDto: UpdateActivityTypeDto
  ) {
    delete findArgs.paranoid;
    const options = { where: {...findArgs}, limit: 1, returning: true };
    const [, [data]] = await this.activityTypeRepository
      .update(updateDto, options);

    return data;
  }

}
