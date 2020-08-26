import { Module } from '@nestjs/common';
import { ChannelConfigModule } from './channel-config.module';
import { FacebookConfigService } from './facebook-config.service';

@Module({
  imports: [ChannelConfigModule],
  providers: [FacebookConfigService],
  exports: [FacebookConfigService]
})
export class FacebookConfigModule {}