// For production PubSub: https://www.apollographql.com/docs/apollo-server/data/subscriptions/#production-pubsub-libraries
import { PubSub } from 'apollo-server';
import createGame from './create-game';
import updateBoard from './update-board';

const pubsub = new PubSub();
// const BOOK_ADDED = 'BOOK_ADDED';

export const resolvers = {
  Query: {
    getGame: () => null,
  },
  Mutation: {
    // updateBoard: (parent, args, context) => {
    //   const { author, title } = args;
    //   const newBook = { author, title };

    //   pubsub.publish(BOOK_ADDED, { bookAdded: newBook });
    //   books.push(newBook);

    //   return newBook;
    // }
    createGame,
    updateBoard
  },
  // Subscription: {
  //   // bookAdded: {
  //   //   subscribe: () => pubsub.asyncIterator([BOOK_ADDED])
  //   // }
  // }
};
