import bcrypt from 'bcrypt';
import { ValidationError, ApolloError } from 'apollo-server-express';

const saltRounds = 10;

export default async (_, args, { dataSources: {chessClubDatabase} }) => {
  const { username, password } = args;

  if (!username || !password) {
    throw new ValidationError('Missing username or password');
  }

  return bcrypt.genSalt(saltRounds, async function(err, salt) {
    return bcrypt.hash(password, salt, async function(err, hash) {
        if (err) {
          throw new ApolloError('Something went wrong.');
        }

        const player = await chessClubDatabase.insertNewPlayer(username, hash);

        console.log(player);

        return player;
    });
  });
};
