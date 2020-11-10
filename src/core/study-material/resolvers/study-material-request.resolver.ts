import { Args, Query, Resolver } from '@nestjs/graphql';
import { StudyMaterialRequest } from '../models/study-material-request.model';
import { FindStudyMaterialRequestsArgs } from '../dto/study-material-request.dto';
import { QueryFields } from '../../../common/decorators/query-fields.decorator';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

@Resolver(() => StudyMaterialRequest)
export class StudyMaterialRequestResolver {
  constructor(@InjectModel(StudyMaterialRequest) private repo: typeof StudyMaterialRequest) {}


  @Query(() => [StudyMaterialRequest])
  studyMaterialRequests(
    @Args() findArgs: FindStudyMaterialRequestsArgs,
    @QueryFields(StudyMaterialRequest) attributes: string[]
  ) {
    return this.repo.findAll({
      where: {
        requestedAt: {
          [Op.gte]: findArgs.startDate,
          [Op.lte]: findArgs.endDate
        }
      },
      attributes
    })
  }

}
