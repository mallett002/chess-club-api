import { updateGame } from '../services/games';

export default async (parent, args) => {
  const board = await updateGame(args.gameId, args.cell);

  return board;
};
