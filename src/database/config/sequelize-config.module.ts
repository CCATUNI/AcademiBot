import { Module } from '@nestjs/common';
import { SequelizeConfigService } from './sequelize-config.service';
import { DatabaseConfigModule } from './database-config.module';

@Module({
  imports: [DatabaseConfigModule],
  providers: [SequelizeConfigService],
  exports: [SequelizeConfigService]
})
export class SequelizeConfigModule {}