import Chance from 'chance';
import { GraphQLClient } from 'graphql-request';

import { createRandomPlayerPayload } from '../factories/player';
import { graphqlUrl } from '../utils';
import { deleteInvitations, deletePlayers } from '../utils/db';
import { createInvitationMutation } from '../utils/gql-queries';
import { createDBPlayer } from '../utils/player-repository';
import { getJwtForPlayer } from '../utils/token-utils';

const chance = new Chance();
describe('create invitation', () => {
  let gqlClient,
    playerOne,
    playerTwoPayload,
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
  });

  it('should be able to create an invitation', async () => {
    const response = await gqlClient.request(createInvitationMutation, {
      inviteeUsername: playerTwo.username,
      invitorColor: chance.pickone('w', 'b')
    });

    expect(response.createInvitation.invitationId).toBeDefined();
    expect(response.createInvitation.invitor).toStrictEqual({
      playerId: playerOne.player_id,
      username: playerOne.username
    });
    expect(response.createInvitation.invitee).toStrictEqual({
      playerId: playerTwo.player_id,
      username: playerTwo.username
    });
    expect(response.errors).toBeUndefined();
  });

  it('should throw a validation error if inviteeUsername is missing', async () => {
    try {
      await gqlClient.request(createInvitationMutation, {
        invitorColor: chance.pickone('w', 'b')
      });
      throw new Error('Should have failed.');
    } catch (error) {
      expect(error.response.errors[0].extensions.code).toStrictEqual('BAD_USER_INPUT');
      expect(error.message).toContain('Variable \"$inviteeUsername\" of required type \"String!\" was not provided.');
    }
  });

  it('should throw a validation error if invitorColor is missing', async () => {
    try {
      await gqlClient.request(createInvitationMutation, {
        inviteeUsername: playerTwo.username
      });
      throw new Error('Should have failed.');
    } catch (error) {
      expect(error.response.errors[0].extensions.code).toStrictEqual('BAD_USER_INPUT');
      expect(error.message).toContain('Variable \"$invitorColor\" of required type \"InvitorColor!\" was not provided.');
    }
  });

  it('should throw an auth error if not authenticated', async () => {
    gqlClient = new GraphQLClient(graphqlUrl);

    try {
      await gqlClient.request(createInvitationMutation, {
        inviteeUsername: playerTwo.username,
        invitorColor: chance.pickone('w', 'b')
      });
      throw new Error('Should have failed.');
    } catch (error) {
      expect(error.response.errors[0].extensions.code).toStrictEqual('UNAUTHENTICATED');
      expect(error.message).toContain('You must be logged in.');
    }
  });

  it('should not let you invite yourself', async () => {
    try {
      await gqlClient.request(createInvitationMutation, {
        inviteeUsername: playerOne.username,
        invitorColor: chance.pickone('w', 'b')
      });
      throw new Error('Should have failed.');
    } catch (error) {
      expect(error.response.errors[0].extensions.code).toStrictEqual('BAD_USER_INPUT');
      expect(error.message).toContain('player attempting to invite self');
    }
  });

  it('should not attempt to invite player that does not exist', async () => {
    const inviteeUsername = chance.email();

    try {
      await gqlClient.request(createInvitationMutation, {
        inviteeUsername,
        invitorColor: chance.pickone('w', 'b')
      });
      throw new Error('Should have failed.');
    } catch (error) {
      expect(error.response.errors[0].extensions.code).toStrictEqual('BAD_USER_INPUT');
      expect(error.message).toContain(`player with username ${inviteeUsername} not found`);
    }
  });

  it('should not attempt to invite with existing invite from same player', async () => {
    await gqlClient.request(createInvitationMutation, {
      inviteeUsername: playerTwo.username,
      invitorColor: chance.pickone('w', 'b')
    });

    try {
      await gqlClient.request(createInvitationMutation, {
        inviteeUsername: playerTwo.username,
        invitorColor: chance.pickone('w', 'b')
      });
      throw new Error('Should have failed.');
    } catch (error) {
      expect(error.response.errors[0].extensions.code).toStrictEqual('BAD_USER_INPUT');
      expect(error.message).toContain(`Existing invitation with ${playerTwo.username}`);
    }
  });

  it('should not allow creating invite when initee has already made an invite with invitor', async () => {
    const userJwt = await getJwtForPlayer(playerTwoPayload);

    const playerTwoClient = new GraphQLClient(graphqlUrl, {
      headers: {
        authorization: userJwt
      }
    });

    await playerTwoClient.request(createInvitationMutation, {
      inviteeUsername: playerOne.username,
      invitorColor: chance.pickone('w', 'b')
    });

    try {
      await gqlClient.request(createInvitationMutation, {
        inviteeUsername: playerTwo.username,
        invitorColor: chance.pickone('w', 'b')
      });
      throw new Error('Should have failed.');
    } catch (error) {
      expect(error.response.errors[0].extensions.code).toStrictEqual('BAD_USER_INPUT');
      expect(error.message).toContain(`Existing invitation with ${playerTwo.username}`);
    }
  });
});
