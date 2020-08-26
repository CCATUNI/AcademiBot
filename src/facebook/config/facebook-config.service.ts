import { Inject, Injectable } from '@nestjs/common';
import FacebookConfig from './facebook.config';
import appConfig from '../../config/app.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class FacebookConfigService {
  constructor(
    @Inject(FacebookConfig.KEY)
    private readonly facebookConfig: ConfigType<typeof FacebookConfig>,
    @Inject(appConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof appConfig>
  ) {
    if (!this.appConfiguration.production) {
      console.log('FACEBOOK CONFIGURATION');
      console.table(this.facebookConfig);
    }
  }

  getConfiguration() {
    return this.facebookConfig;
  }
}