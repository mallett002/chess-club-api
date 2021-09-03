import { SQLDataSource } from 'datasource-sql';
import Chance from 'chance';

import ChessClubDatabase from '../../src/repository/chess-club-database';

jest.mock('datasource-sql', () => {
  class MockSQLDataSource {
    // baseUrl = ''
    // get = jest.fn(() => (/* Your Definition here */)
    /*knex stuff*/
    public knex =  { insert: jest.fn() }
  }

  return {
    SQLDataSource: MockSQLDataSource,
  }
});

const chance = new Chance();

describe('ChessClubDatabase', () => {
  const db = new ChessClubDatabase({});
  const sqlDataSource = new SQLDataSource({});

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
      expect(sqlDataSource.knex.insert).toHaveBeenCalledTimes(1);
      expect(this.knex.insert).toHaveBeenCalledWith({

      });
    });
  });
});