import { DynamicModule, Module } from '@nestjs/common';
import { GraphqlModule } from './graphql/graphql.module';
import { ConversationModule } from './conversation/conversation.module';
import { FacebookModule } from './facebook/facebook.module';
import { BatchModule } from './batch/batch.module';

@Module({})
export class MicroservicesModule {
  static forRoot(): DynamicModule {
    if (!process.env.MICROSERVICES_ENABLE) {
      return {
        module: MicroservicesModule,
        imports: [
          GraphqlModule,
          ConversationModule,
          FacebookModule,
          BatchModule
        ]
      }
    }
    const out: DynamicModule = {
      module: MicroservicesModule,
      imports: [],
      exports: []
    }
    if (process.env.MICROSERVICES_GRAPHQL) {
      out.imports.push(GraphqlModule)
    }
    if (process.env.MICROSERVICES_CONVERSATION) {
      out.imports.push(ConversationModule)
    }
    if (process.env.MICROSERVICES_FACEBOOK) {
      out.imports.push(FacebookModule)
    }
    if (process.env.MICROSERVICES_BATCH) {
      out.imports.push(BatchModule)
    }
    out.exports = out.imports;
    return out;
  }
}
