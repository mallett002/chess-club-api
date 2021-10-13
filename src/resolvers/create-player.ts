import { ValidationError, ApolloError } from 'apollo-server-express';

import { IPlayer } from '../interfaces/player';
import { encryptAndPersistPassword } from '../services/account';

export default async (_, args): Promise<IPlayer> => {
  const { username, password } = args;

  if (!username || !password) {
    throw new ValidationError('Missing username or password');
  }

  try {
    return encryptAndPersistPassword(username, password);

    /*
    - Log the user in (Give them a JWT)
    - Use passport?
    */
  } catch (error) {
    throw new ApolloError(error);    
  }
};
