import { GraphQLClient } from 'graphql-request';
import Chance from 'chance';

import { createRandomPlayerPayload } from '../factories/player';
import { graphqlUrl } from '../utils';
import { deleteGames, deleteInvitations, deletePlayers, deletePlayersGames } from '../utils/db';
import { createGameMutation, createInvitationMutation, getBoardQuery } from '../utils/gql-queries';
import { createDBPlayer } from '../utils/player-repository';
import { getJwtForPlayer } from '../utils/token-utils';

const chance = new Chance();

describe('get board', () => {
  let gqlClient,
    secondPlayer,
    gameId;

  beforeEach(async () => {
    await deleteInvitations();
    await deletePlayersGames();
    await deleteGames();
    await deletePlayers();

    const playerOnePayload = createRandomPlayerPayload();
    const playerTwoPayload = createRandomPlayerPayload();

    [, secondPlayer] = await Promise.all([
      createDBPlayer(playerOnePayload),
      createDBPlayer(playerTwoPayload)
    ]);

    const userJwt = await getJwtForPlayer(playerOnePayload);

    gqlClient = new GraphQLClient(graphqlUrl, {
      headers: {
        authorization: userJwt
      }
    });

    const {createInvitation: invitation} = await gqlClient.request(createInvitationMutation, {
      inviteeUsername: secondPlayer.username
    });

    const response = await gqlClient.request(createGameMutation, {
      invitationId: invitation.invitationId,
      inviteeColor: chance.pickone(['w', 'b'])
    });

    gameId = response.createGame.gameId;
  });

  it('should be able to get a board', async () => {
    const response = await gqlClient.request(getBoardQuery, { gameId });

    expect(response.getBoard.errors).toBeUndefined();
    expect(response.getBoard.gameId).toStrictEqual(gameId);
    expect(response.getBoard.turn).toStrictEqual('w');
    expect(response.getBoard.moves).toBeDefined();
    expect(response.getBoard.positions).toBeDefined();
  });


  it('should throw an auth error if not authenticated', async () => {
    gqlClient = new GraphQLClient(graphqlUrl);

    try {
      await gqlClient.request(getBoardQuery, { gameId });
      throw new Error('Should have failed.');
    } catch (error) {
      expect(error.response.errors[0].extensions.code).toStrictEqual('UNAUTHENTICATED');
      expect(error.message).toContain('You must be logged in.');
    }
  });

  it('should throw a validation error if a gameId is missing', async () => {
    try {
      await gqlClient.request(getBoardQuery);
      throw new Error('Should have failed.');
    } catch (error) {
      expect(error.response.errors[0].extensions.code).toStrictEqual('BAD_USER_INPUT');
      expect(error.message).toContain('Variable \"$gameId\" of required type \"ID!\" was not provided.');
    }
  });
});
