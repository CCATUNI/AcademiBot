import { Injectable } from '@nestjs/common';
import { FileLoaderService } from '../filesystem/file-loader.service';
import { StudyMaterialService } from '../core/study-material/services/study-material.service';
import { uploadConstants } from './uploads.constants';
import { FileService } from '../core/file/services/file.service';
import { FilesystemService } from '../filesystem/filesystem.service';
import { AssignFileDto, UploadFileBodyDto } from './uploads.dto';

@Injectable()
export class UploadsService {
  constructor(
    private studyMaterialService: StudyMaterialService,
    private fileLoaderService: FileLoaderService,
    private fileService: FileService,
    private filesystemService: FilesystemService
  ) {}

  async loadMedia(buffer: Buffer, prefix: string, name?: string) {
    const createFileDto = await this.fileLoaderService.loadOne(buffer, prefix);
    createFileDto.name = name;
    delete createFileDto.buffer;
    const file = await this.fileService.findOrCreate(createFileDto);
    await this.filesystemService.createObject(createFileDto.filesystemKey, {
      Body: buffer,
      ContentLength: createFileDto.sizeInBytes,
      ContentType: createFileDto.contentType
    });
    return file;
  }

  async loadOne(buffer: Buffer, uploadFileBodyDto: UploadFileBodyDto, prefix = uploadConstants.folder) {
    const createStudyMaterialsDto = uploadFileBodyDto.data;
    const createFileDto = await this.fileLoaderService.loadOne(buffer, prefix);
    createFileDto.name = uploadFileBodyDto.name;
    delete createFileDto.buffer;
    const file = await this.fileService.findOrCreate(createFileDto);
    await this.filesystemService.createObject(createFileDto.filesystemKey, {
      Body: buffer,
      ContentLength: createFileDto.sizeInBytes,
      ContentType: createFileDto.contentType
    });
    return Promise.all(createStudyMaterialsDto.map(async v => {
      const { page } = v;
      delete v.page;
      const studyMaterial = await this.studyMaterialService.findOneOrCreate(v);
      return studyMaterial.createFile({
        fileId: file.id,
        studyMaterialId: studyMaterial.id,
        page
      })
    }))
  }

  async assignFiles(assignFilesDto: AssignFileDto[]) {
    return Promise.all(assignFilesDto.map(async v => {
      const { fileId, page } = v;
      delete v.fileId;
      delete v.page;
      const studyMaterial = await this.studyMaterialService.findOneOrCreate(v);
      return studyMaterial.createFile({
        fileId,
        studyMaterialId: studyMaterial.id,
        page
      })
    }))
  }


}
