import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { MassiveMessageRequest } from '../models/massive-message-request.model';
import { InjectModel } from '@nestjs/sequelize';
import { QueryIncludes } from '../../../common/decorators/query-includes.decorator';
import { Message } from '../models/message.model';
import {
  CreateMassiveMessageRequestDto,
  FindMassiveMessageRequestArgs,
  UpdateMassiveMessageRequestDto,
} from '../dto/massive-message-request.dto';
import { File } from '../../file/models/file.model';
import { QueryFields } from '../../../common/decorators/query-fields.decorator';
import { CREATE_MUTATION_INPUT, UPDATE_MUTATION_INPUT } from '../../../config/constants';

@Resolver(of => MassiveMessageRequest)
export class MassiveMessageRequestResolver {
  constructor(
    @InjectModel(MassiveMessageRequest)
    private repository: typeof MassiveMessageRequest
  ) {}

  @Query(returns => MassiveMessageRequest)
  massiveMessageRequest(
    @Args() findArgs: FindMassiveMessageRequestArgs,
    @QueryIncludes(['file', 'messages']) includes: boolean[]
  ) {
    const include = [File, Message]
      .filter((v, i) => includes[i]);
    return this.repository.findOne({ where: {...findArgs}, include });
  }

  @Query(returns => MassiveMessageRequest)
  massiveMessageRequests(
    @Args() findArgs: FindMassiveMessageRequestArgs,
    @QueryIncludes(['file', 'messages']) includes: boolean[]
  ) {
    const include = [File, Message]
      .filter((v, i) => includes[i]);
    return this.repository.findAll({ where: {...findArgs}, include });
  }

  @ResolveField(returns => [Message])
  messages(
    @Parent() parent: MassiveMessageRequest,
    @QueryFields(Message) attributes: string[]
  ) {
    if (parent.messages) return parent.messages;
    return parent.getMessages({ attributes });
  }

  @ResolveField(returns => File)
  file(
    @Parent() parent: MassiveMessageRequest,
    @QueryFields(File) attributes: string[]
  ) {
    if (parent.file) return parent.file;
    return parent.getFile({ attributes });
  }

  @Mutation(returns => MassiveMessageRequest)
  createMassiveMessageRequest(
    @Args(CREATE_MUTATION_INPUT) createDto: CreateMassiveMessageRequestDto
  ) {
    return this.repository.create(createDto);
  }

  @Mutation(returns => MassiveMessageRequest)
  async updateMassiveMessageRequest(
    @Args() findArgs: FindMassiveMessageRequestArgs,
    @Args(UPDATE_MUTATION_INPUT) updateDto: UpdateMassiveMessageRequestDto
  ) {
    const request = await this.repository.findByPk(findArgs.id);
    await request.update({ approved: updateDto.approved });
    return request;
  }

}
