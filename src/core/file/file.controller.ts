import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { FileService } from './services/file.service';
import { FilesystemService } from '../../filesystem/filesystem.service';

@Controller('file')
export class FileController {
  constructor(
    private fileService: FileService,
    private filesystemService: FilesystemService
  ) {}

  @Get(':sha/:name')
  async getFileBySha(@Param('sha') contentSha256: string,  @Param('name') name: string) {
    const file = await this.fileService.findOne({ contentSha256 });
    if (!file) throw new NotFoundException();
    const buffer = await this.filesystemService.getObject(file.filesystemKey);
    return buffer.Body;
  }

}
