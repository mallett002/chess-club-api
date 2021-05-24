import { ApolloServer } from 'apollo-server';

import { environment } from './environment';
import { resolvers } from './resolvers';
import { typeDefs } from './schema';

const server = new ApolloServer({
  resolvers,
  typeDefs,
  introspection: environment.apollo.introspection,
  playground: environment.apollo.playground,
});

server.listen({ port: environment.port }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
