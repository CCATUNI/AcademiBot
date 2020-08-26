import { ConfigModule } from '@nestjs/config';
import S3Config from './s3.config';
import * as Joi from '@hapi/joi';

export const FilesystemConfigModule = ConfigModule.forRoot({
  load: [S3Config],
  validationSchema: Joi.object({
    AWS_ACCESS_KEY: Joi.string(),
    AWS_SECRET_ACCESS_KEY: Joi.string(),
    AWS_REGION: Joi.string().default('us-east-1'),
    AWS_S3_BUCKET: Joi.string(),
    AWS_S3_USER_FOLDER: Joi.string().default('users'),
    AWS_S3_MATERIAL_FOLDER: Joi.string().default('files')
  })
})