import Chance from 'chance';
import { FailedDependency } from 'http-errors';

import createGameResolver from '../../src/resolvers/create-game';

const chance = new Chance();

describe('Create Game Resolver', () => {
  let parent,
    args,
    context;

  beforeEach(() => {
    parent = { [chance.string()]: chance.string() };
    args = {
      playerOne: chance.string(),
      playerTwo: chance.string()
    };
    context = {
      dataSources: {
        chessClubDatabase: { [chance.string()]: chance.string() }
      }
    }
  });

  it('should throw a validation error if playerOne is missing', async () => {
    delete args.playerOne;

    try {
      await createGameResolver(parent, args, context);
      // Todo: figure out how to fail here
      fail('should have thrown.');
    } catch (error) {
      expect(error.message).toStrictEqual('missing or invalid value for playerOne or playerTwo');
      expect(error.extensions.code).toStrictEqual('GRAPHQL_VALIDATION_FAILED');
    }
  });

  it('should throw a validation error if playerTwo is missing', async () => {
    delete args.playerTwo;

    try {
      await createGameResolver(parent, args, context);
    } catch (error) {
      expect(error.message).toStrictEqual('missing or invalid value for playerOne or playerTwo');
      expect(error.extensions.code).toStrictEqual('GRAPHQL_VALIDATION_FAILED');
    }
  });
});