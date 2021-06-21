import { uuid } from 'uuidv4';
import { Chess } from 'chess.js';

import { persistGame, getGameByGameId } from '../repository/games';
import { indexToRank, indexToFile } from '../helpers/board';
import { getPubSub } from './pub-sub';
import { BOARD_UPDATED } from '../constants';

let chess;

const getChessGame = () => {
  if (!chess) {
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

export const createGame = ({ playerOne, playerTwo }) => {
  chess = getChessGame();

  const gameId = uuid();
  const fen = chess.fen();

  persistGame(gameId, {
    fen,
    gameId,
    playerOne,
    playerTwo
  });

  return {
    gameId,
    moves: chess.moves({ verbose: true }),
    players: [playerOne, playerTwo],
    positions: flattenPositions(chess.board()),
    turn: chess.turn()
  };
};

export const movePiece = (gameId, moveToCell) => {
  const game = getGameByGameId(gameId);

  chess = getChessGame();
  chess.load(game.fen);

  const move = chess.move(moveToCell);

  if (!move) {
    throw Error('Not a valid move');
  }

  const newFen = chess.fen();

  const newBoard = {
    gameId,
    moves: chess.moves({ verbose: true }),
    players: [game.playerOne, game.playerTwo],
    positions: flattenPositions(chess.board()),
    turn: chess.turn()
  };

  const pubSub = getPubSub();

  pubSub.publish(BOARD_UPDATED, { boardUpdated: newBoard });

  persistGame(gameId, {
    fen: newFen,
    gameId,
    playerOne: game.playerOne,
    playerTwo: game.playerTwo
  });

  return newBoard;
};