import bcrypt from 'bcrypt';

import { IPlayer } from '../interfaces/player';
import { insertNewPlayer } from '../repository/player';

export const encryptAndPersistPassword = async (username: string, password: string): Promise<IPlayer> => {
  const hash: string = await bcrypt.hash(password, 10);

  return insertNewPlayer(username, hash);
};
