import {getPgClient} from './db-client';
import { IGameDTO } from "../interfaces/game";

const pgClient = getPgClient();

const mapToGameDTO = (dbGame) => ({
  gameId: dbGame.game_id,
  fen: dbGame.fen,
  playerOne: dbGame.player_one,
  playerTwo: dbGame.player_two
});

export const getGameByGameId = async (gameId): Promise<IGameDTO> => {
  const [game] = await pgClient('chess_club.tbl_game').where('game_id', gameId);

  if (game) {
    return mapToGameDTO(game);
  }

  return null;
};

export const deleteGameDataByGameId = async (gameId: string): Promise<string> => {
  const [game] = await pgClient('chess_club.tbl_game').where('game_id', gameId);

  if (!game) {
    return null;
  }

  const [deletedGameId]: string[] = await pgClient('chess_club.tbl_game')
    .where('game_id', gameId)
    .del()
    .returning('game_id');

  return deletedGameId;
};

export const insertNewGame = async(fen: string, playerOne: string, playerTwo: string): Promise<string> => {
  const [gameId]: string[] = await pgClient('chess_club.tbl_game').insert({
    fen,
    player_one: playerOne,
    player_two: playerTwo
  }).returning('game_id');

   await Promise.all([
    await pgClient('chess_club.tbl_players_games').insert({
      game_id: gameId,
      player_id: playerOne,
      player_color: 'w'
    }),
    await pgClient('chess_club.tbl_players_games').insert({
      game_id: gameId,
      player_id: playerTwo,
      player_color: 'b'
    })
  ]);

  return gameId;
};

export const updateGame = (gameId, fen): Promise<string []> =>
  pgClient('chess_club.tbl_game')
    .where({ 'game_id': gameId })
    .update({ fen }, [fen])
    .returning('game_id');

export const selectGamesForPlayer = async (playerId: string): Promise<IGameDTO []> => {
  const games = await pgClient('chess_club.tbl_game')
    .where({ player_one: playerId })
    .orWhere({ player_two: playerId });

  return games.map(mapToGameDTO);
};

