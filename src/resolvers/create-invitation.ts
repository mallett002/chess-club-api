import { AuthenticationError, ValidationError, UserInputError } from 'apollo-server-express';
import { IToken } from '../interfaces/account';
import { verifyToken } from '../services/accounts/token-service';
import { IInvitation } from '../interfaces/invitation';
import { PlayerJwtPayload } from 'jsonwebtoken';
import { createInviation } from '../services/invitation';

export default async (_, args, context: IToken): Promise<IInvitation> => {
  const claims: PlayerJwtPayload = verifyToken(context);

  if (!claims) {
    throw new AuthenticationError('You must be logged in.');
  }

  if (!args.inviteeUsername || !args.invitorColor) {
    throw new ValidationError('missing or invalid value for inviteeUsername or invitorColor');    
  }

  try {
    const invitation = await createInviation(claims, args.inviteeUsername, args.invitorColor);
  
    return invitation;
  } catch (error) {
    throw new UserInputError(error);
  }
};
