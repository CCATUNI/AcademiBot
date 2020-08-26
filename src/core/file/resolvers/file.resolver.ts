import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { File } from '../models/file.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateFileDto, FindFileArgs, FindFilesArgs, UpdateFileDto } from '../dto/file.dto';
import { QueryFields } from '../../../common/decorators/query-fields.decorator';
import { QueryIncludes } from '../../../common/decorators/query-includes.decorator';
import { FileAccount } from '../models/file-account.model';
import { StudyFile } from '../../study-material/models/study-file.model';
import { CREATE_MUTATION_INPUT, UPDATE_MUTATION_INPUT } from '../../../config/constants';
import { FileService } from '../services/file.service';

@Resolver(of => File)
export class FileResolver {
  constructor(
    @InjectModel(File) private fileRepository: typeof File,
    private fileService: FileService
  ) {}

  @Query(returns => File)
  file(
    @Args() findArgs: FindFileArgs,
    @QueryFields(File) attributes: string[],
    @QueryIncludes(['accounts', 'studyFiles']) includes: boolean[]
  ) {
    if (!findArgs.id && !findArgs.filesystemKey) {
      throw new Error("Must query by at least one value.");
    }
    const include = [FileAccount, StudyFile].filter((v, i) => includes[i]);
    return this.fileService.findOne(findArgs, { attributes, include });
  }

  @Query(returns => [File])
  files(
    @Args() findArgs: FindFilesArgs,
    @QueryFields(File) attributes: string[],
    @QueryIncludes(['accounts', 'studyFiles']) includes: boolean[]
  ) {
    const include = [FileAccount, StudyFile].filter((v, i) => includes[i]);
    return this.fileService.findAll(findArgs, { attributes, include });
  }

  @ResolveField(returns => [FileAccount])
  accounts(
    @Parent() parent: File,
    @QueryFields(FileAccount) attributes: string[]
  ) {
    if (parent.accounts) return parent.accounts;
    return parent.getAccounts({ attributes });
  }

  @ResolveField(returns => [StudyFile])
  studyFiles(
    @Parent() parent: File,
    @QueryFields(StudyFile) attributes: string[]
  ) {
    if (parent.studyFiles) return parent.studyFiles;
    return parent.getStudyFiles({ attributes });
  }

  @Mutation(returns => File, { deprecationReason: "This query will be deprecated in production." })
  createFile(
    @Args(CREATE_MUTATION_INPUT) createDto: CreateFileDto
  ) {
    const fsKey = createDto.filesystemKey
    createDto.extension = fsKey.substr(fsKey.lastIndexOf('.')+1) || null;
    return this.fileRepository.create(createDto);
  }

  @Mutation(returns => File, { deprecationReason: "This query will be deprecated in production."})
  async updateFile(
    @Args() findArgs: FindFileArgs,
    @Args(UPDATE_MUTATION_INPUT) updateDto: UpdateFileDto
  ) {
    const paranoid = findArgs.paranoid;
    delete findArgs.paranoid;
    if (updateDto.filesystemKey) {
      const fsKey = updateDto.filesystemKey
      updateDto.extension = fsKey.substr(fsKey.lastIndexOf('.')+1) || null;
    }
    const options = { where: {...findArgs}, paranoid, limit: 1, returning: true };
    const [, [data]] = await this.fileRepository.update(updateDto, options);
    return data;
  }



}
