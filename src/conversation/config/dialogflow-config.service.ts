import { Inject, Injectable } from '@nestjs/common';
import DialogflowConfig from './dialogflow.config';
import { ConfigType } from '@nestjs/config';
import * as fs from 'fs';
import appConfig from '../../config/app.config';

@Injectable()
export class DialogflowConfigService {
  constructor(
    @Inject(DialogflowConfig.KEY)
    private readonly conversationConfig: ConfigType<typeof DialogflowConfig>,
    @Inject(appConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof appConfig>
  ) {
    let { path, json } = this.conversationConfig;
    if (JSON.stringify(json) != '{}') {
      fs.writeFileSync(path, JSON.stringify(json));
    }
    if (!this.appConfiguration.production) {
      console.log('DIALOGFLOW CONFIGURATION');
      console.table({...this.conversationConfig, json: JSON.stringify(json).substr(0, 30)+'...'});
    }


  }

  getConfiguration() {
    return this.conversationConfig;
  }

}

