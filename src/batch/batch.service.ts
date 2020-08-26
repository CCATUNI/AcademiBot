import { Injectable } from '@nestjs/common';
import { DatabaseBackupService } from './database-backup/database-backup.service';
import { BatchConfigService } from './config/batch-config.service';
import { FileSyncService } from './file-sync/file-sync.service';

@Injectable()
export class BatchService {
  constructor(
    private batchConfigService: BatchConfigService,
    private databaseBackupService: DatabaseBackupService,
    private fileSyncService: FileSyncService
  ) {
    const options = this.batchConfigService.getConfiguration();
    const { databaseBackup, fileSync } = options;
    if (databaseBackup) {
      this.databaseBackupService.start(databaseBackup);
    }
    if (fileSync) {
      this.fileSyncService.start(fileSync);
    }
  }


}
