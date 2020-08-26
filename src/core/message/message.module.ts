import { Module } from '@nestjs/common';
import { MessageResolver } from './resolvers/message.resolver';
import { MassiveMessageResolver } from './resolvers/massive-message.resolver';
import { MassiveMessageRequestResolver } from './resolvers/massive-message-request.resolver';
import { SequelizeModule } from '@nestjs/sequelize';
import { Message } from './models/message.model';
import { MassiveMessage } from './models/massive-message.model';
import { MassiveMessageRequest } from './models/massive-message-request.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Message,
      MassiveMessage,
      MassiveMessageRequest
    ])
  ],
  providers: [
    MessageResolver,
    MassiveMessageResolver,
    MassiveMessageRequestResolver
  ],
  exports: [SequelizeModule]
})
export class MessageModule {}
