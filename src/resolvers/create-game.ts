import { uuid } from 'uuidv4';
import { Chess } from 'chess.js';

import { persistGame, gameGameByGameId } from '../repository/games';

export default (parent, args, context) => {
  const { playerOne, playerTwo } = args;

  const game = new Chess();
  const gameId = uuid();

  game.header('gameId', gameId)

  const fen = game.fen();

  persistGame(gameId, fen);

  const foundGame = gameGameByGameId(gameId)
  console.log({foundGame});

  const turn = game.turn();
  const moves = game.moves();
  const positions = game.board();
  // return {
  //   turn,
  //   moves,
  //   positions
  // };

  return fen;
};

