import bcrypt from 'bcryptjs';

import { IPlayer } from '../../interfaces/player';
import { insertNewPlayer } from '../../repository/player';

export const encryptAndPersistPassword = async (username: string, password: string): Promise<IPlayer> => {
  // todo: update the salt to something better
  const hash: string = await bcrypt.hash(password, 10);

  return insertNewPlayer(username, hash);
};

export const validatePassword = (password, hash) => bcrypt.compare(password, hash);
