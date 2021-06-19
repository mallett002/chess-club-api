import { movePiece } from '../services/games';

export default (parent, args, context) => {
  const board = movePiece(args.gameId, args.cell);

  return board;
};
