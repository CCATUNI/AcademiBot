import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Session } from '../models/session.model';
import { InjectModel } from '@nestjs/sequelize';
import { FindSessionArgs, FindSessionsArgs, UpdateSessionDto } from '../dto/session.dto';
import { QueryFields } from '../../../common/decorators/query-fields.decorator';
import { QueryIncludes } from '../../../common/decorators/query-includes.decorator';
import { UserAccount } from '../models/user-account.model';
import { Op } from 'sequelize';
import { UPDATE_MUTATION_INPUT } from '../../../config/constants';

@Resolver(of => Session)
export class SessionResolver {
  constructor(@InjectModel(Session) public repository: typeof Session) {}

  @Query(returns => Session)
  session(
    @Args() findArgs: FindSessionArgs,
    @QueryFields(Session) attributes: string[],
    @QueryIncludes(['user']) includes: boolean[]
  ) {
    const include = [UserAccount].filter((v, i) => includes[i]);
    return this.repository.findByPk(findArgs.id, { include, attributes });
  }

  @Query(returns => [Session])
  sessions(
    @Args() findArgs: FindSessionsArgs,
    @QueryFields(Session) attributes: string[],
    @QueryIncludes(['user']) includes: boolean[]
  ) {
    const include = [UserAccount].filter((v, i) => includes[i]);
    const expired = findArgs.expired;
    delete findArgs.expired;
    if (expired === null) {
      return this.repository
        .findAll({
          where: {...findArgs},
          include,
          attributes
        });
    }
    if (expired) {
      return this.repository
        .findAll({
          where: {...findArgs, expiresAt: {[Op.lte]: new Date()} },
          include,
          attributes
        });
    } else {
      return this.repository
        .findAll({
          where: {...findArgs, expiresAt: {[Op.gte]: new Date()} },
          include,
          attributes
        });
    }

  }

  @Mutation(returns => Session)
  async updateSession(
    @Args() findArgs: FindSessionArgs,
    @Args(UPDATE_MUTATION_INPUT) updateDto: UpdateSessionDto
  ) {
    const expiresAt = updateDto.expiresAt;
    const session = await this.repository
      .findByPk(findArgs.id, { rejectOnEmpty: true });
    await session.update({ expiresAt });
    return session;
  }

}
