import { ValidationError } from 'apollo-server-express';

import { createGame } from '../services/games';

export default async (_, args) => {
  const { playerOne, playerTwo } = args;

  if (!playerOne || !playerTwo) {
    throw new ValidationError('missing or invalid value for playerOne or playerTwo');    
  }

  const board = await createGame(args);

  return board;
};
