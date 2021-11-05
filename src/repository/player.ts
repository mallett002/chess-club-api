import { IPlayer, IPlayerDTO } from "../interfaces/player";
import { getPgClient } from "./db-client";

const pgClient = getPgClient();

export const insertNewPlayer = async (username: string, password: string): Promise<IPlayer> => {
  const [dbPlayer]: { username: string, player_id: string }[] = await pgClient('chess_club.tbl_player')
    .insert({
      username,
      hashed_password: password,
    }).returning(['username', 'player_id']);

  return {
    username,
    playerId: dbPlayer.player_id
  };
};

export const selectPlayerByUsername = async (username: string): Promise<IPlayerDTO | null> => {
  const [player]: IPlayerDTO[] = await pgClient('chess_club.tbl_player').where('username', username);

  if (!player) {
    return null;
  }

  return player;
};
