import { v4 as uuidv4 } from 'uuid';
import { getPubSub } from './pub-sub';
import { BOARD_UPDATED } from '../constants';

import { flattenPositions } from './board';
import { getChess } from './chess';
import ChessClubDatabase from '../repository/chess-club-database';
import { IGame } from '../interfaces/game';
import { getGameByGameId } from '../repository/games';

const publishBoardUpdates = (board) => {
  const pubSub = getPubSub();

  pubSub.publish(BOARD_UPDATED, { boardUpdated: board });
};

/* 
  - Will eventually use player's JWT to determine who they are.
  - Will take in a username to determine who they are inviting.
  - Look up player by username and send invite.
*/
export const createGame = async ({ playerOne, playerTwo }, db: ChessClubDatabase) => {
  const chess = getChess(true);
  const fen = chess.fen();
  const turn = chess.turn();

  const [gameId] = await db.insertNewGame(
    fen,
    playerOne,
    playerTwo,
  );

  const board = {
    gameId,
    moves: chess.moves({ verbose: true }),
    playerOne,
    playerTwo,
    positions: flattenPositions(chess.board()),
    turn
  };

  publishBoardUpdates(board);

  return board;
};


export const updateGame = async (gameId, moveToCell, db: ChessClubDatabase) => {
  const game: IGame = await db.getGameByGameId(gameId);
  const chess = getChess();

  chess.load(game.fen);

  const move = chess.move(moveToCell);

  if (!move) {
    throw Error('Not a valid move');
  }

  db.updateGame(gameId, chess.fen());

  const newBoard = {
    gameId,
    moves: chess.moves({ verbose: true }),
    playerOne: game.playerOne,
    playerTwo: game.playerTwo,
    positions: flattenPositions(chess.board()),
    turn: chess.turn()
  };

  publishBoardUpdates(newBoard);

  return newBoard;
};

export const getGamesByPlayerId = async (playerId: string, db: ChessClubDatabase) => {
  const games = await db.selectGamesForPlayer(playerId);
  const chess = getChess(true);

  return games.map((game) => {
    chess.load(game.fen);

    const turn = chess.turn();

    return {
      ...game,
      turn
    };
  });
};

export const getBoardByGameId = async (gameId, db: ChessClubDatabase) => {
  const game = await db.getGameByGameId(gameId);

  if (!game) {
    return null;
  }

  const chess = getChess();
  
  chess.load(game.fen);

  return {
    gameId,
    moves: chess.moves({ verbose: true }),
    playerOne: game.playerOne,
    playerTwo: game.playerTwo,
    positions: flattenPositions(chess.board()),
    turn: chess.turn()
  };
};

// Todo: follow this method for all service functions connecting to db
export const testGetBoardByGameId = async (gameId) => {
  const game = await getGameByGameId(gameId);

  if (!game) {
    return null;
  }

  const chess = getChess();
  
  chess.load(game.fen);

  return {
    gameId,
    moves: chess.moves({ verbose: true }),
    playerOne: game.playerOne,
    playerTwo: game.playerTwo,
    positions: flattenPositions(chess.board()),
    turn: chess.turn()
  };
};
