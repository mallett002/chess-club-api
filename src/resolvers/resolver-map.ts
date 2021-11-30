import  { withFilter } from 'graphql-subscriptions';

import createGame from './create-game';
import createPlayer from './create-player';
import getGames from './get-games';
import updateBoard from './update-board';
import loadGame from './load-game';
import getBoard from './get-board';
import { BOARD_UPDATED } from '../constants';
import { getPubSub } from '../services/pub-sub';
import endGame from './end-game';
import createInvitation from './create-invitation';

export const resolvers = {
  Query: {
    getBoard,
    getGames
  },
  Mutation: {
    createGame,
    createPlayer,
    endGame,
    loadGame,
    updateBoard,
    createInvitation
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
