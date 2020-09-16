import 'multer';
import { BadRequestException, Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AssignFileDto, UploadFileBodyDto } from './uploads.dto';
import { UploadsService } from './uploads.service';
import { Express } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Controller('uploads')
export class UploadsController {
  constructor(private uploadsService: UploadsService) {}

  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Body() body: { data: string, prefix: string }) {
    const createFilesDto = plainToClass(UploadFileBodyDto, { data: JSON.parse(body.data) });
    const errors = await validate(createFilesDto);
    if (errors.length) {
      console.log(errors.map(v => v.toString()));
      throw new BadRequestException(errors.map(v => v.toString()));
    }
    return this.uploadsService.loadOne(file.buffer, createFilesDto.data, body.prefix);
  }

  @Post('assign')
  assignFile(@Body() assignDto: AssignFileDto[]) {
    return this.uploadsService.assignFiles(assignDto);
  }

}
