import { Module } from '@nestjs/common';
import { LoadStudyMaterialService } from './load-study-material.service';
import { FilesystemModule } from '../../filesystem/filesystem.module';
import { FileModule } from '../../core/file/file.module';
import { LoadStudyMaterialResolver } from './load-study-material.resolver';
import { StudyMaterialModule } from '../../core/study-material/study-material.module';

@Module({
  imports: [FilesystemModule, FileModule, StudyMaterialModule],
  providers: [LoadStudyMaterialService, LoadStudyMaterialResolver]
})
export class LoadStudyMaterialModule {}
