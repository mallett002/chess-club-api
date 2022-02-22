import Chance from 'chance';
import { GraphQLClient } from 'graphql-request';

import { createRandomPlayerPayload } from '../factories/player';
import { graphqlUrl } from '../utils';
import { deleteInvitations, deletePlayers, selectInvitation } from '../utils/db';
import { createInvitationMutation, deleteInvitationMutation } from '../utils/gql-queries';
import { createDBPlayer } from '../utils/player-repository';
import { getJwtForPlayer } from '../utils/token-utils';

const chance = new Chance();
describe('delete invitation', () => {
  let gqlClient,
    playerOne,
    playerTwoPayload,
    invitationId,
    playerTwo;

  beforeEach(async () => {
    await deleteInvitations();
    await deletePlayers();

    const playerOnePayload = createRandomPlayerPayload();
    
    playerTwoPayload = createRandomPlayerPayload();

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

    const createResponse = await gqlClient.request(createInvitationMutation, {
      inviteeUsername: playerTwo.username,
      invitorColor: chance.pickone('w', 'b')
    });

    invitationId = createResponse.createInvitation.invitationId;
  });

  it('should be able to delete an invitation', async () => {
    const response = await gqlClient.request(deleteInvitationMutation, {
      invitationId
    });

    expect(response.errors).toBeUndefined();

    const foundInvite = await selectInvitation(invitationId);

    expect(foundInvite).toBeNull();
  });

  it('should do something', async () => {
    const nonExistingInvitationId = chance.guid();
    const response = await gqlClient.request(deleteInvitationMutation, {
      invitationId: nonExistingInvitationId
    });

    expect(response.errors).toBeUndefined();

    const foundInvite = await selectInvitation(nonExistingInvitationId);

    expect(foundInvite).toBeNull();
  });

  it('should throw a validation error if invitationId is missing', async () => {
    try {
      await gqlClient.request(deleteInvitationMutation);
      throw new Error('Should have failed.');
    } catch (error) {
      expect(error.response.errors[0].extensions.code).toStrictEqual('BAD_USER_INPUT');
      expect(error.message).toContain('Variable \"$invitationId\" of required type \"ID!\" was not provided.');
    }
  });

  it('should throw an auth error if not authenticated', async () => {
    gqlClient = new GraphQLClient(graphqlUrl);

    try {
      await gqlClient.request(deleteInvitationMutation, {
        invitationId
      });
      throw new Error('Should have failed.');
    } catch (error) {
      expect(error.response.errors[0].extensions.code).toStrictEqual('UNAUTHENTICATED');
      expect(error.message).toContain('You must be logged in.');
    }
  });
});
