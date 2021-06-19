import { uuid } from 'uuidv4';
import { Chess } from 'chess.js';

import { persistGame } from '../repository/games';
import { indexToRank, indexToFile } from '../helpers/board';

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
  const game = new Chess();
  const gameId = uuid();
  const fen = game.fen();

  persistGame(gameId, fen);

  game.header(
    'gameId', gameId,
    'playerOne', playerOne,
    'playerTwo', playerTwo
  );

  return {
    gameHeader: game.header(),
    moves: game.moves({verbose: true}),
    positions: flattenPositions(game.board()),
    turn: game.turn()
  };
};