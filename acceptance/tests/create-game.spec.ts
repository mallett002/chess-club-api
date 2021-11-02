import {gql, GraphQLClient} from 'graphql-request';

import { createRandomPlayerPayload } from '../factories/player';
import {graphqlUrl} from '../utils';
import { deleteGames, deletePlayers, selectPlayerByUsername } from '../utils/db';
import { createDBPlayer } from '../utils/player-repository';
import { getJwtForPlayer } from '../utils/token-utils';

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

  let gqlClient,
      playerOne,
      playerTwo;

  beforeEach(async () => {
    await deletePlayers();
    await deleteGames();

    const playerOnePayload = createRandomPlayerPayload();
    const playerTwoPayload = createRandomPlayerPayload();

    [playerOne, playerTwo] = await Promise.all([
      createDBPlayer(playerOnePayload),
      createDBPlayer(playerTwoPayload)
    ]);

    const userJwt = await getJwtForPlayer(playerOnePayload);

    console.log({userJwt});
    

    gqlClient = new GraphQLClient(graphqlUrl, {
      headers: {
        authorization: `Bearer ${userJwt}`
      }
    });
  });

  it('should be able to create a game', async () => {
    const response = await gqlClient.request(createGameMutation, {
      playerOne: playerOne.player_id,
      playerTwo: playerTwo.player_id
    });

    expect(response.createGame.gameId).toBeDefined();
    expect(response.errors).toBeUndefined();
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
