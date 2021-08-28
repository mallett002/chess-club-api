import { ApolloServer } from 'apollo-server';

import ChessClubDatabase from './src/repository/games';
import { env } from './environment';
import { resolvers } from './src/resolvers/resolver-map';
import { typeDefs } from './src/schema';

// const knexConfig = {
//   client: 'pg',
//   connection: {
//     database: 'chess-club-api',
//     host : 'localhost',
//     password: 'chess_club_api_ps',
//     port: 5432,
//     user: 'chess_club_api'
//   }
// };

// const db = new ChessClubDatabase(knexConfig);

const server = new ApolloServer({
  resolvers,
  typeDefs,
  // dataSources: () => ({ db }),
  introspection: env.apollo.introspection,
  playground: env.apollo.playground,
});

server.listen({ port: env.port }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
