import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { StudyMaterial } from '../models/study-material.model';
import { InjectModel } from '@nestjs/sequelize';
import {
  CreateStudyMaterialDto,
  FindStudyMaterialArgs,
  FindStudyMaterialsArgs,
  UpdateStudyMaterialDto,
} from '../dto/study-material.dto';
import { QueryFields } from '../../../common/decorators/query-fields.decorator';
import { StudyFile } from '../models/study-file.model';
import { QueryIncludes } from '../../../common/decorators/query-includes.decorator';
import { CREATE_MUTATION_INPUT, UPDATE_MUTATION_INPUT } from '../../../config/constants';
import { StudyMaterialService } from '../services/study-material.service';
import { File } from '../../file/models/file.model';

@Resolver(of => StudyMaterial)
export class StudyMaterialResolver {
  constructor(
    @InjectModel(StudyMaterial)
    private studyMaterialRepository: typeof StudyMaterial,
    private studyMaterialService: StudyMaterialService
  ) {}

  @Query(returns => [StudyMaterial])
  studyMaterials(
    @Args() findArgs: FindStudyMaterialsArgs,
    @QueryFields(StudyMaterial) attributes: string[],
    @QueryIncludes(['files', 'file']) includes: boolean[]
  ) {
    const paranoid = findArgs.paranoid;
    delete findArgs.paranoid;
    const relations = [StudyFile, File].filter((v, i) => includes[i]);
    if (relations[1]) {
      relations.splice(1, 1);
      relations[0] = {
        model: StudyFile,
        include: File,
      } as unknown as typeof StudyFile
    }
    return this.studyMaterialRepository
      .findAll({ where: {...findArgs}, paranoid, attributes, include: relations });
  }

  @Query(type => StudyMaterial)
  studyMaterial(
    @Args() findArgs: FindStudyMaterialArgs,
    @QueryFields(StudyMaterial) attributes: string[],
    @QueryIncludes(['files']) includes: boolean[]
  ) {
    const paranoid = findArgs.paranoid;
    delete findArgs.paranoid;
    const relations = [StudyFile].filter((v, i) => includes[i]);
    return this.studyMaterialRepository
      .findByPk(findArgs.id, { paranoid, attributes, include: relations });
  }

  @ResolveField(returns => [StudyFile])
  files(
    @Parent() parent: StudyMaterial,
    @QueryFields(StudyFile) attributes: string[]
  ) {
    if (parent.files) return parent.files;
    return parent.getFiles({ attributes });
  }

  @Mutation(returns => StudyMaterial)
  createStudyMaterial(
    @Args(CREATE_MUTATION_INPUT) createDto: CreateStudyMaterialDto
  ) {
    return this.studyMaterialService.create(createDto);
  }

  @Mutation(returns => StudyMaterial)
  async updateStudyMaterial(
    @Args() findArgs: FindStudyMaterialArgs,
    @Args(UPDATE_MUTATION_INPUT) updateDto: UpdateStudyMaterialDto
  ) {
    delete findArgs.paranoid;
    const options = { where: {...findArgs}, returning: true, limit: 1 };
    const [, [data]] = await this.studyMaterialRepository
      .update(updateDto, options);
    return data;
  }

}
