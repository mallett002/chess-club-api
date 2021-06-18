import { uuid } from 'uuidv4';
import { Chess } from 'chess.js';

export default (parent, args, context) => {
  const { playerOne, playerTwo } = args;

  const game = new Chess();
  const fen = game.fen();

  console.log({fen});
  
  // save to db
  // persistGame(uuid(), fen);

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

