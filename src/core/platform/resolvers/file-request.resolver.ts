import { Args, Query, Resolver } from '@nestjs/graphql';
import { FileRequest } from '../models/file-request.model';
import { InjectModel } from '@nestjs/sequelize';
import { FindFileRequestArgs, FindFileRequestsArgs } from '../dto/file-request.dto';
import { QueryFields } from '../../../common/decorators/query-fields.decorator';

@Resolver(of => FileRequest)
export class FileRequestResolver {
  constructor(@InjectModel(FileRequest) private repository: typeof FileRequest) {}

  @Query(returns => [FileRequest])
  fileRequests(
    @Args() findArgs: FindFileRequestsArgs,
    @QueryFields(FileRequest) attributes: string[]
  ) {
    return this.repository.findAll({ where: {...findArgs}, attributes });
  }

  @Query(returns => FileRequest)
  fileRequest(
    @Args() findArgs: FindFileRequestArgs,
    @QueryFields(FileRequest) attributes: string[]
  ) {
    return this.repository.findByPk(findArgs.id, { attributes });
  }



}
