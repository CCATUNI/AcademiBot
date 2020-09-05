import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { FileService } from './services/file.service';
import { FilesystemService } from '../../filesystem/filesystem.service';

@Controller('file')
export class FileController {
  constructor(
    private fileService: FileService,
    private filesystemService: FilesystemService
  ) {}

  @Get(':sha/:name')
  async getFileBySha(@Param('sha') contentSha256: string,  @Param('name') name: string, @Res() res: Response) {
    const file = await this.fileService.findOne({ contentSha256 });
    if (!file) throw new NotFoundException();
    const stream = this.filesystemService.createReadableStream(file.filesystemKey);
    stream.pipe(res);
  }

}
