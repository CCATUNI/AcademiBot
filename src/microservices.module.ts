import { DynamicModule, Module } from '@nestjs/common';
import { GraphqlModule } from './graphql/graphql.module';
import { ConversationModule } from './conversation/conversation.module';
import { FacebookModule } from './facebook/facebook.module';
import { BatchModule } from './batch/batch.module';

@Module({})
export class MicroservicesModule {
  static forRoot(options: { [p: string]: boolean }): DynamicModule {
    const out: DynamicModule = {
      module: MicroservicesModule,
      imports: [
        FacebookModule,
        ConversationModule
      ]
    }
    if (options.graphqlApi) {
      out.imports.push(GraphqlModule)
    }
    if (options.batch) {
      out.imports.push(BatchModule)
    }
    out.exports = out.imports;
    return out;
  }
}
