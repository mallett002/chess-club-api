import Chance from 'chance';
import { GraphQLClient } from 'graphql-request';

import { createRandomPlayerPayload } from '../factories/player';
import { graphqlUrl } from '../utils';
import { deleteInvitations, deletePlayers } from '../utils/db';
import { createInvitationMutation, getInvitationsQuery } from '../utils/gql-queries';
import { createDBPlayer } from '../utils/player-repository';
import { getJwtForPlayer } from '../utils/token-utils';

const chance = new Chance();

describe('get invitations', () => {
  let gqlClient,
    firstPlayer,
    secondPlayer,
    secondPlayerPayload,
    thirdPlayerPayload,
    thirdPlayer;

  beforeEach(async () => {
    await deleteInvitations();
    await deletePlayers();

    const firstPlayerPayload = createRandomPlayerPayload();
    secondPlayerPayload = createRandomPlayerPayload();
    thirdPlayerPayload = createRandomPlayerPayload();

    [firstPlayer, secondPlayer, thirdPlayer] = await Promise.all([
      createDBPlayer(firstPlayerPayload),
      createDBPlayer(secondPlayerPayload),
      createDBPlayer(thirdPlayerPayload)
    ]);

    const userJwt = await getJwtForPlayer(firstPlayerPayload);

    gqlClient = new GraphQLClient(graphqlUrl, {
      headers: {
        authorization: userJwt
      }
    });
  });

  it('should be able to get invitations to others', async () => {
    const { createInvitation: invitationOne } = await gqlClient.request(createInvitationMutation, {
      inviteeUsername: secondPlayer.username,
      invitorColor: chance.pickone('w', 'b')
    });
    const { createInvitation: invitationTwo } = await gqlClient.request(createInvitationMutation, {
      inviteeUsername: thirdPlayer.username,
      invitorColor: chance.pickone('w', 'b')
    });

    const { getInvitations } = await gqlClient.request(getInvitationsQuery);

    expect(getInvitations.errors).toBeUndefined();
    expect(getInvitations.invitations).toStrictEqual([
      {
        invitationId: invitationOne.invitationId,
        invitee: secondPlayer.username
      },
      {
        invitationId: invitationTwo.invitationId,
        invitee: thirdPlayer.username
      }
    ]);
    expect(getInvitations.inboundGameRequests).toStrictEqual([]);
  });

  it('should get inbound game requests from others', async () => {
    const secondUserJwt = await getJwtForPlayer(secondPlayerPayload);
    const secondGqlClient = new GraphQLClient(graphqlUrl, {
      headers: {
        authorization: secondUserJwt
      }
    });
    const thirdUserJwt = await getJwtForPlayer(thirdPlayerPayload);
    const thirdGqlClient = new GraphQLClient(graphqlUrl, {
      headers: {
        authorization: thirdUserJwt
      }
    });
    
    const { createInvitation: invitationOne } = await secondGqlClient.request(createInvitationMutation, {
      inviteeUsername: firstPlayer.username,
      invitorColor: chance.pickone('w', 'b')
    });
    const { createInvitation: invitationTwo } = await thirdGqlClient.request(createInvitationMutation, {
      inviteeUsername: firstPlayer.username,
      invitorColor: chance.pickone('w', 'b')
    });

    const { getInvitations } = await gqlClient.request(getInvitationsQuery);

    expect(getInvitations.errors).toBeUndefined();
    expect(getInvitations.inboundGameRequests).toStrictEqual([
      {
        invitationId: invitationOne.invitationId,
        invitor: secondPlayer.username
      },
      {
        invitationId: invitationTwo.invitationId,
        invitor: thirdPlayer.username
      }
    ]);
    expect(getInvitations.invitations).toStrictEqual([]);
  });

  it('should throw an auth error if not authenticated', async () => {
    gqlClient = new GraphQLClient(graphqlUrl);

    try {
      await gqlClient.request(getInvitationsQuery);
      throw new Error('Should have failed.');
    } catch (error) {
      expect(error.response.errors[0].extensions.code).toStrictEqual('UNAUTHENTICATED');
      expect(error.message).toContain('You must be logged in.');
    }
  });
});
