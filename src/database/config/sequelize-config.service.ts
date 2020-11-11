import { SequelizeModuleOptions, SequelizeOptionsFactory } from '@nestjs/sequelize';
import { Inject, Injectable } from '@nestjs/common';
import SequelizeConfig from './sequelize.config';
import { ConfigType } from '@nestjs/config';
import { Dialect } from 'sequelize';
import appConfig from '../../config/app.config';

@Injectable()
export class SequelizeConfigService implements SequelizeOptionsFactory {
  constructor(
    @Inject(SequelizeConfig.KEY)
    private readonly databaseConfiguration: ConfigType<typeof SequelizeConfig>,
    @Inject(appConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof appConfig>
  ) {}

  createSequelizeOptions(): SequelizeModuleOptions {
    if (!this.appConfiguration.production) {
      console.log("DATABASE CONFIGURATION");
      console.table(this.databaseConfiguration);
    }
    return {
      ...this.databaseConfiguration,
      dialect: this.databaseConfiguration.dialect as Dialect,
      autoLoadModels: true,
      synchronize: false,
      benchmark: true,
      pool: {
        min: 2
      },
      logQueryParameters: true,
      dialectOptions: {
        dateStrings: true,
        typeCast: true,
        useUTC: false,
      }
    };
  }

}
