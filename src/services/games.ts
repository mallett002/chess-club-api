import { v4 as uuidv4 } from 'uuid';

// import { insertNewGame, getGameByGameId, selectGamesForPlayer, updateGame } from '../repository/games';
import { getPubSub } from './pub-sub';
import { BOARD_UPDATED } from '../constants';

import { flattenPositions } from './board';
import { getChess } from './chess';
import ChessClubDatabase from '../repository/chess-club-database';

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

interface IGame {
  gameId: string
  fen: string
  playerOne: string
  playerTwo: string
}

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

export const getGamesByPlayerId = (playerId: string) => {
  // selectGamesForPlayer(playerId);
};

export const getBoardByGameId = (gameId) => {
  // const game = getGameByGameId(gameId);

  // if (!game) {
  //   return null;
  // }

  // const chess = getChess();
  
  // chess.load(game.fen);

  // return {
  //   gameId,
  //   moves: chess.moves({ verbose: true }),
  //   playerOne: game.playerOne,
  //   playerTwo: game.playerTwo,
  //   positions: flattenPositions(chess.board()),
  //   turn: chess.turn()
  // };
};
