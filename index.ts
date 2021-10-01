import { ApolloServer } from 'apollo-server';
import config from 'config';

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

const server = new ApolloServer({
  resolvers,
  typeDefs,
  dataSources: () => ({ chessClubDatabase }),
  introspection: apolloConfig.introspection,
  playground: apolloConfig.playground,
});

server.listen({ port }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
