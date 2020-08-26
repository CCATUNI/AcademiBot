import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FileAccount } from '../models/file-account.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateFileAccountDto, FindFileAccountsArgs, UpdateFileAccountDto } from '../dto/file-account.dto';
import { QueryFields } from '../../../common/decorators/query-fields.decorator';
import { CREATE_MUTATION_INPUT, UPDATE_MUTATION_INPUT } from '../../../config/constants';
import { File } from '../models/file.model';

@Resolver(of => FileAccount)
export class FileAccountResolver {
  constructor(
    @InjectModel(FileAccount)
    private fileAccountRepository: typeof FileAccount
  ) {}

  @Query(returns => FileAccount)
  fileAccount(
    @Args() findArgs: FindFileAccountsArgs,
    @QueryFields(FileAccount) attributes: string[]
  ) {
    const paranoid = findArgs.paranoid;
    delete findArgs.paranoid;
    return this.fileAccountRepository
      .findOne({ where: {...findArgs}, attributes, paranoid, include: [File] });
  }

  @Query(returns => [FileAccount])
  fileAccounts(
    @Args() findArgs: FindFileAccountsArgs,
    @QueryFields(FileAccount) attributes: string[]
  ) {
    const paranoid = findArgs.paranoid;
    delete findArgs.paranoid;
    return this.fileAccountRepository
      .findAll({ where: {...findArgs}, attributes, paranoid });
  }

  @Mutation(returns => FileAccount)
  createFileAccount(
    @Args(CREATE_MUTATION_INPUT) createDto: CreateFileAccountDto
  ) {
    return this.fileAccountRepository.create(createDto);
  }

  @Mutation(returns => FileAccount)
  async updateFileAccount(
    @Args() findArgs: FindFileAccountsArgs,
    @Args(UPDATE_MUTATION_INPUT) updateDto: UpdateFileAccountDto
  ) {
    const paranoid = findArgs.paranoid;
    delete findArgs.paranoid;
    const options = { where: {...findArgs}, returning: true, limit: 1, paranoid };
    return this.fileAccountRepository.update(updateDto, options);
  }


}
