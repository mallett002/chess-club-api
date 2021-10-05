import  { withFilter } from 'graphql-subscriptions';

import createGame from './create-game';
import getGames from './get-games';
import updateBoard from './update-board';
import getBoard from './get-board';
import { BOARD_UPDATED } from '../constants';
import { getPubSub } from '../services/pub-sub';

export const resolvers = {
  Query: {
    getBoard,
    getGames
  },
  Mutation: {
    createGame,
    updateBoard
  },
  Subscription: {
    boardUpdated: {
      subscribe: withFilter(
        () => {
          const pubSub = getPubSub();
  
          return pubSub.asyncIterator([BOARD_UPDATED])
        },
        (payload, variables) => payload.boardUpdated.gameId === variables.gameId
      )
    }
  }
};
