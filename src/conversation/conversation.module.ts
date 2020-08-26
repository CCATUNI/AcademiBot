import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { DialogflowConfigModule } from './config/dialogflow-config.module';

@Module({
  imports: [DialogflowConfigModule],
  providers: [ConversationService],
  exports: [ConversationService]
})
export class ConversationModule {}
