import Chance from 'chance';

import getBoardResolver from '../../src/resolvers/get-board';
import { getBoardByGameId } from '../../src/services/games';

jest.mock('../../src/services/games');

const chance = new Chance();

describe('get board resolver', () => {
  const getBoardMock = getBoardByGameId as jest.MockedFunction<typeof getBoardByGameId>;

  let gameId,
    expectedBoard,
    args,
    root,
    context,
    result;

  beforeEach(() => {
    gameId = chance.guid();
    args = { gameId };
    root = { [chance.string()]: chance.string() };
    context = { [chance.string()]: chance.string() };
    expectedBoard = { [chance.string()]: chance.string() };

    getBoardMock.mockReturnValue(expectedBoard);

    result = getBoardResolver(root, args, context);
  });

  it('should get the board from the service', () => {
    expect(getBoardMock).toHaveBeenCalledTimes(1);
    expect(getBoardMock).toHaveBeenCalledWith(gameId);
  });

  it('should return the board from the service', () => {
    expect(result).toStrictEqual(expectedBoard);
  });
});
