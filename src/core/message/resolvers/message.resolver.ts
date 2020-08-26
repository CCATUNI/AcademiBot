import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Message } from '../models/message.model';
import { InjectModel } from '@nestjs/sequelize';
import { FindMessageArgs, FindMessagesArgs } from '../dto/message.dto';
import { QueryFields } from '../../../common/decorators/query-fields.decorator';
import { QueryIncludes } from '../../../common/decorators/query-includes.decorator';
import { UserAccount } from '../../user/models/user-account.model';
import { File } from '../../file/models/file.model';

@Resolver(of => Message)
export class MessageResolver {
  constructor(
    @InjectModel(Message)
    private repository: typeof Message
  ) {}

  @Query(returns => Message)
  message(
    @Args() findArgs: FindMessageArgs,
    @QueryFields(Message) attributes: string[],
    @QueryIncludes(['user']) includes: boolean[]
  ) {
    const id = findArgs.id;
    const include = [UserAccount].filter((v, i) => includes[i]);
    return this.repository.findByPk(id, { include, attributes });
  }

  @Query(returns => [Message])
  messages(
    @Args() findArgs: FindMessagesArgs,
    @QueryFields(Message) attributes: string[],
    @QueryIncludes(['user']) includes: boolean[]
  ) {
    const include = [UserAccount].filter((v, i) => includes[i]);
    return this.repository
      .findAll({ where: {...findArgs}, attributes, include });
  }

  @ResolveField(returns => [File])
  attachments(
    @Parent() parent: Message,
    @QueryFields(File) attributes: string[]
  ) {
    return parent.attachments.map(v => File.findByPk(v, { attributes }));
  }

  @ResolveField(returns => UserAccount)
  user(
    @Parent() parent: Message,
    @QueryFields(UserAccount) attributes: string[]
  ) {
    if (parent.userAccount) return parent.userAccount;
    return parent.getUserAccount({ attributes });
  }

}
