// import Chance from 'chance';

// import getGamesResolver from '../../src/resolvers/get-games';
// import { getGamesByPlayerId } from '../../src/services/games';

// jest.mock('../../src/services/games');

// const chance = new Chance();

// describe('Get Games resolver', () => {
//   const getGamesStub = getGamesByPlayerId as jest.MockedFunction<typeof getGamesByPlayerId>;

//   let expectedGames,
//     parent,
//     args,
//     context,
//     chessClubDatabase,
//     result;

//   beforeEach(() => {
//     expectedGames = [{ [chance.string()]: chance.string() }];
//     chessClubDatabase = { [chance.string()]: chance.string() };
//     parent = {
//       [chance.string()]: chance.string()
//     };
//     args = {
//       playerId: chance.guid()
//     };
//     context = {
//       dataSources: {
//         chessClubDatabase
//       }
//     };

//     getGamesStub.mockResolvedValue(expectedGames);
//   });

//   it('should call get games service', async () => {
//     await getGamesResolver(parent, args, context);

//     expect(getGamesByPlayerId).toHaveBeenCalledTimes(1);
//     expect(getGamesByPlayerId).toHaveBeenCalledWith(
//       args.playerId,
//       context.dataSources.chessClubDatabase
//     );
//   });

//   it('should return the result of the get games service call', async () => {
//     result = await getGamesResolver(parent, args, context);

//     expect(result).toStrictEqual(expectedGames);
//   });
// });