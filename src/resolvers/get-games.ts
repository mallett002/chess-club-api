import { AuthenticationError } from 'apollo-server-core';
import { IToken } from '../interfaces/account';
import { IGame } from '../interfaces/game';
import { verifyToken } from '../services/accounts/token-service';
import { getGamesByPlayerId } from '../services/games';

export default (_, { playerId }, context: IToken): Promise<IGame[]> => {
  const claims = verifyToken(context);

  if (!claims) {
    throw new AuthenticationError('You must be logged in.');
  }
  
  // todo: what if the player has no games? Return null? Handled?
  return getGamesByPlayerId(playerId);
};
