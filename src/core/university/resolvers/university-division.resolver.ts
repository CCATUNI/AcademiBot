import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InjectModel } from '@nestjs/sequelize';
import { UniversityDivision } from '../models/university-division.model';
import {
  CreateUniversityDivisionDto,
  FindUniversityDivisionArgs,
  FindUniversityDivisionsArgs,
  UpdateUniversityDivisionDto,
} from '../dto/university-division.dto';
import { QueryFields } from '../../../common/decorators/query-fields.decorator';
import { CREATE_MUTATION_INPUT, UPDATE_MUTATION_INPUT } from '../../../config/constants';

@Resolver('UniversityDivision')
export class UniversityDivisionResolver {
  constructor(
    @InjectModel(UniversityDivision)
    private universityDivisionRepository: typeof UniversityDivision
  ) {}

  @Query(returns => [UniversityDivision])
  universityDivisions(
    @Args() findArgs: FindUniversityDivisionsArgs,
    @QueryFields(UniversityDivision) attributes: string[]
  ) {
    return this.universityDivisionRepository
      .findAll({ where: { ...findArgs }, attributes });
  }

  @Query(returns => UniversityDivision)
  universityDivision(
    @Args() findArgs: FindUniversityDivisionArgs,
    @QueryFields(UniversityDivision) attributes: string[]
  ) {
    return this.universityDivisionRepository
      .findOne({ where: {...findArgs}, attributes });
  }

  @Mutation(returns => UniversityDivision)
  async createUniversityDivision(
    @Args(CREATE_MUTATION_INPUT) createDto: CreateUniversityDivisionDto,
  ) {
    return this.universityDivisionRepository.create(createDto);
  }

  @Mutation(returns => UniversityDivision)
  async updateUniversityDivision(
    @Args() findArgs: FindUniversityDivisionArgs,
    @Args(UPDATE_MUTATION_INPUT) updateDto: UpdateUniversityDivisionDto
  ) {
    const options = { where: {...findArgs}, returning: true, limit: 1 };
    const [, [data]] = await this.universityDivisionRepository
      .update(updateDto, options);
  }

}
