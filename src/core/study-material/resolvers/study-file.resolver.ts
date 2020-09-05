import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { StudyFile } from '../models/study-file.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateStudyFileDto, FindStudyFileArgs, FindStudyFilesArgs, UpdateStudyFileDto } from '../dto/study-file.dto';
import { QueryFields } from '../../../common/decorators/query-fields.decorator';
import { CREATE_MUTATION_INPUT, UPDATE_MUTATION_INPUT } from '../../../config/constants';
import { File } from '../../file/models/file.model';

@Resolver(of => StudyFile)
export class StudyFileResolver {
  constructor(
    @InjectModel(StudyFile)
    private studyFileRepository: typeof StudyFile
  ) {}

  @Query(returns => StudyFile)
  studyFile(@Args() findArgs: FindStudyFileArgs) {
    const paranoid = findArgs.paranoid;
    delete findArgs.paranoid;
    return this.studyFileRepository
      .findOne({ where: {...findArgs}, paranoid });
  }

  @Query(returns => [StudyFile])
  studyFiles(
    @Args() findArgs: FindStudyFilesArgs,
    @QueryFields(StudyFile) attributes: string[]
  ) {
    const paranoid = findArgs.paranoid;
    delete findArgs.paranoid;
    return this.studyFileRepository
      .findAll({
        where: {...findArgs},
        paranoid,
        attributes,
        order: [['page', 'DESC']]
      });
  }

  @Mutation(returns => StudyFile)
  createStudyFile(@Args(CREATE_MUTATION_INPUT) createDto: CreateStudyFileDto) {
    return this.studyFileRepository.create(createDto);
  }

  @Mutation(returns => StudyFile)
  async updateStudyFile(
    @Args() findArgs: FindStudyFileArgs,
    @Args(UPDATE_MUTATION_INPUT) updateDto: UpdateStudyFileDto
  ) {
    delete findArgs.paranoid;
    const options = { where: {...findArgs}, limit: 1, returning: true };
    const [, [data]] = await this.studyFileRepository.update(updateDto, options);
    return data;
  }

  @ResolveField(returns => File)
  async file(
    @Parent() parent: StudyFile,
    @QueryFields(File) attributes: string[]
  ) {
    if (parent.file) return parent.file;
    return parent.getFile({ attributes });
  }

}
