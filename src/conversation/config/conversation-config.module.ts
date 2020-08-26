import DialogflowConfig from './dialogflow.config';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';

export const ConversationConfigModule = ConfigModule.forRoot({
  load: [DialogflowConfig],
  validationSchema: Joi.object({
    GOOGLE_APPLICATION_CREDENTIALS: Joi.string().default('./dialogflowkey.json'),
    GOOGLE_DIALOGFLOW_JSON: Joi.string().default('{}'),
    GOOGLE_DIALOGFLOW_LANGUAGE: Joi.string().default('es')
  })
})