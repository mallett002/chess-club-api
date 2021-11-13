import { AuthenticationError, ValidationError } from 'apollo-server-express';
import { IToken } from '../interfaces/account';
import { verifyToken } from '../services/accounts/token-service';

import { deleteGame } from '../services/games';

export default (_, args, context: IToken): Promise<string> => {
  const claims = verifyToken(context);

  if (!claims) {
    throw new AuthenticationError('You must be logged in.');
  }

  if (!args.gameId) {
    throw new ValidationError('missing value for gameId');    
  }

  return deleteGame(args.gameId);
};
