import { Module } from '@nestjs/common';
import { BatchService } from './batch.service';
import { DatabaseBackupModule } from './database-backup/database-backup.module';
import { FileSyncModule } from './file-sync/file-sync.module';
import { LoadStudyMaterialModule } from './load-study-material/load-study-material.module';
import { BatchConfigModule } from './config/batch-config.module';
import { UserAccountSyncModule } from './user-account-sync/user-account-sync.module';

@Module({
  imports: [DatabaseBackupModule, FileSyncModule, LoadStudyMaterialModule, BatchConfigModule, UserAccountSyncModule],
  providers: [BatchService]
})
export class BatchModule {}
