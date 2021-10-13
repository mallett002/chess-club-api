// import Chance from 'chance';

// import ChessClubDatabase from '../../src/repository/chess-club-database';

// const chance = new Chance();

// const mockReturning = jest.fn();
// const mockUpdate = jest.fn();
// const mockInsert = jest.fn();
// const mockWhere = jest.fn();
// const mockOrWhere = jest.fn();
// const mockKnex = jest.fn();


// jest.mock('datasource-sql', () => {
//   class MockDataSource {
//     knex = mockKnex
//   }

//   return {
//     SQLDataSource: MockDataSource
//   }
// });

// describe('ChessClubDatabase', () => {
//   const fakeConnection = { [chance.guid()]: chance.string() };
//   const db = new ChessClubDatabase(fakeConnection);

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   describe('insertNewGame', () => {
//     let fen,
//       playerOne,
//       playerTwo,
//       gameId;

//     beforeEach(async () => {
//       fen = chance.string();
//       gameId = chance.guid();
//       playerOne = chance.guid();
//       playerTwo = chance.guid();
//       mockReturning.mockResolvedValue(gameId);
//       mockInsert.mockReturnValue({
//         returning: mockReturning
//       });
//       mockKnex.mockReturnValue({
//         insert: mockInsert
//       });
//     });

//     it('insert the game for the players', async () => {
//       await db.insertNewGame(fen, playerOne, playerTwo);

//       expect(mockKnex).toHaveBeenCalledTimes(3);
//       expect(mockKnex).toHaveBeenNthCalledWith(1, 'chess_club.tbl_game');
//       expect(mockInsert).toHaveBeenCalledTimes(3);
//       expect(mockInsert).toHaveBeenNthCalledWith(1, {
//         fen,
//         player_one: playerOne,
//         player_two: playerTwo
//       });
//     });

//     it('should insert a record in players games for player one', async () => {
//       await db.insertNewGame(fen, playerOne, playerTwo);

//       expect(mockKnex).toHaveBeenCalledTimes(3);
//       expect(mockKnex).toHaveBeenNthCalledWith(2, 'chess_club.tbl_players_games');
//       expect(mockInsert).toHaveBeenCalledTimes(3);
//       expect(mockInsert).toHaveBeenNthCalledWith(2, {
//         player_id: playerOne,
//         player_color: 'w'
//       });
//     });

//     it('should insert a record in players games for player two', async () => {
//       await db.insertNewGame(fen, playerOne, playerTwo);

//       expect(mockKnex).toHaveBeenCalledTimes(3);
//       expect(mockKnex).toHaveBeenNthCalledWith(3, 'chess_club.tbl_players_games');
//       expect(mockInsert).toHaveBeenCalledTimes(3);
//       expect(mockInsert).toHaveBeenNthCalledWith(3, {
//         player_id: playerTwo,
//         player_color: 'b'
//       });
//     });

//     it('should return the game id', async () => {
//       const result = await db.insertNewGame(fen, playerOne, playerTwo);

//       expect(result).toStrictEqual(gameId);
//     });
//   });

//   describe('getGameByGameId', () => {
//     let gameId,
//       fen,
//       game;

//     beforeEach(async () => {
//       gameId = chance.guid();
//       fen = chance.guid();
//       game = {
//         game_id: gameId,
//         fen,
//         player_one: chance.string(),
//         player_two: chance.string()
//       };
//       mockWhere.mockReturnValue([game])
//       mockKnex.mockReturnValue({
//         where: mockWhere
//       })
//     });

//     it('should get the game from the database', async () => {
//       await db.getGameByGameId(gameId);

//       expect(mockKnex).toHaveBeenCalledTimes(1);
//       expect(mockKnex).toHaveBeenCalledWith('chess_club.tbl_game');
//       expect(mockWhere).toHaveBeenCalledTimes(1);
//       expect(mockWhere).toHaveBeenCalledWith(
//         'game_id',
//         gameId
//       );
//     });

//     it('should select the game by its gameId', async () => {
//       await db.getGameByGameId(gameId);

//       expect(mockKnex).toHaveBeenCalledTimes(1);
//       expect(mockKnex).toHaveBeenCalledWith('chess_club.tbl_game');
//     });

//     it('should return the game', async () => {
//       const result = await db.getGameByGameId(gameId);

//       expect(result).toStrictEqual({
//         gameId: game.game_id,
//         fen: game.fen,
//         playerOne: game.player_one,
//         playerTwo: game.player_two
//       });
//     });
//   });

//   describe('updateGame', () => {
//     let gameId,
//       fen;

//     beforeEach(() => {
//       mockReturning.mockReturnValue(gameId);
//       mockUpdate.mockReturnValue({ returning: mockReturning });
//       mockWhere.mockReturnValue({ update: mockUpdate });
//       mockKnex.mockReturnValue({ where: mockWhere })
//     });

//     it('should use the game table', async () => {
//       await db.updateGame(gameId, fen);

//       expect(mockKnex).toHaveBeenCalledTimes(1);
//       expect(mockKnex).toHaveBeenCalledWith('chess_club.tbl_game');
//     });

//     it('should find the game by its game id', async () => {
//       await db.updateGame(gameId, fen);

//       expect(mockWhere).toHaveBeenCalledTimes(1);
//       expect(mockWhere).toHaveBeenCalledWith({ 'game_id': gameId });
//     });

//     it('should update the fen for the game', async () => {
//       await db.updateGame(gameId, fen);

//       expect(mockUpdate).toHaveBeenCalledTimes(1);
//       expect(mockUpdate).toHaveBeenCalledWith({ fen }, [fen]);
//     });

//     it('should return the game id', async () => {
//       const result = await db.updateGame(gameId, fen);

//       expect(mockReturning).toHaveBeenCalledTimes(1);
//       expect(mockReturning).toHaveBeenCalledWith('game_id');
//       expect(result).toStrictEqual(gameId);
//     });
//   });

//   describe('selectGamesForPlayer', () => {
//     let expectedGames,
//       result,
//       playerId;

//     beforeEach(async () => {
//       expectedGames = [{
//         game_id: chance.guid(),
//         fen: chance.string(),
//         player_one: chance.guid(),
//         player_two: chance.guid()
//       }];
//       mockOrWhere.mockResolvedValue(expectedGames);
//       mockWhere.mockReturnValue({
//         orWhere: mockOrWhere
//       })
//       mockKnex.mockReturnValue({
//         where: mockWhere
//       });

//       result = await db.selectGamesForPlayer(playerId);
//     });

//     it('should use knex', () => {
//       expect(mockKnex).toHaveBeenCalledTimes(1);
//       expect(mockKnex).toHaveBeenCalledWith('chess_club.tbl_game');
//     });

//     it('should look for player one', () => {
//       expect(mockWhere).toHaveBeenCalledTimes(1);
//       expect(mockWhere).toHaveBeenCalledWith({ player_one: playerId });
//     });

//     it('should look for player two', () => {
//       expect(mockOrWhere).toHaveBeenCalledTimes(1);
//       expect(mockOrWhere).toHaveBeenCalledWith({ player_one: playerId });
//     });

//     it('should return the games mapped to the domain', () => {
//       expect(result).toStrictEqual([{
//         gameId: expectedGames[0].game_id,
//         fen: expectedGames[0].fen,
//         playerOne: expectedGames[0].player_one,
//         playerTwo: expectedGames[0].player_two,
//       }])
//     });
//   });
// });