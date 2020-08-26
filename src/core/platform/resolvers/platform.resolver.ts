import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Platform } from '../models/platform.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreatePlatformDto, FindPlatformArgs } from '../dto/platform.dto';
import { QueryIncludes } from '../../../common/decorators/query-includes.decorator';
import { UserAccount } from '../../user/models/user-account.model';
import { CREATE_MUTATION_INPUT } from '../../../config/constants';
import { QueryFields } from '../../../common/decorators/query-fields.decorator';

@Resolver(of => Platform)
export class PlatformResolver {
  constructor(
    @InjectModel(Platform) private repository: typeof Platform
  ) {}

  @Query(returns => Platform)
  platform(
    @Args() findArgs: FindPlatformArgs,
    @QueryIncludes(['accounts']) includes: boolean[]
  ) {
    const include = [UserAccount].filter((v, i) => includes[i]);
    return this.repository
      .findByPk(findArgs.id, { include, paranoid: false });
  }

  @Mutation(returns => Platform)
  createPlatform(
    @Args(CREATE_MUTATION_INPUT) createDto: CreatePlatformDto
  ) {
    return this.repository.create(createDto);
  }

  @ResolveField(returns => [UserAccount])
  accounts(
    @Parent() parent: Platform,
    @QueryFields(UserAccount) attributes: string[]
  ) {
    if (parent.userAccounts) return parent.userAccounts;
    return parent.getUserAccounts({ attributes, paranoid: true });
  }
}
