// import Chance from 'chance';
// import { v4 as uuidv4 } from 'uuid';

// import { getGameByGameId, insertNewGame } from '../../src/repository/games';
// import { flattenPositions } from '../../src/services/board';
// import { getBoardByGameId, createGame } from '../../src/services/games';
// import { getChess } from '../../src/services/chess';
// import { getPubSub } from '../../src/services/pub-sub';

// jest.mock('../../src/repository/games');
// jest.mock('../../src/services/board');
// jest.mock('../../src/services/chess');
// jest.mock('../../src/services/pub-sub');
// jest.mock('uuid');

// describe('games service', () => {
//   const chance = new Chance();

//   const getChessMock = getChess as jest.MockedFunction<typeof getChess>;
//   const uuidv4Mock = uuidv4 as jest.MockedFunction<typeof uuidv4>;
//   const getPubSubMock = getPubSub as jest.MockedFunction<typeof getPubSub>;
//   const flattenPositionsMock = flattenPositions as jest.MockedFunction<typeof flattenPositions>;
//   const insertNewGameMock = insertNewGame as jest.MockedFunction<typeof insertNewGame>;

//   describe('create game', () => {
//     let args,
//       gameId,
//       expectedFen,
//       chessInstance,
//       expectedTurn,
//       pubSub,
//       expectedMoves,
//       expectedPositions,
//       expectedBoard,
//       result;

//     beforeEach(() => {
//       args = {
//         playerOne: chance.string(),
//         playerTwo: chance.string()
//       };
//       gameId = chance.guid();
//       expectedFen = chance.string();
//       expectedTurn = chance.string();
//       expectedMoves = [chance.string(), chance.string()];
//       expectedBoard = [chance.string(), chance.string()];
//       chessInstance = {
//         board: jest.fn().mockReturnValue(expectedBoard),
//         fen: jest.fn().mockReturnValue(expectedFen),
//         moves: jest.fn().mockReturnValue(expectedMoves),
//         turn: jest.fn().mockReturnValue(expectedTurn)
//       };
//       pubSub = { publish: jest.fn() };
//       expectedPositions = [chance.string(), chance.string()];

//       uuidv4Mock.mockReturnValue(gameId);
//       getChessMock.mockReturnValue(chessInstance);
//       getPubSubMock.mockReturnValue(pubSub);
//       flattenPositionsMock.mockReturnValue(expectedPositions);


//       result = createGame(args);
//     });

//     afterEach(() => {
//       jest.resetAllMocks();
//     });

//     it('should create a new chess instance', () => {
//       expect(getChessMock).toHaveBeenCalledTimes(1);
//       expect(getChessMock).toHaveBeenCalledWith(true);
//     });

//     it('should generate a new gameId', () => {
//       expect(uuidv4Mock).toHaveBeenCalledTimes(1);
//     });

//     it('should get the fen for the game', () => {
//       expect(chessInstance.fen).toHaveBeenCalledTimes(1);
//     });

//     it('should get the turn for the game', () => {
//       expect(chessInstance.turn).toHaveBeenCalledTimes(1);
//     });

//     it('should publish board updates', () => {
//       expect(chessInstance.moves).toHaveBeenCalledTimes(1);
//       expect(chessInstance.moves).toHaveBeenCalledWith({ verbose: true });
//       expect(chessInstance.board).toHaveBeenCalledTimes(1);
//       expect(flattenPositionsMock).toHaveBeenCalledTimes(1);
//       expect(flattenPositionsMock).toHaveBeenCalledWith(expectedBoard);
//       expect(getPubSubMock).toHaveBeenCalledTimes(1);
//       expect(pubSub.publish).toHaveBeenCalledTimes(1);
//       expect(pubSub.publish).toHaveBeenCalledWith('BOARD_UPDATED', {
//         boardUpdated: {
//           gameId,
//           moves: expectedMoves,
//           playerOne: args.playerOne,
//           playerTwo: args.playerTwo,
//           positions: expectedPositions,
//           turn: expectedTurn
//         }
//       });
//     });

//     it('should insert the game in to the database', () => {
//       expect(insertNewGameMock).toHaveBeenCalledTimes(1);
//       expect(insertNewGameMock).toHaveBeenCalledWith(
//         gameId,
//         {
//           fen: expectedFen,
//           gameId,
//           playerOne: args.playerOne,
//           playerTwo: args.playerTwo,
//           turn: expectedTurn
//         }
//       );
//     });

//     it('should return the board object', () => {
//       expect(result).toStrictEqual({
//         gameId,
//         moves: expectedMoves,
//         playerOne: args.playerOne,
//         playerTwo: args.playerTwo,
//         positions: expectedPositions,
//         turn: expectedTurn
//       })
//     });

//   });
//   describe('getBoardByGameId', () => {
//     const mockgetGameByGameId = getGameByGameId as jest.MockedFunction<typeof getGameByGameId>;
//     const flattenPositionsMock = flattenPositions as jest.MockedFunction<typeof flattenPositions>;

//     let gameId,
//       result,
//       chessInstance,
//       expectedMoves,
//       expectedPositions,
//       expectedBoard,
//       expectedTurn,
//       game;

//     beforeEach(() => {
//       gameId = chance.guid();
//       game = {
//         fen: chance.string(),
//         gameId: chance.string(),
//         playerOne: chance.string(),
//         playerTwo: chance.string(),
//         turn: chance.string()
//       };
//       expectedMoves = chance.string();
//       expectedBoard = [chance.string(), chance.string()];
//       expectedTurn = chance.string();
//       chessInstance = {
//         load: jest.fn(),
//         moves: jest.fn().mockReturnValue(expectedMoves),
//         board: jest.fn().mockReturnValue(expectedBoard),
//         turn: jest.fn().mockReturnValue(expectedTurn)
//       };

//       expectedPositions = [chance.string(), chance.string()];

//       mockgetGameByGameId.mockReturnValue(game);
//       flattenPositionsMock.mockReturnValue(expectedPositions);
//       getChessMock.mockReturnValue(chessInstance);

//       result = getBoardByGameId(gameId);
//     });

//     afterEach(() => {
//       jest.resetAllMocks();
//     })

//     it('should get the game by its gameId', () => {
//       expect(mockgetGameByGameId).toHaveBeenCalledTimes(1);
//       expect(mockgetGameByGameId).toHaveBeenCalledWith(gameId);
//     });

//     it('should get the chess instance', () => {
//       expect(getChessMock).toHaveBeenCalledTimes(1);
//     });

//     it('should load the board by the fen on the game', () => {
//       expect(chessInstance.load).toHaveBeenCalledTimes(1);
//       expect(chessInstance.load).toHaveBeenCalledWith(game.fen);
//     });

//     it('should get the moves', () => {
//       expect(chessInstance.moves).toHaveBeenCalledTimes(1);
//       expect(chessInstance.moves).toHaveBeenCalledWith({ verbose: true });
//     });

//     it('should get the board', () => {
//       expect(chessInstance.board).toHaveBeenCalledTimes(1);
//     });

//     it('should get the positions', () => {
//       expect(flattenPositions).toHaveBeenCalledTimes(1);
//       expect(flattenPositions).toHaveBeenCalledWith(expectedBoard);
//     });

//     it('should get the turn', () => {
//       expect(chessInstance.turn).toHaveBeenCalledTimes(1);
//     });

//     it('should return the board object', () => {
//       expect(result).toStrictEqual({
//         gameId,
//         moves: expectedMoves,
//         playerOne: game.playerOne,
//         playerTwo: game.playerTwo,
//         positions: expectedPositions,
//         turn: expectedTurn
//       });
//     });

//     it('should return null if no game is found', () => {
//       mockgetGameByGameId.mockReturnValue(null);

//       result = getBoardByGameId(gameId);

//       expect(result).toBeNull();
//     });
//   });
// });