import { Injectable } from '@nestjs/common';
import { FileLoaderService } from '../../filesystem/file-loader.service';
import { FileService } from '../../core/file/services/file.service';
import { parse } from '@fast-csv/parse';
import { StudyMaterialService } from '../../core/study-material/services/study-material.service';
import * as fs from 'fs';

type RawRow = {
  courseId: string;
  activityTypeId: string;
  name: string;
  page: number;
  url: string;
  sizeInBytes: number;
  universityId: string;
  typeId: string;
}

@Injectable()
export class LoadStudyMaterialService {
  constructor(
    private fileService: FileService,
    private fileLoaderService: FileLoaderService,
    private studyMaterialService: StudyMaterialService
  ) {}

  async loadOne(url: string, prefix: string) {
    const createFileDto = await this.fileLoaderService.loadFromUrl(url, prefix);
    return this.fileService.create(createFileDto);
  }

  async loadMany(route: string, prefix: string) {
    const finds = [];
    const stream = fs.createReadStream(route);
    const csvParserStream = parse<RawRow, RawRow>({ headers: true })
    .on('data', (row: RawRow) => {
      finds.push(row);
    })
      .on('end', async () => {
        const fails = [];
        while (finds.length) {
          await Promise.all(finds.splice(0, 25).map(async row => {
            try {
              const createDto = await this.fileLoaderService.loadFromUrl(row.url, prefix);
              const file = await this.fileService.create(createDto);
              const find = {
                activityTypeId: row.activityTypeId,
                courseId: row.courseId,
                universityId: row.universityId,
                name: row.name
              }
              let material = await this.studyMaterialService.findOne(find);
              if (!material) {
                try {
                  material = await this.studyMaterialService.create(row);
                } catch (e) {
                  material = await this.studyMaterialService.findOne(find);
                  fails.push(find);
                }
              }
              await material.createFile({
                fileId: file.id,
                studyMaterialId: material.id,
                page: row.page
              });
            } catch (e) {
              console.error(e);
            }
          }))
        }
        console.log('FINISH!')
        console.table(fails);
      });
    stream.pipe(csvParserStream);
    return { success: true };
  }

}
