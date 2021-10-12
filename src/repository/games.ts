import {getPgClient} from './db-client';
import { IGame } from "../interfaces/game";

const pgClient = getPgClient();

const mapGameDtoToDomain = (gameDto) => ({
  gameId: gameDto.game_id,
  fen: gameDto.fen,
  playerOne: gameDto.player_one,
  playerTwo: gameDto.player_two
});

export const getGameByGameId = async (gameId): Promise<IGame> => {
  const [game] = await pgClient('chess_club.tbl_game').where('game_id', gameId);

  console.log({gameInThisGuy: game});
  
  return mapGameDtoToDomain(game);
};
