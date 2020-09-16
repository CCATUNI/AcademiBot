import { Inject, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as Joi from '@hapi/joi';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { CoreModule } from './core/core.module';
import { FilesystemModule } from './filesystem/filesystem.module';
import { MicroservicesModule } from './microservices.module';
import appConfig from './config/app.config';
import { microserviceOptions } from './microservices.constants';
import { UploadsModule } from './uploads/uploads.module';


@Module({
  imports: [
    MicroservicesModule.forRoot(microserviceOptions),
    ConfigModule.forRoot({
      load: [appConfig],
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().case('lower')
          .valid('development', 'production', 'testing')
          .default('development'),
        PORT: Joi.number().default(80),
        TZ: Joi.string().default('America/Bogota')
      }),
    }),
    DatabaseModule,
    CoreModule,
    FilesystemModule,
    UploadsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(
    @Inject(appConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof appConfig>
  ) {}
}
