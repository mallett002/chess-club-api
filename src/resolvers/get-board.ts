import { AuthenticationError } from 'apollo-server-express';

import { IToken } from '../interfaces/account';
import { IBoard } from '../interfaces/board';
import { verifyToken } from '../services/accounts/token-service';
import { getBoardByGameId } from '../services/games';

export default async (__, args, context: IToken): Promise<IBoard> => {
  const claims = verifyToken(context);

  if (!claims) {
    throw new AuthenticationError('You must be logged in.');
  }

  return getBoardByGameId(args.gameId);
};
