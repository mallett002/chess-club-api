import { ValidationError, ApolloError } from 'apollo-server-express';

import { IPlayer } from '../interfaces/player';
import { encryptAndPersistPassword } from '../services/account';

export default async (_, args, { dataSources: {chessClubDatabase} }): Promise<IPlayer> | null => {
  const { username, password } = args;

  if (!username || !password) {
    throw new ValidationError('Missing username or password');
  }

  try {
    return encryptAndPersistPassword(username, password, chessClubDatabase);
  } catch (error) {
    throw new ApolloError(error);    
  }
};
