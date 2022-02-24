import Chance from 'chance';
import { GraphQLClient } from 'graphql-request';

import { createRandomPlayerPayload } from '../factories/player';
import { graphqlUrl } from '../utils';
import { deleteGames, deleteInvitations, deletePlayers, deletePlayersGames, selectInvitations, selectPlayerByUsername } from '../utils/db';
import { createGameMutation, createInvitationMutation, getGamesQuery } from '../utils/gql-queries';
import { createDBPlayer } from '../utils/player-repository';
import { getJwtForPlayer } from '../utils/token-utils';

const chance = new Chance();

describe('get games', () => {
  let gqlClient,
    firstPlayer,
    secondPlayer,
    thirdPlayer,
    gameOne,
    gameTwo,
    inviteOne,
    inviteTwo,
    invitorColor;

  beforeEach(async () => {
    await deleteInvitations();
    await deletePlayersGames();
    await deleteGames();
    await deletePlayers();

    const playerOnePayload = createRandomPlayerPayload();
    const playerTwoPayload = createRandomPlayerPayload();
    const playerThreePayload = createRandomPlayerPayload();

    [firstPlayer, secondPlayer, thirdPlayer] = await Promise.all([
      createDBPlayer(playerOnePayload),
      createDBPlayer(playerTwoPayload),
      createDBPlayer(playerThreePayload)
    ]);

    const userJwt = await getJwtForPlayer(playerOnePayload);

    gqlClient = new GraphQLClient(graphqlUrl, {
      headers: {
        authorization: userJwt
      }
    });

    const inviteOneResponse = await gqlClient.request(createInvitationMutation, {
      inviteeUsername: secondPlayer.username,
      invitorColor: chance.pickone('w', 'b')
    });
    const inviteTwoResponse = await gqlClient.request(createInvitationMutation, {
      inviteeUsername: thirdPlayer.username,
      invitorColor: chance.pickone('w', 'b')
    });

    const createGameOneResponse = await gqlClient.request(createGameMutation, {
      invitationId: inviteOneResponse.createInvitation.invitationId
    });
    const createGameTwoResponse = await gqlClient.request(createGameMutation, {
      invitationId: inviteTwoResponse.createInvitation.invitationId
    });

    inviteOne = inviteOneResponse.createInvitation;
    inviteTwo = inviteTwoResponse.createInvitation;
    gameOne = createGameOneResponse.createGame;
    gameTwo = createGameTwoResponse.createGame;
  });

  it('should be able to get the current games for a player', async () => {
    const response = await gqlClient.request(getGamesQuery, { playerId: firstPlayer.player_id });
    const currentGames = response.getGames;
    const currentGameOne = currentGames.find((game) => game.opponentUsername === inviteOne.invitee.username);
    const currentGameTwo = currentGames.find((game) => game.opponentUsername === inviteTwo.invitee.username);

    console.log({currentGameOne, currentGameTwo});
    
    expect(currentGames).toHaveLength(2);
    expect(response.errors).toBeUndefined();
    // expect(currentGameOne).toStrictEqual({
    //   //... the stuff
    // });
    // expect(currentGameTwo).toStrictEqual({
    //   //... the stuff
    // });
  });

  // it('should delete the invitation after the game is created', async () => {
  //   let invitations = await selectInvitations();
  //   let foundInvitation = invitations.find((it) => it.invitation_id === invitation.invitationId);

  //   expect(foundInvitation).toBeDefined();

  //   await gqlClient.request(createGameMutation, {
  //     invitationId: invitation.invitationId,
  //     invitorColor: chance.pickone(['w', 'b'])
  //   });

  //   invitations = await selectInvitations();
  //   foundInvitation = invitations.find((it) => it.invitation_id === invitation.invitationId);

  //   expect(foundInvitation).toBeUndefined();
  // });

  // it('should throw a validation error if an arg is missing', async () => {
  //   try {
  //     await gqlClient.request(createGameMutation);
  //     throw new Error('Should have failed.');
  //   } catch (error) {
  //     expect(error.response.errors[0].extensions.code).toStrictEqual('BAD_USER_INPUT');
  //     expect(error.message).toContain(`Variable \"$invitationId\" of required type \"ID!\" was not provided.`);
  //   }
  // });

  // it('should throw an auth error if not authenticated', async () => {
  //   gqlClient = new GraphQLClient(graphqlUrl);

  //   try {
  //     await gqlClient.request(createGameMutation, {
  //       invitationId: invitation.invitationId
  //     });
  //     throw new Error('Should have failed.');
  //   } catch (error) {
  //     expect(error.response.errors[0].extensions.code).toStrictEqual('UNAUTHENTICATED');
  //     expect(error.message).toContain('You must be logged in.');
  //   }
  // });
});
