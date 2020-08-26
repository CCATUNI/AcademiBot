import { ConfigModule } from '@nestjs/config';
import SequelizeConfig from './sequelize.config';
import * as Joi from '@hapi/joi';

export const DatabaseConfigModule = ConfigModule.forRoot({
  load: [SequelizeConfig],
  validationSchema: Joi.object({
    DATABASE_PORT: Joi.number().default(5432),
    DATABASE_DIALECT: Joi.string().valid('mysql', 'mariadb', 'postgres', 'mssql', 'sqlite').required(),
    DATABASE_HOST: Joi.string(),
    DATABASE_NAME: Joi.string(),
    DATABASE_USERNAME: Joi.string(),
    DATABASE_PASSWORD: Joi.string(),
    DATABASE_TIMEZONE: Joi.string().default('America/Lima'),
    DATABASE_SCHEMA: Joi.string().default('public')
  })
});
