import { registerAs } from '@nestjs/config';

export default registerAs('batch', () => ({
  databaseBackup: process.env.BATCH_DATABASE_BACKUP,
  fileSync: process.env.BATCH_FILE_SYNC
}))