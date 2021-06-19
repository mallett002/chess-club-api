import { createGame } from '../services/games';

export default (parent, args, context) => {
  const board = createGame(args);

  return board;
};
