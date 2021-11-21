import {Chess} from 'chess.js';

const games = new Map();

export const getChess = (playerOne, playerTwo) => {
  const key = `${playerOne}:${playerTwo}`;
  const game = games.get(key);

  if (!game) {
    const newGame = JSON.stringify(new Chess());

    games.set(key, newGame);

    return JSON.parse(newGame);
  }

  return JSON.parse(game);
};

export const removeChess = (playerOne, playerTwo) => {
  games.delete(`${playerOne}:${playerTwo}`);
};
