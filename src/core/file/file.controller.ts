import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common';
import { FileService } from './services/file.service';
import { FilesystemService } from '../../filesystem/filesystem.service';
import * as Express from 'express';

@Controller('file')
export class FileController {
  constructor(
    private fileService: FileService,
    private filesystemService: FilesystemService
  ) {}

  @Get(':sha*')
  async getFileBySha(@Param('sha') contentSha256: string, @Res() res: Express.Response) {
    const file = await this.fileService.findOne({ contentSha256 });
    if (!file) throw new NotFoundException();
    try {
      const stream = this.filesystemService.createReadableStream(file.filesystemKey);
      res.writeHead(200, {
        'Content-Type': file.contentType,
        'Accept-Ranges': 'bytes',
        'Content-disposition': `inline; filename=${file.name}.${file.extension || 'txt'}`
      })
      stream.pipe(res);
    } catch (e) {
      console.log(e);
      res.sendStatus(400);
    }
  }

}
