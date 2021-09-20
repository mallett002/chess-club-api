import { ApolloServer } from 'apollo-server';

import ChessClubDatabase from './src/repository/chess-club-database';
import { env } from './environment';
import { resolvers } from './src/resolvers/resolver-map';
import { typeDefs } from './src/schema';

const knexConfig = {
  client: 'pg',
  connection: {
    database: 'chess-club-api',
    host : env.postgresHost,
    password: 'chess_club_api_ps',
    port: 5432,
    user: 'chess_club_api'
  }
};

const chessClubDatabase = new ChessClubDatabase(knexConfig);

const server = new ApolloServer({
  resolvers,
  typeDefs,
  dataSources: () => ({ chessClubDatabase }),
  introspection: env.apollo.introspection,
  playground: env.apollo.playground,
});

server.listen({ port: env.port }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
