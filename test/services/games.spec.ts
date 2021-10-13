// import Chance from 'chance';
// import { v4 as uuidv4 } from 'uuid';

// import ChessClubDatabase from '../../src/repository/chess-club-database';
// import { flattenPositions } from '../../src/services/board';
// import { getBoardByGameId, createGame, getGamesByPlayerId } from '../../src/services/games';
// import { getChess } from '../../src/services/chess';
// import { getPubSub } from '../../src/services/pub-sub';

// jest.mock('../../src/repository/chess-club-database');
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
//   const mockedDb = ChessClubDatabase as jest.MockedClass<typeof ChessClubDatabase>;

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
//       mockedDbInstance,
//       result;

//     beforeEach(async () => {
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
//       mockedDbInstance = new mockedDb({});
//       mockedDbInstance.insertNewGame.mockResolvedValue([gameId]);

//       result = await createGame(args, mockedDbInstance);
//     });

//     afterEach(() => {
//       jest.resetAllMocks();
//     });

//     it('should create a new chess instance', () => {
//       expect(getChessMock).toHaveBeenCalledTimes(1);
//       expect(getChessMock).toHaveBeenCalledWith(true);
//     });

//     it('should get the fen for the game', () => {
//       expect(chessInstance.fen).toHaveBeenCalledTimes(1);
//     });

//     it('should get the turn for the game', () => {
//       expect(chessInstance.turn).toHaveBeenCalledTimes(1);
//     });

//     it('should insert the game in to the database', () => {
//       expect(mockedDbInstance.insertNewGame).toHaveBeenCalledTimes(1);
//       expect(mockedDbInstance.insertNewGame).toHaveBeenCalledWith(
//         expectedFen,
//         args.playerOne,
//         args.playerTwo,
//       );
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

//   describe('getGameByPlayerId', () => {
//     let
//       expectedFen,
//       chessInstance,
//       db,
//       playerId,
//       gameOne,
//       gameTwo,
//       expectedGames,
//       expectedTurnOne,
//       expectedTurnTwo,
//       result;

//     beforeEach(async () => {
//       expectedFen = chance.string();
//       expectedTurnOne = chance.string();
//       expectedTurnTwo = chance.string();
//       chessInstance = {
//         load: jest.fn(),
//         turn: jest.fn()
//           .mockReturnValueOnce(expectedTurnOne)
//           .mockReturnValue(expectedTurnTwo)
//       };
//       playerId = chance.guid();
//       gameOne = {
//         gameId: chance.guid(),
//         fen: expectedFen,
//         playerOne: playerId,
//         playerTwo: chance.guid()
//       };
//       gameTwo = {
//         gameId: chance.guid(),
//         fen: expectedFen,
//         playerOne: chance.guid(),
//         playerTwo: playerId
//       };

//       expectedGames = [gameOne, gameTwo];
//       getChessMock.mockReturnValue(chessInstance);
//       db = new mockedDb({});
//       db.selectGamesForPlayer.mockResolvedValue(expectedGames);

//       result = await getGamesByPlayerId(playerId, db);
//     });

//     afterEach(() => {
//       jest.resetAllMocks();
//     });

//     it('should get the games out of the database', () => {
//       expect(db.selectGamesForPlayer).toHaveBeenCalledTimes(1);
//       expect(db.selectGamesForPlayer).toHaveBeenCalledWith(playerId);
//     });

//     it('should get the chess instance just one time', () => {
//       expect(getChessMock).toHaveBeenCalledTimes(1);
//       expect(getChessMock).toHaveBeenCalledWith(true);
//     });

//     it("should load each game's fen", () => {
//       expect(chessInstance.load).toHaveBeenCalledTimes(expectedGames.length);

//       expectedGames.forEach((game) => {
//         expect(chessInstance.load).toHaveBeenCalledWith(game.fen);
//       });
//     });

//     it("should get each game's turn", () => {
//       expect(chessInstance.turn).toHaveBeenCalledTimes(expectedGames.length);
//     });

//     it('should return a list of the games with the turn on them', () => {
//       expect(result).toStrictEqual([
//         {
//           ...gameOne,
//           turn: expectedTurnOne
//         },
//         {
//           ...gameTwo,
//           turn: expectedTurnTwo
//         }
//       ]);
//     });
//   });

//   describe('getBoardByGameId', () => {
//     let
//       expectedFen,
//       chessInstance,
//       db,
//       gameId,
//       expectedTurn,
//       expectedBoard,
//       flattenedBoard,
//       expectedGame,
//       playerOne,
//       playerTwo,
//       expectedMoves,
//       result;

//     const createRandomObject = () => ({
//       [chance.string()]: chance.string(),
//       [chance.string()]: chance.string()
//     });

//     beforeEach(async () => {
//       expectedFen = chance.string();
//       expectedTurn = chance.string();
//       expectedBoard = [[createRandomObject()], [createRandomObject()]];
//       flattenedBoard = [createRandomObject(), createRandomObject()];
//       expectedMoves = [createRandomObject()];
//       expectedGame = {
//         game_id: gameId,
//         fen: expectedFen,
//         player_one: playerOne,
//         player_two: playerTwo
//       };
//       chessInstance = {
//         board: jest.fn().mockReturnValue(expectedBoard),
//         load: jest.fn(),
//         moves: jest.fn().mockReturnValue(expectedMoves),
//         turn: jest.fn().mockReturnValue(expectedTurn)
//       };
//       gameId = chance.guid();

//       flattenPositionsMock.mockReturnValue(flattenedBoard);
//       getChessMock.mockReturnValue(chessInstance);
//       db = new mockedDb({});
//       db.getGameByGameId.mockResolvedValue(expectedGame);

//       result = await getBoardByGameId(gameId, db);
//     });

//     afterEach(() => {
//       jest.resetAllMocks();
//     });

//     it('should get the game out of the database by its gameId', () => {
//       expect(db.getGameByGameId).toHaveBeenCalledTimes(1);
//       expect(db.getGameByGameId).toHaveBeenCalledWith(gameId);
//     });

//     it('should return null if there are no games with the gameId', async () => {
//       db.getGameByGameId.mockResolvedValue(null);

//       result = await getBoardByGameId(gameId, db);

//       expect(result).toBeNull();
//     });

//     it('should get the chess instance', () => {
//       expect(getChessMock).toHaveBeenCalledTimes(1);
//     });

//     it("should load each game's fen", () => {
//       expect(chessInstance.load).toHaveBeenCalledTimes(1);
//       expect(chessInstance.load).toHaveBeenCalledWith(expectedGame.fen);
//     });

//     it('should get the moves off the chess instance', () => {
//       expect(chessInstance.moves).toHaveBeenCalledTimes(1);
//       expect(chessInstance.moves).toHaveBeenCalledWith({verbose: true});
//     });

//     it('should board positions', () => {
//       expect(chessInstance.board).toHaveBeenCalledTimes(1);
//     });

//     it('should flatten the board positions', () => {
//       expect(flattenPositionsMock).toHaveBeenCalledTimes(1);
//       expect(flattenPositionsMock).toHaveBeenCalledWith(expectedBoard);
//     });

//     it('should return a board object', () => {
//       expect(result).toStrictEqual({
//         gameId,
//         moves: expectedMoves,
//         playerOne: playerOne,
//         playerTwo: playerTwo,
//         positions: flattenedBoard,
//         turn: expectedTurn
//       });
//     });
//   });
// });