import { uuid } from 'uuidv4';
import { Chess } from 'chess.js';

import { persistGame, getGameByGameId } from '../repository/games';
import { indexToRank, indexToFile } from '../helpers/board';

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

  const gameId = "43ed404d-bbb6-4e7c-9ffb-76be9d54c534";
  // const gameId = uuid();
  const fen = chess.fen();

  persistGame(gameId, {
    fen,
    gameId,
    playerOne,
    playerTwo
  });

  return {
    gameId,
    moves: chess.moves({verbose: true}),
    players: [playerOne, playerTwo],
    positions: flattenPositions(chess.board()),
    turn: chess.turn()
  };
};

export const movePiece = (gameId, moveToCell) => {
  const game = getGameByGameId(gameId);

  chess = getChessGame();
  chess.load(game.fen);
  chess.move(moveToCell);

  const newFen = chess.fen();

  persistGame(gameId, {
    fen: newFen,
    gameId,
    playerOne: game.playerOne,
    playerTwo: game.playerTwo
  });

  const updatedGame = {
    gameId,
    moves: chess.moves({verbose: true}),
    players: [game.playerOne, game.playerTwo],
    positions: flattenPositions(chess.board()),
    turn: chess.turn()
  };

  return updatedGame;
};