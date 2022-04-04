import { getPgClient } from './db-client';
import { IGameDTO } from "../interfaces/game";
import { IColor, IFallenSoldiers, IPiece } from '../interfaces/board';

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

export const insertNewGame = async (fen: string, playerOne: string, playerTwo: string): Promise<IGameDTO> => {
  const [game] = await pgClient('chess_club.tbl_game').insert({
    fen,
    player_one: playerOne,
    player_two: playerTwo
  }).returning('*');

  await Promise.all([
    await pgClient('chess_club.tbl_players_games').insert({
      game_id: game.game_id,
      player_id: playerOne,
      player_color: 'w'
    }),
    await pgClient('chess_club.tbl_players_games').insert({
      game_id: game.game_id,
      player_id: playerTwo,
      player_color: 'b'
    })
  ]);

  return {
    fen: game.fen,
    gameId: game.game_id,
    playerOne: game.player_one,
    playerTwo: game.player_two
  };
};

export const updateGame = (gameId, fen): Promise<string[]> =>
  pgClient('chess_club.tbl_game')
    .where({ 'game_id': gameId })
    .update({ fen }, [fen])
    .returning('game_id');

export const selectGamesForPlayer = async (playerId: string): Promise<IGameDTO[]> => {
  const games = await pgClient('chess_club.tbl_game')
    .where({ player_one: playerId })
    .orWhere({ player_two: playerId });

  return games.map(mapToGameDTO);
};

export const insertFallenSoldier = async (piece: IPiece, gameId: string, color: IColor): Promise<string[]> => {
  return pgClient('chess_club.tbl_captured_piece').insert({
    name: piece,
    game_id: gameId,
    color
  }).returning('captured_piece_id');
};

interface IDBPiece {
  color: string
  name: string
  captured_piece_id: string
  game_id: string
}

const powerByPieces = { p: 1, n: 2, b: 3, r: 4, q: 5 };

function sortAccordingToPower(pieces) {
  return pieces.sort((a, b) => powerByPieces[a] - powerByPieces[b]);
};

export const selectFallenSoldiersForGame = async (gameId: string): Promise<IFallenSoldiers> => {
  const pieces = await pgClient('chess_club.tbl_captured_piece').where({ game_id: gameId });
  const reduced = pieces.reduce((accum, curr) => {
    if (curr.color === 'w') {
      accum.playerOnePieces.push(curr.name);
    } else {
      accum.playerTwoPieces.push(curr.name);
    }

    return accum;
  }, { playerOnePieces: [], playerTwoPieces: [] });

  return {
    playerOnePieces: sortAccordingToPower(reduced.playerOnePieces),
    playerTwoPieces: sortAccordingToPower(reduced.playerTwoPieces)
  };
};
