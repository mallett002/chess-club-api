import { updateGame } from '../services/games';

export default async (parent, args, { dataSources }) => {
  const board = await updateGame(args.gameId, args.cell, dataSources.chessClubDatabase);

  return board;
};
