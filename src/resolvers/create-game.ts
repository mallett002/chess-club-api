import { ApolloError, AuthenticationError, ValidationError } from 'apollo-server-express';
import { IToken } from '../interfaces/account';
import { IBoard } from '../interfaces/board';
import { verifyToken } from '../services/accounts/token-service';

import { createGame } from '../services/games';

export default async (_, {invitationId}, context: IToken): Promise<IBoard> => {
  const claims = verifyToken(context);

  if (!claims) {
    throw new AuthenticationError('You must be logged in.');
  }

  if (!invitationId) {
    throw new ValidationError('missing or invalid value for invitationId');    
  }

  try {
    const game = await createGame(invitationId, claims.playerId);

    return game;
  } catch (error) {
    throw new ApolloError(error);      
  }
};
