import Chance from 'chance';

import ChessClubDatabase from '../../src/repository/chess-club-database';

const chance = new Chance();

const gameId = chance.guid();
const fen = chance.guid();
const game = {
  game_id: gameId,
  fen,
  player_one: chance.string(),
  player_two: chance.string()
};
const mockReturning = jest.fn().mockResolvedValue(gameId);
const mockInsert = jest.fn().mockReturnValue({
  returning: mockReturning
});
const mockWhere = jest.fn().mockReturnValue([game]);
const mockKnex = jest.fn().mockReturnValue({
  insert: mockInsert,
  where: mockWhere
});

jest.mock('datasource-sql', () => {
  class MockDataSource {
    knex = mockKnex
  }

  return {
    SQLDataSource: MockDataSource
  }
});

describe('ChessClubDatabase', () => {
  const fakeConnection = {[chance.guid()]: chance.string()};
  const db = new ChessClubDatabase(fakeConnection);

  describe('insertNewGame', () => {
    let fen,
      playerOne,
      playerTwo;

    beforeEach(async () => {
      fen = chance.string();
      playerOne = chance.guid();
      playerTwo = chance.guid();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('insert the game for the players', async () => {
      await db.insertNewGame(fen, playerOne, playerTwo);

      expect(mockKnex).toHaveBeenCalledTimes(3);
      expect(mockKnex).toHaveBeenNthCalledWith(1, 'chess_club.tbl_game');
      expect(mockInsert).toHaveBeenCalledTimes(3);
      expect(mockInsert).toHaveBeenNthCalledWith(1, {
        fen,
        player_one: playerOne,
        player_two: playerTwo
      });
    });

    it('should insert a record in players games for player one', async () => {
      await db.insertNewGame(fen, playerOne, playerTwo);

      expect(mockKnex).toHaveBeenCalledTimes(3);
      expect(mockKnex).toHaveBeenNthCalledWith(2, 'chess_club.tbl_players_games');
      expect(mockInsert).toHaveBeenCalledTimes(3);
      expect(mockInsert).toHaveBeenNthCalledWith(2, {
        player_id: playerOne,
        player_color: 'w'
      });
    });

    it('should insert a record in players games for player two', async () => {
      await db.insertNewGame(fen, playerOne, playerTwo);

      expect(mockKnex).toHaveBeenCalledTimes(3);
      expect(mockKnex).toHaveBeenNthCalledWith(3, 'chess_club.tbl_players_games');
      expect(mockInsert).toHaveBeenCalledTimes(3);
      expect(mockInsert).toHaveBeenNthCalledWith(3, {
        player_id: playerTwo,
        player_color: 'b'
      });
    });

    it('should return the game id', async () => {
      const result = await db.insertNewGame(fen, playerOne, playerTwo);

      expect(result).toStrictEqual(gameId);
    });
  });

  // next
  describe('getGameByGameId', () => {
    let gameId;

    beforeEach(async () => {
      gameId = chance.string();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should get the game from the database', async () => {
      await db.getGameByGameId(gameId);

      expect(mockKnex).toHaveBeenCalledTimes(1);
      expect(mockKnex).toHaveBeenCalledWith('chess_club.tbl_game');
      expect(mockWhere).toHaveBeenCalledTimes(1);
      expect(mockWhere).toHaveBeenCalledWith(
        'game_id',
        gameId
      );
    });

    it('should select the game by its gameId', async () => {
      await db.getGameByGameId(gameId);

      expect(mockKnex).toHaveBeenCalledTimes(1);
      expect(mockKnex).toHaveBeenCalledWith('chess_club.tbl_game');
    });

    it('should return the game', async () => {
      const result = await db.getGameByGameId(gameId);

      expect(result).toStrictEqual({
        gameId: game.game_id,
        fen: game.fen,
        playerOne: game.player_one,
        playerTwo: game.player_two
      });
    });
  });

  describe('updateGame', () => {
    it('should use the game table', async () => {
      await db.updateGame(gameId, fen);

      expect(mockKnex).toHaveBeenCalledTimes(1);
    });
  });
});