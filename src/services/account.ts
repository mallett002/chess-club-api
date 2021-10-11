import bcrypt from 'bcrypt';
import { IPlayer } from '../interfaces/player';
import ChessClubDatabase from '../repository/chess-club-database';

export const encryptAndPersistPassword = async (username: string, password: string, db: ChessClubDatabase): Promise<IPlayer> => {
  const hash: string = await bcrypt.hash(password, 10);

  return db.insertNewPlayer(username, hash);
};
