import { SQLDataSource } from 'datasource-sql';
import Chance from 'chance';

import ChessClubDatabase from '../../src/repository/chess-club-database';

const mockInsert = jest.fn();
const mockKnex = jest.fn().mockReturnValue({
  insert: mockInsert
});

jest.mock('datasource-sql', () => {
  class MockDataSource {
    knex = mockKnex
  }

  return {
    SQLDataSource: MockDataSource
  }
});

const chance = new Chance();

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

      await db.insertNewGame(fen, playerOne, playerTwo);
    });

    it('insert the game for the players', () => {
      expect(mockKnex).toHaveBeenCalledTimes(1);
      expect(mockKnex).toHaveBeenCalledWith('chess_club.tbl_game');
      expect(mockInsert).toHaveBeenCalledTimes(1);
      expect(mockInsert).toHaveBeenCalledWith({
        fen,
        player_one: playerOne,
        player_two: playerTwo
      });
    });

  });
});