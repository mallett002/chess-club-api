import { AuthenticationError } from 'apollo-server-express';
import { PlayerJwtPayload } from 'jsonwebtoken';

import { IToken } from '../interfaces/account';
import { IBoard } from '../interfaces/board';
import { IGameInvites } from '../interfaces/invitation';
import { verifyToken } from '../services/accounts/token-service';
import { getInvitationsAndInboundRequests } from '../services/invitation';


// Todo: change GameRequests nomenclature to Invitation
export default async (parent, args, context: IToken): Promise<IGameInvites> => {
  const claims: PlayerJwtPayload = verifyToken(context);

  if (!claims) {
    throw new AuthenticationError('You must be logged in.');
  }
  
  const gameRequests = await getInvitationsAndInboundRequests(claims.playerId);

  console.log(JSON.stringify(gameRequests));

  return gameRequests;
};
