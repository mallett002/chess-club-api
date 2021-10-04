import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import config from 'config';
import bodyParser from 'body-parser';
import { createServer } from 'http';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';

import ChessClubDatabase from './src/repository/chess-club-database';
import { resolvers } from './src/resolvers/resolver-map';
import { typeDefs } from './src/schema';

const app = express();

app.use('/graphql', bodyParser.json());

const knexConfig = {
  client: 'pg',
  connection: config.get('chess_club_db')
};
const apolloConfig = config.get('apollo');
const port = config.get('port');

const chessClubDatabase = new ChessClubDatabase(knexConfig);

const apolloServer = new ApolloServer({
  resolvers,
  typeDefs,
  dataSources: () => ({ chessClubDatabase }),
  introspection: apolloConfig.introspection
});

apolloServer.applyMiddleware({ app });

const server = createServer(app);

server.listen(port, () => {
    new SubscriptionServer({
      execute,
      subscribe,
      schema: typeDefs,
    }, {
      server,
      path: '/subscriptions',
    });
});
