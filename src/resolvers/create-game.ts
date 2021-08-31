import { ValidationError } from 'apollo-server';

import { createGame } from '../services/games';

export default async (parent, args, { dataSources }) => {
  const { playerOne, playerTwo } = args;

  if (!playerOne || !playerTwo) {
    throw new ValidationError('missing or invalid value for playerOne or playerTwo');
  }

  // Can access data source here
  // dataSources.chessClubDatabase.insertNewGame()
  // https://www.apollographql.com/docs/apollo-server/data/data-sources/#adding-data-sources-to-apollo-server

  const board = await createGame(args, dataSources.chessClubDatabase);

  return board;
};
