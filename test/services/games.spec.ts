import Chance from 'chance';

import { getGameByGameId } from '../../src/repository/games';
import { getBoardByGameId } from '../../src/services/games';

jest.mock('../../src/repository/games');

describe('games service', () => {
  const chance = new Chance();

  describe('getBoardByGameId', () => {
    const mockgetGameByGameId = getGameByGameId as jest.MockedFunction<typeof getGameByGameId>;

    let gameId,
      result,
      game;

    beforeEach(() => {
      gameId = chance.guid();
      game = {
        fen: chance.string(),
        gameId: chance.string(),
        playerOne: chance.string(),
        playerTwo: chance.string(),
        turn: chance.string()
      };

      const board = {
        gameId,
        moves: chess.moves({ verbose: true }),
        playerOne: game.playerOne,
        playerTwo: game.playerTwo,
        positions: flattenPositions(chess.board()),
        turn
      };

      mockgetGameByGameId.mockReturnValue(game);

      result = getBoardByGameId(gameId);
    });
    it('should get the game by its gameId', () => {
      expect(mockgetGameByGameId).toHaveBeenCalledTimes(1);
      expect(mockgetGameByGameId).toHaveBeenCalledWith(gameId);
    });

    it('should ', () => {

    });
  });
});