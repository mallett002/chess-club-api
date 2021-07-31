import { v4 as uuidv4 } from 'uuid';
import { Chess } from 'chess.js';

import { insertNewGame, getGameByGameId, selectGamesForPlayer, updateGame } from '../repository/games';
import { indexToRank, indexToFile } from '../helpers/board';
import { getPubSub } from './pub-sub';
import { BOARD_UPDATED } from '../constants';

let chess;

const getChess = (newGame?: boolean) => {
  if (newGame || !chess) {
    chess = new Chess();
  }

  return chess;
};

const flattenPositions = (positions) => {
  const flattenedPositions = [];

  for (let rowIndex = 0; rowIndex < positions.length; rowIndex++) {
    for (let cellIndex = 0; cellIndex < positions.length; cellIndex++) {
      const label = `${indexToFile[cellIndex]}${indexToRank[rowIndex]}`;
      flattenedPositions.push({
        ...positions[rowIndex][cellIndex],
        label
      });
    }
  }

  return flattenedPositions;
};

const publishBoardUpdates = (board) => {
  const pubSub = getPubSub();

  pubSub.publish(BOARD_UPDATED, { boardUpdated: board });
};

/* 
  - Will eventually use player's JWT to determine who they are.
  - Will take in a username to determine who they are inviting.
  - Look up player by username and send invite.
*/
export const createGame = ({ playerOne, playerTwo }) => {
  chess = getChess(true);

  const gameId = uuidv4();
  const fen = chess.fen();
  const turn = chess.turn();

  const board = {
    gameId,
    moves: chess.moves({ verbose: true }),
    playerOne,
    playerTwo,
    positions: flattenPositions(chess.board()),
    turn
  };

  publishBoardUpdates(board);

  insertNewGame(gameId, {
    fen,
    gameId,
    playerOne,
    playerTwo,
    turn
  });

  return board;
};

export const movePiece = (gameId, moveToCell) => {
  const game = getGameByGameId(gameId);

  chess = getChess();
  chess.load(game.fen);

  const move = chess.move(moveToCell);
  const turn = chess.turn();

  if (!move) {
    throw Error('Not a valid move');
  }

  const newBoard = {
    gameId,
    moves: chess.moves({ verbose: true }),
    playerOne: game.playerOne,
    playerTwo: game.playerTwo,
    positions: flattenPositions(chess.board()),
    turn
  };

  publishBoardUpdates(newBoard);

  updateGame(gameId, {
    fen: chess.fen(),
    gameId,
    playerOne: game.playerOne,
    playerTwo: game.playerTwo,
    turn
  });

  return newBoard;
};

export const getGamesByPlayerId = (playerId: string) => selectGamesForPlayer(playerId);