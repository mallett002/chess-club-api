import createGame from './create-game';
import updateBoard from './update-board';
import { BOARD_UPDATED } from '../constants';
import { getPubSub } from '../services/pub-sub';

export const resolvers = {
  Query: {
    getGame: () => null,
  },
  Mutation: {
    createGame,
    updateBoard
  },
  Subscription: {
    boardUpdated: {
      subscribe: () => {
        const pubSub = getPubSub();

        return pubSub.asyncIterator([BOARD_UPDATED])
      }
    }
  }
};
