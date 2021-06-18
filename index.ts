import { ApolloServer } from 'apollo-server';

import { env } from './environment';
import { resolvers } from './src/resolvers/resolver-map';
import { typeDefs } from './src/schema';

const server = new ApolloServer({
  resolvers,
  typeDefs,
  introspection: env.apollo.introspection,
  playground: env.apollo.playground,
});

server.listen({ port: env.port }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
