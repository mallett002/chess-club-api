import { AuthenticationError, ValidationError, UserInputError } from 'apollo-server-express';
import { IToken } from '../interfaces/account';
import { verifyToken } from '../services/accounts/token-service';
import { PlayerJwtPayload } from 'jsonwebtoken';
import { deleteInvitation } from '../services/invitation';

export default async (_, args, context: IToken): Promise<string> => {
  const claims: PlayerJwtPayload = verifyToken(context);

  if (!claims) {
    throw new AuthenticationError('You must be logged in.');
  }

  if (!args.invitationId) {
    throw new ValidationError('missing or invalid value for invitationId');    
  }

  try {
    const deletedInvitation: string = await deleteInvitation(args.invitationId);

    return deletedInvitation;
  } catch (error) {
    throw new UserInputError(error);
  }
};
