// For production PubSub: https://www.apollographql.com/docs/apollo-server/data/subscriptions/#production-pubsub-libraries
import { PubSub } from 'apollo-server';
import { books } from './books';

const pubsub = new PubSub();
const BOOK_ADDED = 'BOOK_ADDED';

export const resolvers = {
  Query: {
    books: () => books,
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator([BOOK_ADDED])
    }
  }
};
