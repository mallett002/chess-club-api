import { AuthenticationError } from 'apollo-server-core';
import { IToken } from '../interfaces/account';
import { IBoard } from '../interfaces/board';
import { verifyToken } from '../services/accounts/token-service';
import { loadGame } from '../services/games';

export default (__, args, context: IToken): Promise<IBoard> => {
  const claims = verifyToken(context);

  if (!claims) {
    throw new AuthenticationError('You must be logged in.');
  }

  return loadGame(args.playerOne, args.playerTwo, args.fen);
};
