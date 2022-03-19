// Todo: going through this: https://www.apollographql.com/docs/apollo-server/data/subscriptions
import express from 'express';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import config from 'config';
import http from 'http';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import passport from 'passport';
import { makeExecutableSchema } from '@graphql-tools/schema';

import { createContext } from './server-helpers';
import { resolvers } from './src/resolvers/resolver-map';
import { typeDefs } from './src/schema';
import { applyServerRoutes } from './src/controllers';
import { configureAuthStrategies } from './src/services/accounts/auth-strategies';
import { verifyJwt } from './src/services/accounts/token-service';

const apolloConfig = config.get('apollo');
const port = config.get('port');

async function startServer(typeDefs, resolvers) {
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const app = express();

  app.use(passport.initialize());
  configureAuthStrategies();
  app.use(express.json());
  applyServerRoutes(app);

  const httpServer = http.createServer(app);
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });
  const serverCleanup = useServer({ 
    schema,
    onConnect: async (ctx) => {
      console.log('Connected to socket in server!');
      console.log({connectionParams: ctx.connectionParams});
      if (!verifyJwt(ctx.connectionParams)) {
        console.log('Jwt not valid!!!!');

        throw new AuthenticationError('You must be logged in.');
      }
      console.log('Seemed to be fine....');
      
    }
   }, wsServer);

  const apolloServer = new ApolloServer({
    context: createContext,
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
    introspection: apolloConfig.introspection
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({ app });

  httpServer.listen(port, () => {
    console.log(
      `🚀 Server is now running on http://localhost:${port}${apolloServer.graphqlPath}`,
    );
  });
}

startServer(typeDefs, resolvers);
