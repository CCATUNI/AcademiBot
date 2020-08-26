import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SequelizeConfigService } from './config/sequelize-config.service';
import { SequelizeConfigModule } from './config/sequelize-config.module';
import { DatabaseConfigModule } from './config/database-config.module';

@Module({
  imports: [
    DatabaseConfigModule,
    SequelizeConfigModule,
    SequelizeModule.forRootAsync({
      imports: [DatabaseConfigModule, SequelizeConfigModule],
      useExisting: SequelizeConfigService,
    })
  ],
  providers: [SequelizeConfigService]
})
export class DatabaseModule {}
