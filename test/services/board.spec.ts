import Chance from 'chance';

import { createMovesByLabel } from '../../src/services/board';

const chance = new Chance();

describe('board service', () => {
  describe('createMovesByLabel', () => {
    let result,
      moveOne,
      moveTwo,
      moveThree,
      movesList,
      expectedFrom,
      otherFrom;

    const createRandomMove = (overrides = {}) => ({
      color: chance.string(),
      from: chance.string(),
      to: chance.string(),
      flags: chance.string(),
      piece: chance.string(),
      san: chance.string(),
      ...overrides
    });

    beforeEach(() => {
      expectedFrom = chance.string();
      otherFrom = chance.string()
      moveOne: createRandomMove({ from: expectedFrom });
      moveTwo: createRandomMove({ from: expectedFrom });
      moveThree: createRandomMove({ from: otherFrom });
      movesList = [
        moveOne,
        moveTwo,
        moveThree
      ];

      result = createMovesByLabel(movesList);
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should create a list of the moves by the from key', () => {
      expect(result).toStrictEqual({
        [expectedFrom]: [moveOne, moveTwo],
        [otherFrom]: [moveThree]
      });
    });
  });
});