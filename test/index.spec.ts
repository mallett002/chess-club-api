import Chance from 'chance';
import config from 'config';
import { ApolloServer, gql } from 'apollo-server-express';

import ChessClubDatabase from '../src/repository/chess-club-database';
import { resolvers } from '../src/resolvers/resolver-map';

jest.mock('../src/repository/chess-club-database');
jest.mock('apollo-server-express');
jest.mock('config');

const chance = new Chance();
describe('index', () => {
  const DatabaseMock = ChessClubDatabase as jest.MockedClass<typeof ChessClubDatabase>;
  const ApolloMock = ApolloServer as jest.MockedClass<typeof ApolloServer>;
  const gqlMock = gql as jest.MockedFunction<typeof gql>;
  const configGetMock = config.get as jest.MockedFunction<typeof config.get>;

  let dbInstance,
    server,
    serverUrl,
    chessClubDBConnection,
    apolloConfig,
    port,
    typeDefs;

  beforeAll(() => {
    dbInstance = { [chance.guid]: chance.string() };
    typeDefs = chance.string();
    server = {
      listen: jest.fn()
    };
    serverUrl = chance.url();
    chessClubDBConnection = {
      database: 'chess-club-api',
      host: 'localhost',
      password: 'chess_club_api_ps',
      port: 5432,
      user: 'chess_club_api'
    };
    apolloConfig = {
      introspection: chance.bool(),
      playground: chance.bool()
    };
    port = chance.natural();

    DatabaseMock.mockReturnValue(dbInstance);
    gqlMock.mockReturnValue(typeDefs);
    ApolloMock.mockReturnValue(server);
    server.listen.mockResolvedValue({
      url: serverUrl
    });
    configGetMock.mockReturnValueOnce(chessClubDBConnection);
    configGetMock.mockReturnValueOnce(apolloConfig);
    configGetMock.mockReturnValue(port);

    require('../index');
  });

  it('should start the server', () => {
    // expect(config.get).toHaveBeenCalledTimes(3);
    // expect(config.get).toHaveBeenNthCalledWith(1, 'chess_club_db');
    // expect(config.get).toHaveBeenNthCalledWith(2, 'apollo');
    // expect(config.get).toHaveBeenNthCalledWith(3, 'port');

    // expect(DatabaseMock).toHaveBeenCalledTimes(1);
    // expect(DatabaseMock).toHaveBeenCalledWith({
    //   client: 'pg',
    //   connection: chessClubDBConnection
    // });
    expect(ApolloMock).toHaveBeenCalledTimes(1);
    // expect(ApolloMock).toHaveBeenCalledWith({
    //   resolvers,
    //   typeDefs,
    //   dataSources: expect.any(Function),
    //   introspection: apolloConfig.introspection,
    //   playground: apolloConfig.playground
    // });

    // const dataSources = ApolloMock.mock.calls[0][0].dataSources;
    // const result = dataSources();

    // expect(result).toStrictEqual({ chessClubDatabase: dbInstance });

    // expect(server.listen).toHaveBeenCalledTimes(1);
    // expect(server.listen).toHaveBeenCalledWith({ port });
  });
});
