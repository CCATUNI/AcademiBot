import { ConfigModule } from '@nestjs/config';
import SequelizeConfig from './sequelize.config';
import * as Joi from '@hapi/joi';

export const DatabaseConfigModule = ConfigModule.forRoot({
  load: [SequelizeConfig],
  validationSchema: Joi.object({
    DB_PORT: Joi.number().default(5432),
    DB_DIALECT: Joi.string().valid('mysql', 'mariadb', 'postgres', 'mssql', 'sqlite').required(),
    DB_HOST: Joi.string(),
    DB_NAME: Joi.string(),
    DB_USERNAME: Joi.string(),
    DB_PASSWORD: Joi.string(),
    DB_TIMEZONE: Joi.string().default('America/Lima'),
    DB_SCHEMA: Joi.string().default('public')
  })
});
