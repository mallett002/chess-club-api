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
import deleteInvitation from './delete-invitation';
import getInvitations from './get-invitations';

export const resolvers = {
  Query: {
    getBoard,
    getGames,
    getInvitations
  },
  Mutation: {
    createGame,
    createPlayer,
    endGame,
    loadGame,
    updateBoard,
    createInvitation,
    deleteInvitation
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
