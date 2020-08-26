import { ConfigModule } from '@nestjs/config';
import FacebookConfig from './facebook.config';
import * as Joi from '@hapi/joi';

export const ChannelConfigModule = ConfigModule.forRoot({
  load: [FacebookConfig],
  validationSchema: Joi.object({
    FACEBOOK_TOKEN: Joi.string(),
    FACEBOOK_API_VERSION: Joi.string().default('5.0'),
    FACEBOOK_TIMEOUT_FOR_ATTACHMENTS: Joi.string().alphanum().default('200'),
    FACEBOOK_QUICK_REPLIES_LIMIT: Joi.string().alphanum().default('10'),
    FACEBOOK_CARDS_LIMIT: Joi.string().alphanum().default('10'),
    FACEBOOK_CARDS_BUTTONS_LIMIT: Joi.string().alphanum().default('3'),
    FACEBOOK_VERIFY_TOKEN: Joi.string(),
    WELCOME_FILE_KEY: Joi.string().default('media/welcome.png'),
    MEME_FOLDER: Joi.string().default('media/memes/')
  })
})