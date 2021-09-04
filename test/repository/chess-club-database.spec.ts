import { SQLDataSource } from 'datasource-sql';
import Chance from 'chance';

import ChessClubDatabase from '../../src/repository/chess-club-database';

class KnexMock {
  insert = jest.fn()
}

jest.mock('datasource-sql', () => {
  class MockSqlataSource {
      knex = new KnexMock();
  }

  return {
    SQLDataSource: MockSqlataSource,
  }
});

const chance = new Chance();

describe('ChessClubDatabase', () => {
  const dataSourceMock = SQLDataSource as jest.MockedClass<typeof SQLDataSource>;

  const db = new ChessClubDatabase({[chance.guid()]: chance.string()});
  // const dataSourceMock = new SQLDataSource(knexConfig);

  describe('insertNewGame', () => {
    let fen,
      playerOne,
      playerTwo;

    beforeEach(async () => {
      // dataSourceMock.mockClear();

      fen = chance.string();
      playerOne = chance.guid();
      playerTwo = chance.guid();

      await db.insertNewGame(fen, playerOne, playerTwo);
    });

    it('insert the game for the players', () => {
      expect(dataSourceMock.knex.insert).toHaveBeenCalledTimes(1);
      expect(dataSourceMock.knex.insert).toHaveBeenCalledWith({

      });
    });

  });
});