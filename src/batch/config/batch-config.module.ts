import { ConfigModule } from '@nestjs/config';
import BatchConfig from './batch.config';
import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { BatchConfigService } from './batch-config.service';


@Module({
  imports: [ConfigModule.forRoot({
    load: [BatchConfig],
    validationSchema: Joi.object({
      BATCH_DATABASE_BACKUP: Joi.string(),//.default('0 0 3 * * *'),
      BATCH_FILE_SYNC: Joi.string()
    })
  })],
  providers: [BatchConfigService],
  exports: [BatchConfigService]
})
export class BatchConfigModule {}