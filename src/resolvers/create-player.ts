import { ValidationError, ApolloError } from 'apollo-server-express';
import { ITokenSet } from '../interfaces/account';

import { IPlayer, IPlayerPayload } from '../interfaces/player';
import { encryptAndPersistPassword } from '../services/accounts/password-helpers';
import { getTokenSet } from '../services/accounts/token-service';

export default async (_, args: IPlayerPayload): Promise<ITokenSet> => {
  const { username, password } = args;

  if (!username || !password) {
    throw new ValidationError('Missing username or password');
  }

  try {
    const domainPlayer: IPlayer = await encryptAndPersistPassword(username, password);
    
    return getTokenSet(username, domainPlayer.playerId);
  } catch (error) {
    throw new ApolloError(error);    
  }
};
