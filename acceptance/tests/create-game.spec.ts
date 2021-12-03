import Chance from 'chance';
import { gql, GraphQLClient } from 'graphql-request';

import { createRandomPlayerPayload } from '../factories/player';
import { graphqlUrl } from '../utils';
import { deleteGames, deleteInvitations, deletePlayers, deletePlayersGames, selectPlayerByUsername } from '../utils/db';
import { createDBPlayer } from '../utils/player-repository';
import { getJwtForPlayer } from '../utils/token-utils';

const chance = new Chance();

describe('create game', () => {
  const createGameMutation = gql`
    mutation createGame($invitationId: ID!, $inviteeColor: String!) {
          createGame(invitationId: $invitationId, inviteeColor: $inviteeColor) {
            gameId
            playerOne
            playerTwo
            turn
          }
        }
  `;
  const createInvitationMutation = gql`
    mutation createInvitation($inviteeUsername: String!) {
      createInvitation(inviteeUsername: $inviteeUsername) {
        invitationId
        invitor {
          playerId
          username
        }
        invitee {
          playerId
          username
        }
      }
    }
  `;

  let gqlClient,
    playerOne,
    playerTwo,
    invitation;

  beforeEach(async () => {
    await deleteInvitations();
    await deletePlayersGames();
    await deleteGames();
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

    const response = await gqlClient.request(createInvitationMutation, {
      inviteeUsername: playerTwo.username
    });

    invitation = response.createInvitation;
  });

  it('should be able to create a game from an invitation', async () => {
    const response = await gqlClient.request(createGameMutation, {
      invitationId: invitation.invitationId,
      inviteeColor: chance.pickone(['w', 'b'])
    });

    expect(response.createGame.gameId).toBeDefined();
    expect(response.errors).toBeUndefined();
  });

  it('should throw a validation error if an arg is missing', async () => {
    const argToDelete = chance.pickone(['invitationId', 'inviteeColor']);
    const args = {
      invitationId: invitation.invitationId,
      inviteeColor: chance.pickone(['w', 'b'])
    };
    const argTypes = {invitationId: 'ID!', inviteeColor: 'String!'};

    delete args[argToDelete];

    try {
      await gqlClient.request(createGameMutation, args);
      throw new Error('Should have failed.');
    } catch (error) {
      expect(error.response.errors[0].extensions.code).toStrictEqual('BAD_USER_INPUT');
      expect(error.message).toContain(`Variable \"$${argToDelete}\" of required type \"${argTypes[argToDelete]}\" was not provided.`);
    }
  });

  it('should throw an auth error if not authenticated', async () => {
    gqlClient = new GraphQLClient(graphqlUrl);

    try {
      await gqlClient.request(createGameMutation, {
        invitationId: invitation.invitationId,
        inviteeColor: chance.pickone(['w', 'b'])
      });
      throw new Error('Should have failed.');
    } catch (error) {
      expect(error.response.errors[0].extensions.code).toStrictEqual('UNAUTHENTICATED');
      expect(error.message).toContain('You must be logged in.');
    }
  });
});
