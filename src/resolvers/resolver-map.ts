import createGame from './create-game';
import createPlayer from './create-player';
import getGames from './get-games';
import updateBoard from './update-board';
import loadGame from './load-game';
import getBoard from './get-board';
import endGame from './end-game';
import createInvitation from './create-invitation';
import deleteInvitation from './delete-invitation';
import getInvitations from './get-invitations';
import boardUpdatedSubscription from '../subscriptions/board-updated';

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
      subscribe: boardUpdatedSubscription
    }
  }
};
