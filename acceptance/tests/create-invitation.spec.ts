import { gql, GraphQLClient } from 'graphql-request';

import { createRandomPlayerPayload } from '../factories/player';
import { graphqlUrl } from '../utils';
import { deleteGames, deletePlayers, deletePlayersGames, selectPlayerByUsername } from '../utils/db';
import { createDBPlayer } from '../utils/player-repository';
import { getJwtForPlayer } from '../utils/token-utils';

describe('create invitation', () => {
  const createInvitationMutation = gql`
    mutation createInvitation($playerOne: ID!, $playerTwo: ID!) {
          createInvitation(playerOne: $playerOne, playerTwo: $playerTwo) {
            invitationId
          }
        }
  `;

  let gqlClient,
    playerOne,
    playerTwo;

  beforeEach(async () => {
    await deleteInvitations();
    await deletePlayers();

    const playerOnePayload = createRandomPlayerPayload();
    const playerTwoPayload = createRandomPlayerPayload();

    [playerOne, playerTwo] = await Promise.all([
      createDBPlayer(playerOnePayload),
      createDBPlayer(playerTwoPayload)
    ]);

    const userJwt = await getJwtForPlayer(playerOnePayload);

    gqlClient = new GraphQLClient(graphqlUrl, {
      headers: {
        authorization: userJwt
      }
    });
  });

  it('should be able to create an invitation', async () => {
    const response = await gqlClient.request(createInvitationMutation, {
      playerOne: playerOne.player_id,
      playerTwo: playerTwo.player_id
    });

    expect(response.createInvitation.invitationId).toBeDefined();
    expect(response.errors).toBeUndefined();
  });

  // it('should throw a validation error if a playerId is missing', async () => {
  //   try {
  //     await gqlClient.request(createGameMutation, {
  //       playerOne: playerOne.player_id
  //     });
  //     throw new Error('Should have failed.');
  //   } catch (error) {
  //     expect(error.response.errors[0].extensions.code).toStrictEqual('BAD_USER_INPUT');
  //     expect(error.message).toContain('Variable \"$playerTwo\" of required type \"ID!\" was not provided.');
  //   }
  // });

  // it('should throw an auth error if not authenticated', async () => {
  //   gqlClient = new GraphQLClient(graphqlUrl);

  //   try {
  //     await gqlClient.request(createGameMutation, {
  //       playerOne: playerOne.player_id,
  //       playerTwo: playerTwo.player_id
  //     });
  //     throw new Error('Should have failed.');
  //   } catch (error) {
  //     expect(error.response.errors[0].extensions.code).toStrictEqual('UNAUTHENTICATED');
  //     expect(error.message).toContain('You must be logged in.');
  //   }
  // });
});
