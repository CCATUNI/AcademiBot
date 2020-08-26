import { Inject, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as Joi from '@hapi/joi';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { CoreModule } from './core/core.module';
import { GraphqlModule } from './graphql/graphql.module';
import { ConversationModule } from './conversation/conversation.module';
import { FilesystemModule } from './filesystem/filesystem.module';
import { FacebookModule } from './facebook/facebook.module';
import { BatchModule } from './batch/batch.module';
import appConfig from './config/app.config';


@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().case('lower')
          .valid('development', 'production', 'testing')
          .default('development'),
        PORT: Joi.number().default(3000),
        TZ: Joi.string().default('America/Bogota')
      }),
    }),
    DatabaseModule,
    CoreModule,
    GraphqlModule,
    ConversationModule,
    FilesystemModule,
    FacebookModule,
    BatchModule,
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
