import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserAccount } from '../models/user-account.model';
import { InjectModel } from '@nestjs/sequelize';
import {
  CreateUserAccountDto,
  FindUserAccountArgs,
  FindUserAccountByPublicInfoArgs,
  FindUserAccountsArgs,
} from '../dto/user-account.dto';
import { QueryFields } from '../../../common/decorators/query-fields.decorator';
import { QueryIncludes } from '../../../common/decorators/query-includes.decorator';
import { Message } from '../../message/models/message.model';
import { Session } from '../models/session.model';
import { CREATE_MUTATION_INPUT } from '../../../config/constants';
import { Op } from 'sequelize';
import { UserAccountService } from '../services/user-account.service';

@Resolver(of => UserAccount)
export class UserAccountResolver {
  constructor(
    @InjectModel(UserAccount) private repository: typeof UserAccount,
    private userAccountService: UserAccountService
  ) {}

  @Query(returns => UserAccount)
  userAccount(
    @Args() findArgs: FindUserAccountArgs,
    @QueryFields(UserAccount) attributes: string[],
    @QueryIncludes(['messages', 'sessions']) includes: boolean[]
  ) {
    const paranoid = findArgs.paranoid;
    delete findArgs.paranoid;
    const include = [Message, Session].filter((v, i) => includes[i]);
    return this.repository
      .findOne({ where: {...findArgs}, attributes, include, paranoid });
  }

  @Query(returns => [UserAccount])
  userAccounts(
    @Args() findArgs: FindUserAccountsArgs,
    @QueryFields(UserAccount) attributes: string[],
    @QueryIncludes(['messages', 'sessions']) includes: boolean[]
  ) {
    const paranoid = findArgs.paranoid;
    delete findArgs.paranoid;
    const include = [Message, Session].filter((v, i) => includes[i]);
    return this.repository
      .findAll({ where: {...findArgs}, attributes, include, paranoid });
  }

  @Mutation(returns => UserAccount)
  async createUserAccount(
    @Args(CREATE_MUTATION_INPUT) createDto: CreateUserAccountDto
  ) {
    return this.userAccountService.create(createDto);
  }

  @Query(returns => [UserAccount])
  userAccountsByPublicInfo(
    @Args() findArgs: FindUserAccountByPublicInfoArgs,
    @QueryFields(UserAccount) attributes: string[],
    @QueryIncludes(['messages', 'sessions']) includes: boolean[]
  ) {
    const { paranoid, name } = findArgs;
    delete findArgs.paranoid;
    const include = [Message, Session].filter((v, i) => includes[i]);
    return this.repository
      .findAll({
        where: {
          publicInformation: {
            name: {[Op.like]: `%${name}%`}
          }
        },
        attributes,
        include,
        paranoid
      });

  }

}
