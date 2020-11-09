import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import * as responseCachePlugin from 'apollo-server-plugin-response-cache';
import { microserviceOptions } from '../microservices.constants';

@Module({
  imports: [
    GraphQLModule.forRoot({
      playground: microserviceOptions.graphqlApi,
      installSubscriptionHandlers: true,
      autoSchemaFile: 'schema.graphql',
      sortSchema: true,
      cacheControl: {
        defaultMaxAge: 120
      },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      plugins: [responseCachePlugin()],
    })
  ]
})
export class GraphqlModule {}
