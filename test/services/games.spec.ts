import Chance from 'chance';

import { getGameByGameId } from '../../src/repository/games';
import { flattenPositions } from '../../src/services/board';
import { getBoardByGameId } from '../../src/services/games';
import { getChess } from '../../src/services/chess';

jest.mock('../../src/repository/games');
jest.mock('../../src/services/board');
jest.mock('../../src/services/chess');

describe('games service', () => {
  const chance = new Chance();

  describe('getBoardByGameId', () => {
    const mockgetGameByGameId = getGameByGameId as jest.MockedFunction<typeof getGameByGameId>;
    const flattenPositionsMock = flattenPositions as jest.MockedFunction<typeof flattenPositions>;
    const getChessMock = getChess as jest.MockedFunction<typeof getChess>;

    let gameId,
      result,
      chessInstance,
      expectedMoves,
      expectedPositions,
      expectedBoard,
      expectedTurn,
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
      expectedMoves = chance.string();
      expectedBoard = [chance.string(), chance.string()];
      expectedTurn = chance.string();
      chessInstance = {
        load: jest.fn(),
        moves: jest.fn().mockReturnValue(expectedMoves),
        board: jest.fn().mockReturnValue(expectedBoard),
        turn: jest.fn().mockReturnValue(expectedTurn)
      };

      expectedPositions = [chance.string(), chance.string()];

      mockgetGameByGameId.mockReturnValue(game);
      flattenPositionsMock.mockReturnValue(expectedPositions);
      getChessMock.mockReturnValue(chessInstance);

      result = getBoardByGameId(gameId);
    });

    afterEach(() => {
      jest.resetAllMocks();
    })

    it('should get the game by its gameId', () => {
      expect(mockgetGameByGameId).toHaveBeenCalledTimes(1);
      expect(mockgetGameByGameId).toHaveBeenCalledWith(gameId);
    });

    it('should get the chess instance', () => {
      expect(getChessMock).toHaveBeenCalledTimes(1);
    });

    it('should load the board by the fen on the game', () => {
      expect(chessInstance.load).toHaveBeenCalledTimes(1);
      expect(chessInstance.load).toHaveBeenCalledWith(game.fen);
    });

    it('should get the moves', () => {
      expect(chessInstance.moves).toHaveBeenCalledTimes(1);
      expect(chessInstance.moves).toHaveBeenCalledWith({ verbose: true });
    });

    it('should get the board', () => {
      expect(chessInstance.board).toHaveBeenCalledTimes(1);
    });

    it('should get the positions', () => {
      expect(flattenPositions).toHaveBeenCalledTimes(1);
      expect(flattenPositions).toHaveBeenCalledWith(expectedBoard);
    });
    
    it('should get the turn', () => {
      expect(chessInstance.turn).toHaveBeenCalledTimes(1);
    });

    it('should return the board object', () => {
      expect(result).toStrictEqual({
        gameId,
        moves: expectedMoves,
        playerOne: game.playerOne,
        playerTwo: game.playerTwo,
        positions: expectedPositions,
        turn: expectedTurn
      });
    });
  });
});