import { Module } from '@nestjs/common';
import { FilesystemService } from './filesystem.service';
import { S3ConfigModule } from './config/s3-config.module';
import { FileLoaderService } from './file-loader.service';

@Module({
  imports: [S3ConfigModule],
  providers: [FilesystemService, FileLoaderService],
  exports: [FileLoaderService, FilesystemService]
})
export class FilesystemModule {

}
