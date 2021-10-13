// import Chance from 'chance';
// import {Chess} from 'chess.js';

// import { getChess } from '../../src/services/chess';

// jest.mock('chess.js');

// const chance = new Chance();

// describe('chess service', () => {
//   const ChessMock = Chess as jest.MockedClass<typeof Chess>;
//   describe('getChess', () => {
//     let result,
//         expectedChess;

//     beforeEach(() => {
//       expectedChess = {[chance.guid()]: chance.string()};
//       ChessMock.mockImplementation(() => expectedChess);

//       result = getChess();
//     });

//     afterEach(() => {
//       jest.resetAllMocks();
//     });

//     describe('when no chess has been instantiated', () => {
//       it('should return a new instance', () => {
//         expect(ChessMock).toHaveBeenCalledTimes(1);
//         expect(result).toStrictEqual(expectedChess);
//       });
//     });

//     describe('when newGame is true', () => {
//       beforeEach(() => {
//         result = getChess(true);
//       });

//       it('should return a new instance', () => {
//         expect(ChessMock).toHaveBeenCalledTimes(1);
//         expect(result).toStrictEqual(expectedChess);
//       });
//     });
//   });
// });