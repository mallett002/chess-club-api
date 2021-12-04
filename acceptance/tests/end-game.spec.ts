import Chance from 'chance';
import { GraphQLClient } from 'graphql-request';

import { createRandomPlayerPayload } from '../factories/player';
import { graphqlUrl } from '../utils';
import { deleteGames, deleteInvitations, deletePlayers, deletePlayersGames, selectPlayerByUsername } from '../utils/db';
import { createGameMutation, createInvitationMutation, endGameMutation, getBoardQuery } from '../utils/gql-queries';
import { createDBPlayer } from '../utils/player-repository';
import { getJwtForPlayer } from '../utils/token-utils';

const chance = new Chance();

describe('end game', () => {
  let gqlClient,
    gameId,
    secondPlayer;

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

  it('should be able to end a game', async () => {
    const response = await gqlClient.request(endGameMutation, { gameId });

    expect(response.endGame).toStrictEqual(gameId);
    expect(response.errors).toBeUndefined();

    const getBoardResponse = await gqlClient.request(getBoardQuery, { gameId });

    expect(getBoardResponse.getBoard).toBeNull();
  });

  it('should be able to handle when a gameId is not found', async () => {
    const response = await gqlClient.request(endGameMutation, { gameId: chance.guid() });

    expect(response.endGame).toBeNull();
    expect(response.errors).toBeUndefined();
  });
});
