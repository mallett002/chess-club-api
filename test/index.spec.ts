// import Chance from 'chance';
// import { ApolloServer, gql } from 'apollo-server';

// import { env } from '../environment';
// import ChessClubDatabase from '../src/repository/chess-club-database';
// import { resolvers } from '../src/resolvers/resolver-map';

// jest.mock('../src/repository/chess-club-database');
// jest.mock('apollo-server');

// const chance = new Chance();
// describe('index', () => {
//   const DatabaseMock = ChessClubDatabase as jest.MockedClass<typeof ChessClubDatabase>;
//   const ApolloMock = ApolloServer as jest.MockedClass<typeof ApolloServer>;
//   const gqlMock = gql as jest.MockedFunction<typeof gql>;

//   let dbInstance,
//     server,
//     serverUrl,
//     typeDefs;

//   beforeAll(() => {
//     dbInstance = { [chance.guid]: chance.string() };
//     typeDefs = chance.string();
//     server = {
//       listen: jest.fn()
//     };
//     serverUrl = chance.url();

//     DatabaseMock.mockReturnValue(dbInstance);
//     gqlMock.mockReturnValue(typeDefs);
//     ApolloMock.mockReturnValue(server);
//     server.listen.mockResolvedValue({
//       url: serverUrl
//     });

//     require('../index');
//   });

//   it('should start the server', () => {
//     expect(DatabaseMock).toHaveBeenCalledTimes(1);
//     expect(DatabaseMock).toHaveBeenCalledWith({
//       client: 'pg',
//       connection: {
//         database: 'chess-club-api',
//         host: 'localhost',
//         password: 'chess_club_api_ps',
//         port: 5432,
//         user: 'chess_club_api'
//       }
//     });
//     expect(ApolloMock).toHaveBeenCalledTimes(1);
//     expect(ApolloMock).toHaveBeenCalledWith({
//       resolvers,
//       typeDefs,
//       dataSources: expect.any(Function),
//       introspection: true,
//       playground: true,
//     });

//     const dataSources = ApolloMock.mock.calls[0][0].dataSources;
//     const result = dataSources();

//     expect(result).toStrictEqual({chessClubDatabase: dbInstance});

//     expect(server.listen).toHaveBeenCalledTimes(1);
//     expect(server.listen).toHaveBeenCalledWith({port: env.port});
//   });
// });
