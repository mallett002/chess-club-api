import Chance from 'chance';
import { ApolloServer } from 'apollo-server';

import ChessClubDatabase from '../src/repository/chess-club-database';
import {resolvers} from '../src/resolvers/resolver-map';
import {typeDefs} from '../src/schema';

jest.mock('../src/repository/chess-club-database');
jest.mock('apollo-server');
// jest.mock('../src/resolvers/resolver-map');
// jest.mock('../src/schema');

// TODO: fix the resolver map and schema returning undefined.
// TODO: test the db instance being the datasources.

const chance = new Chance();
describe('index', () => {
  const DatabaseMock = ChessClubDatabase as jest.MockedClass<typeof ChessClubDatabase>;
  const ApolloMock = ApolloServer as jest.MockedClass<typeof ApolloServer>;

  let dbInstance;

  beforeEach(() => {
    dbInstance = {[chance.guid]: chance.string()};
    DatabaseMock.mockReturnValue(dbInstance);

    require('../index');
  });

  it('should connect to the database', () => {
    expect(DatabaseMock).toHaveBeenCalledTimes(1);
    expect(DatabaseMock).toHaveBeenCalledWith({
      client: 'pg',
      connection: {
        database: 'chess-club-api',
        host : 'localhost',
        password: 'chess_club_api_ps',
        port: 5432,
        user: 'chess_club_api'
      }
    });
  });

  it('should start the server', () => {
    expect(ApolloMock).toHaveBeenCalledTimes(1);
    expect(ApolloMock).toHaveBeenCalledWith({
      resolvers,
      typeDefs,
      dataSources: () => ({ dbInstance }),
      // introspection: env.apollo.introspection,
      // playground: env.apollo.playground,
    });
  });
});