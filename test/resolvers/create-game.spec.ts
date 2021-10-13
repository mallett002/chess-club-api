// import { ValidationError } from 'apollo-server-express';
// import Chance from 'chance';

// import createGameResolver from '../../src/resolvers/create-game';
// import { createGame } from '../../src/services/games';

// jest.mock('../../src/services/games');

// const chance = new Chance();

// describe('Create Game Resolver', () => {
//   const createGameStub = createGame as jest.MockedFunction<typeof createGame>;

//   let parent,
//     args,
//     board,
//     context;

//   beforeEach(() => {
//     parent = { [chance.string()]: chance.string() };
//     args = {
//       playerOne: chance.string(),
//       playerTwo: chance.string()
//     };
//     context = {
//       dataSources: {
//         chessClubDatabase: { [chance.string()]: chance.string() }
//       }
//     };

//     board = chance.hash();

//     createGameStub.mockResolvedValue(board);
//   });

//   it('should throw a validation error if playerOne is missing', async () => {
//     delete args.playerOne;

//     await expect(createGameResolver(parent, args, context))
//       .rejects
//       .toThrowError(new ValidationError('missing or invalid value for playerOne or playerTwo'));
//   });

//   it('should throw a validation error if playerTwo is missing', async () => {
//     delete args.playerTwo;

//     await expect(createGameResolver(parent, args, context))
//       .rejects
//       .toThrowError(new ValidationError('missing or invalid value for playerOne or playerTwo'));
//   });

//   it('should create the game', async () => {
//     await createGameResolver(parent, args, context);

//     expect(createGameStub).toHaveBeenCalledTimes(1);
//     expect(createGameStub).toHaveBeenCalledWith(args, context.dataSources.chessClubDatabase);
//   });

//   it('should return the board', async () => {
//     const result = await createGameResolver(parent, args, context);

//     expect(result).toStrictEqual(board);
//   });
// });