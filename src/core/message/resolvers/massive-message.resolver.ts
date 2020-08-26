import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { MassiveMessage } from '../models/massive-message.model';
import { InjectModel } from '@nestjs/sequelize';
import { FindMassiveMessageArgs } from '../dto/massive-message.dto';
import { QueryIncludes } from '../../../common/decorators/query-includes.decorator';
import { MassiveMessageRequest } from '../models/massive-message-request.model';
import { QueryFields } from '../../../common/decorators/query-fields.decorator';
import { Message } from '../models/message.model';

@Resolver(of => MassiveMessage)
export class MassiveMessageResolver {
  constructor(
    @InjectModel(MassiveMessage)
    private repository: typeof MassiveMessage
  ) {}

  @Query(returns => MassiveMessage)
  massiveMessage(
    @Args() findArgs: FindMassiveMessageArgs,
    @QueryIncludes(['massiveMessageRequest', 'message']) includes: boolean[]
  ) {
    const include = [MassiveMessageRequest, Message]
      .filter((v, i) => includes[i]);
    return this.repository.findOne({ where: {...findArgs}, include });
  }

  @Query(returns => [MassiveMessage])
  massiveMessages(
    @Args() findArgs: FindMassiveMessageArgs,
    @QueryIncludes(['massiveMessageRequest']) includes: boolean[]
  ) {
    const include = [MassiveMessageRequest].filter((v, i) => includes[i]);
    return this.repository.findAll({ where: {...findArgs}, include });
  }

  @ResolveField(returns => MassiveMessageRequest)
  request(
    @Parent() parent: MassiveMessage,
    @QueryFields(MassiveMessageRequest) attributes: string[],
  ) {
    if (parent.massiveMessageRequest) return parent.massiveMessageRequest;
    return parent.getMassiveMessageRequest({ attributes });
  }

  @ResolveField(returns => Message)
  message(
    @Parent() parent: MassiveMessage,
    @QueryFields(Message) attributes: string[]
  ) {
    if (parent.message) return parent.message;
    return parent.getMessage({ attributes });
  }

}
