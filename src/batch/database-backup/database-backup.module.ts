import { Module } from '@nestjs/common';
import { DatabaseBackupService } from './database-backup.service';
import { FilesystemModule } from '../../filesystem/filesystem.module';
import { DatabaseConfigModule } from '../../database/config/database-config.module';

@Module({
  imports: [FilesystemModule, DatabaseConfigModule],
  providers: [DatabaseBackupService],
  exports: [DatabaseBackupService]
})
export class DatabaseBackupModule {}
