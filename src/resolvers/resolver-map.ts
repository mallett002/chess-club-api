import createGame from './create-game';
import updateBoard from './update-board';
import { BOARD_UPDATED } from '../constants';
import { getPubSub } from '../services/pub-sub';

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
  Subscription: {
    // bookAdded: {
    //   subscribe: () => pubsub.asyncIterator([BOOK_ADDED])
    // }
    boardUpdated: {
      subscribe: () => {
        const pubSub = getPubSub();

        return pubSub.asyncIterator([BOARD_UPDATED])
      }
    }
  }
};
