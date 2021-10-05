import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import config from 'config';
import bodyParser from 'body-parser';
import http from 'http';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import ws from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';

import ChessClubDatabase from './src/repository/chess-club-database';
import { resolvers } from './src/resolvers/resolver-map';
import { typeDefs } from './src/schema';

const knexConfig = {
  client: 'pg',
  connection: config.get('chess_club_db')
};
const apolloConfig = config.get('apollo');
const port = config.get('port');

const chessClubDatabase = new ChessClubDatabase(knexConfig);

async function startApolloServer(typeDefs, resolvers) {
  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    dataSources: () => ({ chessClubDatabase }),
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    introspection: apolloConfig.introspection
  });

  await server.start();

  server.applyMiddleware({
     app,
     path: '/graphql'
  });

  await Promise.resolve(httpServer.listen({ port: 4000 }));

  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startApolloServer(typeDefs, resolvers);

// old stuff:
// const app = express();

// app.use('/graphql', bodyParser.json());

// const knexConfig = {
//   client: 'pg',
//   connection: config.get('chess_club_db')
// };
// const apolloConfig = config.get('apollo');
// const port = config.get('port');

// const chessClubDatabase = new ChessClubDatabase(knexConfig);

// let apolloServer = null;

// async function startApolloServer() {
//   apolloServer = new ApolloServer({
//     resolvers,
//     schema: typeDefs,
//     dataSources: () => ({ chessClubDatabase }),
//     introspection: apolloConfig.introspection
//   });

//   await apolloServer.start();

//   apolloServer.applyMiddleware({ app });
// }

// startApolloServer();

// // const server = createServer(app);

// const httpServer = app.listen(port, () => {
//   const wsServer = new ws.Server({
//     server: app,
//     path: '/graphql',
//   });

//   useServer({ schema: typeDefs }, wsServer);

//   console.log("GraphQL server listening on port %s", port);
// });
