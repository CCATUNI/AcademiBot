import { Args, Query, Resolver } from '@nestjs/graphql';
import { FileSubmission } from '../models/file-submission.model';
import { InjectModel } from '@nestjs/sequelize';
import { FindFileSubmissionArgs, FindFileSubmissionsArgs } from '../dto/file-submission.dto';
import { QueryFields } from '../../../common/decorators/query-fields.decorator';

@Resolver(of => FileSubmission)
export class FileSubmissionResolver {
  constructor(
    @InjectModel(FileSubmission) private repository: typeof FileSubmission
  ) {}

  @Query(returns => FileSubmission)
  fileSubmission(
    @Args() findArgs: FindFileSubmissionArgs,
    @QueryFields(FileSubmission) attributes: string[]
  ) {
    return this.repository.findByPk(findArgs.id, { attributes });
  }

  @Query(returns => [FileSubmission])
  fileSubmissions(
    @Args() findArgs: FindFileSubmissionsArgs,
    @QueryFields(FileSubmission) attributes: string[]
  ) {
    return this.repository.findAll({ where: {...findArgs}, attributes });
  }
}
