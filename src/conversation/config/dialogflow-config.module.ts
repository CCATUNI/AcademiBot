import { Module } from '@nestjs/common';
import { ConversationConfigModule } from './conversation-config.module';
import { DialogflowConfigService } from './dialogflow-config.service';

@Module({
  imports: [ConversationConfigModule],
  providers: [DialogflowConfigService],
  exports: [DialogflowConfigService]
})
export class DialogflowConfigModule {}