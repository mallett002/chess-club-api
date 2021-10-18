import { ValidationError, ApolloError } from 'apollo-server-express';
import { ITokenSet } from '../interfaces/account';

import { IAuthenticatedPlayer, IPlayer, IPlayerPayload } from '../interfaces/player';
import { encryptAndPersistPassword } from '../services/accounts/password-helpers';
import { getTokenSet } from '../services/accounts/token-service';

export default async (_, args: IPlayerPayload): Promise<IAuthenticatedPlayer> => {
  const { username, password } = args;

  if (!username || !password) {
    throw new ValidationError('Missing username or password');
  }

  try {
    const domainPlayer: IPlayer = await encryptAndPersistPassword(username, password);
    const tokens: ITokenSet = getTokenSet(username);
    return {
      ...domainPlayer,
      ...tokens
    };
  } catch (error) {
    throw new ApolloError(error);    
  }
};
