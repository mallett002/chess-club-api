import { AuthenticationError } from 'apollo-server-express';
import { PlayerJwtPayload } from 'jsonwebtoken';

import { IToken } from '../interfaces/account';
import { IBoard } from '../interfaces/board';
import { IGameInvites } from '../interfaces/invitation';
import { verifyToken } from '../services/accounts/token-service';
import { getInvitationsAndInboundGameRequests } from '../services/invitation';


export default (parent, args, context: IToken): Promise<IGameInvites> => {
  const claims: PlayerJwtPayload = verifyToken(context);

  if (!claims) {
    throw new AuthenticationError('You must be logged in.');
  }
  
  return getInvitationsAndInboundGameRequests(claims.playerId);
};
