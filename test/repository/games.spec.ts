import Chance from 'chance';
import { getGameByGameId, insertNewGame } from '../../src/repository/games';

const chance = new Chance();

describe('games repository', () => {
  describe('getGameByGameId', () => {
    const createRandomGame = (overrides = {}) => ({
      fen: chance.string(),
      gameId: chance.guid(),
      playerOne: chance.string(),
      playerTwo: chance.string(),
      turn: chance.string(),
      ...overrides
    });
    
    let gameId,
        expectedGame,
        result,
        games;

    beforeEach(() => {
      gameId = chance.guid();
      expectedGame = createRandomGame({gameId});
      games = chance.shuffle([
        expectedGame,
        createRandomGame(),
        createRandomGame()
      ]);

      games.forEach((game) => insertNewGame(game.gameId, game));
      
      result = getGameByGameId(gameId);
    });

    it('should return the game with the correct gameId', () => {
      expect(result).toStrictEqual(expectedGame);
    });  
  });
});