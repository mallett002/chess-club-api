// Todo: going through this: https://www.apollographql.com/docs/apollo-server/data/subscriptions
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
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

const apolloConfig = config.get('apollo');
const port = config.get('port');

async function startServer(typeDefs, resolvers) {
  // 4. Create graqhql schema
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const app = express();

  app.use(passport.initialize());
  configureAuthStrategies();
  app.use(express.json());
  applyServerRoutes(app);

  // 3. create http server
  const httpServer = http.createServer(app);
  

  // Creating the WebSocket server:
  const wsServer = new WebSocketServer({
    // This is the `httpServer` we created in a previous step.
    server: httpServer,
    // Pass a different path here if your ApolloServer serves at
    // a different path.
    path: '/graphql',
  });

  // Hand in the schema we just created and have the
  // WebSocketServer start listening.
  const serverCleanup = useServer({ schema }, wsServer);

  
  const apolloServer = new ApolloServer({
    context: createContext,
    schema,
    plugins: [
      // Proper shutdown for the HTTP server:
      ApolloServerPluginDrainHttpServer({ httpServer }),
      // Proper shutdown for the WebSocket server:
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

  apolloServer.applyMiddleware({
    app
    // path: '/graphql'
  });


  // const server = httpServer.listen(port, () => {
  //   const wsServer = new ws.Server({
  //     server,
  //     path: '/graphql',
  //   });

  //   useServer({ schema: typeDefs }, wsServer);
  // });
  httpServer.listen(port, () => {
    console.log(
      `🚀 Server is now running on http://localhost:${port}${apolloServer.graphqlPath}`,
    );
  });
}

startServer(typeDefs, resolvers);
