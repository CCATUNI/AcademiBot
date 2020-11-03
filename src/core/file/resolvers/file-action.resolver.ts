import { Args, Query, Resolver } from '@nestjs/graphql';
import { FileAction } from '../models/file-action.model';
import { InjectModel } from '@nestjs/sequelize';
import { FindFileActionArgs, FindFileActionsArgs } from '../dto/file-action.dto';
import { QueryFields } from '../../../common/decorators/query-fields.decorator';

@Resolver(of => FileAction)
export class FileActionResolver {
  constructor(@InjectModel(FileAction) private repository: typeof FileAction) {}

  @Query(returns => [FileAction])
  fileActions(
    @Args() findArgs: FindFileActionsArgs,
    @QueryFields(FileAction) attributes: string[]
  ) {
    return this.repository.findAll({ where: {...findArgs}, attributes });
  }

  @Query(returns => FileAction)
  fileAction(
    @Args() findArgs: FindFileActionArgs,
    @QueryFields(FileAction) attributes: string[]
  ) {
    return this.repository.findByPk(findArgs.id, { attributes });
  }
}
