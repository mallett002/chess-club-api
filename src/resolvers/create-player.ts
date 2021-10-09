import bcrypt from 'bcrypt';
import { ValidationError, ApolloError } from 'apollo-server-express';
import { persistPlayer } from '../services/encrypt-password';

const saltRounds = 10;

export default async (_, args, { dataSources: {chessClubDatabase} }) => {
  const { username, password } = args;

  if (!username || !password) {
    throw new ValidationError('Missing username or password');
  }

  const player = await persistPlayer(username, password, chessClubDatabase);

  console.log({player});
  
  return player;
};
