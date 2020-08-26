import { Module } from '@nestjs/common';
import { FileSyncService } from './file-sync.service';
import { FileModule } from '../../core/file/file.module';
import { FacebookModule } from '../../facebook/facebook.module';
import { FilesystemModule } from '../../filesystem/filesystem.module';

@Module({
  imports: [FileModule, FacebookModule, FilesystemModule],
  providers: [FileSyncService],
  exports: [FileSyncService]
})
export class FileSyncModule {}
