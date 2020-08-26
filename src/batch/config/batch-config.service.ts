import { Inject, Injectable } from '@nestjs/common';
import BatchConfig from './batch.config';
import { ConfigType } from '@nestjs/config';
import appConfig from '../../config/app.config';

@Injectable()
export class BatchConfigService {
  constructor(
    @Inject(BatchConfig.KEY)
    private readonly batchConfig: ConfigType<typeof BatchConfig>,
    @Inject(appConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof appConfig>
  ) {
    if (!this.appConfiguration.production) {
      console.log("BATCH CONFIGURATION");
      console.table(this.batchConfig);
    }
  }
  getConfiguration() {
    return this.batchConfig;
  }
}