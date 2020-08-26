import { Inject, Injectable } from '@nestjs/common';
import S3Config from './s3.config';
import { ConfigType } from '@nestjs/config';
import appConfig from '../../config/app.config';

@Injectable()
export class S3ConfigService {
  constructor(
    @Inject(S3Config.KEY)
    private readonly filesystemConfig: ConfigType<typeof S3Config>,
    @Inject(appConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof appConfig>
  ) {
    if (!this.appConfiguration.production) {
      console.log('S3 CONFIGURATION');
      console.table(this.filesystemConfig);
    }
  }

  getConfiguration() {
    return this.filesystemConfig;
  }

}