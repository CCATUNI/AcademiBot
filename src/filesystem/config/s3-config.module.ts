import { Module } from '@nestjs/common';
import { FilesystemConfigModule } from './filesystem-config.module';
import { S3ConfigService } from './s3-config.service';

@Module({
  imports: [FilesystemConfigModule],
  providers: [S3ConfigService],
  exports: [S3ConfigService]
})
export class S3ConfigModule {}