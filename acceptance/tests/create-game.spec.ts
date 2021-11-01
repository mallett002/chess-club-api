import {gql, GraphQLClient} from 'graphql-request';

import { createRandomPlayerPayload } from '../factories/player';
import {graphqlUrl} from '../utils';
import { deleteGames, deletePlayers, selectPlayerByUsername } from '../utils/db';
import { decodeToken, getJwtForPlayer } from '../utils/token-utils';

describe('create player', () => {
  const createGameMutation = gql`
    mutation createGame($playerOne: ID!, $playerTwo: ID!) {
          createGame(playerOne: $playerOne, playerTwo: $playerTwo) {
            gameId
            playerOne
            playerTwo
            turn
          }
        }
  `;

  let gqlClient;

  beforeEach(async () => {
    const player = createRandomPlayerPayload();
    const dbPlayer = createDBPlayer(player);
    const userJwt = await getJwtForPlayer(player);

    gqlClient = new GraphQLClient(graphqlUrl, {
      headers: {
        authorization: `Bearer ${userJwt}`
      }
    });

    await deletePlayers();
    await deleteGames();
  });

  it('should be able to create a game', async () => {
    const createPlayerPayload = createRandomPlayerPayload();
    const response = await gqlClient.request(createPlayerMutation, createPlayerPayload);
    const decodedToken = decodeToken(response.createPlayer.token);
    const dbPlayer = await selectPlayerByUsername(decodedToken.sub);

    expect(response.errors).toBeUndefined();
    expect(decodedToken.sub).toStrictEqual(createPlayerPayload.username);
    expect(dbPlayer.username).toStrictEqual(createPlayerPayload.username);
  });

  // it('should throw a validation error if no username is provided', async () => {
  //   const createPlayerPayload = createRandomPlayerPayload({username: null});

  //   try {
  //     await gqlClient.request(createPlayerMutation, createPlayerPayload);
  //     throw new Error('Should have failed.');
  //   } catch (error) {
  //     expect(error.response.errors[0].extensions.code).toStrictEqual('BAD_USER_INPUT');
  //     expect(error.message).toContain('Variable \"$username\" of non-null type \"String!\" must not be null.');
  //   }
  // });

  // it('should throw a validation error if no password is provided', async () => {
  //   const createPlayerPayload = createRandomPlayerPayload({password: null});

  //   try {
  //     await gqlClient.request(createPlayerMutation, createPlayerPayload);
  //     throw new Error('Should have failed.');
  //   } catch (error) {
  //     expect(error.response.errors[0].extensions.code).toStrictEqual('BAD_USER_INPUT');
  //     expect(error.message).toContain('Variable \"$password\" of non-null type \"String!\" must not be null.');
  //   }
  // });
});
