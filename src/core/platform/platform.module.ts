import { Module } from '@nestjs/common';
import { PlatformResolver } from './resolvers/platform.resolver';
import { SequelizeModule } from '@nestjs/sequelize';
import { Platform } from './models/platform.model';
import { PlatformService } from './services/platform.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Platform,
    ])
  ],
  providers: [
    PlatformResolver,
    PlatformService
  ],
  exports: [SequelizeModule, PlatformService]
})
export class PlatformModule {}
