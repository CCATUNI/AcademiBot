import { Module } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import { FilesystemModule } from '../filesystem/filesystem.module';
import { FileModule } from '../core/file/file.module';
import { StudyMaterialModule } from '../core/study-material/study-material.module';

@Module({
  imports: [FilesystemModule, FileModule, StudyMaterialModule],
  providers: [UploadsService],
  controllers: [UploadsController]
})
export class UploadsModule {}
