import {Chess} from 'chess.js';

let chess;

export const getChess = (newGame?: boolean) => {
  if (newGame || !chess) {
    chess = new Chess();
  }

  return chess;
};
