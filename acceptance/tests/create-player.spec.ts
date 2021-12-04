import {GraphQLClient} from 'graphql-request';

import { createRandomPlayerPayload } from '../factories/player';
import {graphqlUrl} from '../utils';
import { deletePlayers, selectPlayerByUsername } from '../utils/db';
import { createPlayerMutation } from '../utils/gql-queries';
import { decodeToken } from '../utils/token-utils';

describe('create player', () => {
  let gqlClient;

  beforeEach(async () => {
    gqlClient = new GraphQLClient(graphqlUrl);

    await deletePlayers();
  });

  it('should be able to create a player', async () => {
    const createPlayerPayload = createRandomPlayerPayload();
    const response = await gqlClient.request(createPlayerMutation, createPlayerPayload);
    const decodedToken = decodeToken(response.createPlayer.token);
    const dbPlayer = await selectPlayerByUsername(decodedToken.sub);

    expect(response.errors).toBeUndefined();
    expect(decodedToken.sub).toStrictEqual(createPlayerPayload.username);
    expect(dbPlayer.username).toStrictEqual(createPlayerPayload.username);
  });

  it('should throw a validation error if no username is provided', async () => {
    const createPlayerPayload = createRandomPlayerPayload({username: null});

    try {
      await gqlClient.request(createPlayerMutation, createPlayerPayload);
      throw new Error('Should have failed.');
    } catch (error) {
      expect(error.response.errors[0].extensions.code).toStrictEqual('BAD_USER_INPUT');
      expect(error.message).toContain('Variable \"$username\" of non-null type \"String!\" must not be null.');
    }
  });

  it('should throw a validation error if no password is provided', async () => {
    const createPlayerPayload = createRandomPlayerPayload({password: null});

    try {
      await gqlClient.request(createPlayerMutation, createPlayerPayload);
      throw new Error('Should have failed.');
    } catch (error) {
      expect(error.response.errors[0].extensions.code).toStrictEqual('BAD_USER_INPUT');
      expect(error.message).toContain('Variable \"$password\" of non-null type \"String!\" must not be null.');
    }
  });
});
