import { AuthenticationError, ValidationError } from 'apollo-server-express';
import { IToken } from '../interfaces/account';
import { IBoard } from '../interfaces/board';
import { verifyToken } from '../services/accounts/token-service';

import { createGame } from '../services/games';

export default (_, args, context: IToken): Promise<IBoard> => {
  const claims = verifyToken(context);

  if (!claims) {
    throw new AuthenticationError('You must be logged in.');
  }

  const { playerOne, playerTwo } = args;

  if (!playerOne || !playerTwo) {
    throw new ValidationError('missing or invalid value for playerOne or playerTwo');    
  }

  return createGame(args);
};
