import Chance from 'chance';
import { GraphQLClient } from 'graphql-request';

import { createRandomPlayerPayload } from '../factories/player';
import { graphqlUrl } from '../utils';
import { deleteGames, deleteInvitations, deletePlayers, deletePlayersGames } from '../utils/db';
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
    gameTwo;

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
      invitorColor: 'w'
    });
    const inviteTwoResponse = await gqlClient.request(createInvitationMutation, {
      inviteeUsername: thirdPlayer.username,
      invitorColor: 'b'
    });

    const createGameOneResponse = await gqlClient.request(createGameMutation, {
      invitationId: inviteOneResponse.createInvitation.invitationId
    });
    const createGameTwoResponse = await gqlClient.request(createGameMutation, {
      invitationId: inviteTwoResponse.createInvitation.invitationId
    });

    gameOne = createGameOneResponse.createGame;
    gameTwo = createGameTwoResponse.createGame;
  });

  it('should be able to get the current games for a player', async () => {
    const response = await gqlClient.request(getGamesQuery, { playerId: firstPlayer.player_id });
    const currentGames = response.getGames;
    const currGameWithSecondPlayer = currentGames.find((game) => game.opponentUsername === secondPlayer.username);
    const currGameWithThirdPlayer = currentGames.find((game) => game.opponentUsername === thirdPlayer.username);

    expect(currentGames).toHaveLength(2);
    expect(response.errors).toBeUndefined();
    expect(currGameWithSecondPlayer).toStrictEqual({
      gameId: gameOne.gameId,
      playerOne: firstPlayer.player_id,
      playerTwo: secondPlayer.player_id,
      turn: firstPlayer.player_id,
      opponentUsername: secondPlayer.username
    });
    expect(currGameWithThirdPlayer).toStrictEqual({
      gameId: gameTwo.gameId,
      playerOne: thirdPlayer.player_id,
      playerTwo: firstPlayer.player_id,
      turn: thirdPlayer.player_id,
      opponentUsername: thirdPlayer.username
    });
  });

  it('should throw a validation error if an arg is missing', async () => {
    try {
      await gqlClient.request(getGamesQuery);
      throw new Error('Should have failed.');
    } catch (error) {
      expect(error.response.errors[0].extensions.code).toStrictEqual('BAD_USER_INPUT');
      expect(error.message).toContain(`Variable \"$playerId\" of required type \"ID!\" was not provided.`);
    }
  });

  it('should throw an auth error if not authenticated', async () => {
    gqlClient = new GraphQLClient(graphqlUrl);

    try {
      await gqlClient.request(getGamesQuery, { playerId: firstPlayer.player_id });
      throw new Error('Should have failed.');
    } catch (error) {
      expect(error.response.errors[0].extensions.code).toStrictEqual('UNAUTHENTICATED');
      expect(error.message).toContain('You must be logged in.');
    }
  });

  it('should handle when playerId is not linked to a player', async () => {
    const response = await gqlClient.request(getGamesQuery, { playerId: chance.guid() });

    expect(response.getGames).toHaveLength(0);
    expect(response.errors).toBeUndefined();
  });
});
