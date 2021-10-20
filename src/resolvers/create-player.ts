import { ValidationError, ApolloError } from 'apollo-server-express';
import { IToken } from '../interfaces/account';

import { IPlayer, IPlayerPayload } from '../interfaces/player';
import { encryptAndPersistPassword } from '../services/accounts/password-helpers';
import { getToken } from '../services/accounts/token-service';

export default async (_, args: IPlayerPayload): Promise<IToken> => {
  const { username, password } = args;

  if (!username || !password) {
    throw new ValidationError('Missing username or password');
  }

  try {
    const domainPlayer: IPlayer = await encryptAndPersistPassword(username, password);
    
    return getToken(username, domainPlayer.playerId);
  } catch (error) {
    throw new ApolloError(error);    
  }
};
