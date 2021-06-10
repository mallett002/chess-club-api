import { ApolloServer } from 'apollo-server';

import { env } from './environment';
import { resolvers } from './resolvers';
import { typeDefs } from './schema';

const server = new ApolloServer({
  resolvers,
  typeDefs,
  introspection: env.apollo.introspection,
  playground: env.apollo.playground,
});

server.listen({ port: env.port }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
