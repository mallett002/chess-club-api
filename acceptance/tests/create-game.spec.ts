import Chance from 'chance';
import { GraphQLClient } from 'graphql-request';

import { createRandomPlayerPayload } from '../factories/player';
import { graphqlUrl } from '../utils';
import { deleteGames, deleteInvitations, deletePlayers, deletePlayersGames, selectInvitations, selectPlayerByUsername } from '../utils/db';
import { createGameMutation, createInvitationMutation } from '../utils/gql-queries';
import { createDBPlayer } from '../utils/player-repository';
import { getJwtForPlayer } from '../utils/token-utils';

const chance = new Chance();

describe('create game', () => {
  let gqlClient,
    firstPlayer,
    secondPlayer,
    invitorColor,
    invitation;

  beforeEach(async () => {
    await deleteInvitations();
    await deletePlayersGames();
    await deleteGames();
    await deletePlayers();

    const playerOnePayload = createRandomPlayerPayload();
    const playerTwoPayload = createRandomPlayerPayload();

    [firstPlayer, secondPlayer] = await Promise.all([
      createDBPlayer(playerOnePayload),
      createDBPlayer(playerTwoPayload)
    ]);

    const userJwt = await getJwtForPlayer(playerOnePayload);

    gqlClient = new GraphQLClient(graphqlUrl, {
      headers: {
        authorization: userJwt
      }
    });

    invitorColor = chance.pickone('w', 'b');

    const response = await gqlClient.request(createInvitationMutation, {
      inviteeUsername: secondPlayer.username,
      invitorColor
    });

    invitation = response.createInvitation;
  });

  it('should be able to create a game from an invitation', async () => {
    const response = await gqlClient.request(createGameMutation, {
      invitationId: invitation.invitationId
    });

    const expectedPlayerOne = invitorColor === 'b' ? secondPlayer.player_id : firstPlayer.player_id;

    expect(response.createGame.gameId).toBeDefined();
    expect(response.createGame.playerOne).toStrictEqual(expectedPlayerOne);
    expect(response.errors).toBeUndefined();
  });

  it('should delete the invitation after the game is created', async () => {
    let invitations = await selectInvitations();
    let foundInvitation = invitations.find((it) => it.invitation_id === invitation.invitationId);

    expect(foundInvitation).toBeDefined();

    await gqlClient.request(createGameMutation, {
      invitationId: invitation.invitationId,
      invitorColor: chance.pickone(['w', 'b'])
    });

    invitations = await selectInvitations();
    foundInvitation = invitations.find((it) => it.invitation_id === invitation.invitationId);

    expect(foundInvitation).toBeUndefined();
  });

  it('should throw a validation error if an arg is missing', async () => {
    try {
      await gqlClient.request(createGameMutation);
      throw new Error('Should have failed.');
    } catch (error) {
      expect(error.response.errors[0].extensions.code).toStrictEqual('BAD_USER_INPUT');
      expect(error.message).toContain(`Variable \"$invitationId\" of required type \"ID!\" was not provided.`);
    }
  });

  it('should throw an auth error if not authenticated', async () => {
    gqlClient = new GraphQLClient(graphqlUrl);

    try {
      await gqlClient.request(createGameMutation, {
        invitationId: invitation.invitationId
      });
      throw new Error('Should have failed.');
    } catch (error) {
      expect(error.response.errors[0].extensions.code).toStrictEqual('UNAUTHENTICATED');
      expect(error.message).toContain('You must be logged in.');
    }
  });
});
