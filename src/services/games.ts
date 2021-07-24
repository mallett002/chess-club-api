import { v4 as uuidv4 } from 'uuid';
import { Chess } from 'chess.js';

import { persistGame, getGameByGameId, selectGamesForPlayer } from '../repository/games';
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

export const createGame = ({ playerOne, playerTwo }) => {
  chess = getChess(true);

  const gameId = uuidv4();
  const fen = chess.fen();

  const board = {
    gameId,
    moves: chess.moves({ verbose: true }),
    players: [playerOne, playerTwo],
    positions: flattenPositions(chess.board()),
    turn: chess.turn()
  };

  publishBoardUpdates(board);

  persistGame(gameId, {
    fen,
    gameId,
    playerOne,
    playerTwo
  });

  return board;
};

export const movePiece = (gameId, moveToCell) => {
  const game = getGameByGameId(gameId);

  chess = getChess();
  chess.load(game.fen);

  const move = chess.move(moveToCell);

  if (!move) {
    throw Error('Not a valid move');
  }

  const newBoard = {
    gameId,
    moves: chess.moves({ verbose: true }),
    players: [game.playerOne, game.playerTwo],
    positions: flattenPositions(chess.board()),
    turn: chess.turn()
  };

  publishBoardUpdates(newBoard);

  persistGame(gameId, {
    fen: chess.fen(),
    gameId,
    playerOne: game.playerOne,
    playerTwo: game.playerTwo
  });

  return newBoard;
};

export const getGamesByPlayerId = (playerId: string) => selectGamesForPlayer(playerId);
