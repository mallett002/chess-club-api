import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import config from 'config';
import http from 'http';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import ws from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';

import { resolvers } from './src/resolvers/resolver-map';
import { typeDefs } from './src/schema';
import { applyServerRoutes } from './src/controllers';

const apolloConfig = config.get('apollo');
const port = config.get('port');

async function startServer(typeDefs, resolvers) {
  const app = express();

  app.use(express.json());

  applyServerRoutes(app);

  const httpServer = http.createServer(app);
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    introspection: apolloConfig.introspection
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
    path: '/graphql'
  });

  const server = httpServer.listen(port, () => {
    const wsServer = new ws.Server({
      server,
      path: '/graphql',
    });

    useServer({ schema: typeDefs }, wsServer);
  });

  console.log(`🚀 Server ready at http://localhost:${port}${apolloServer.graphqlPath}`);
}

startServer(typeDefs, resolvers);
