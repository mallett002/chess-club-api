import { GraphQLClient } from 'graphql-request';

import { createRandomPlayerPayload } from '../factories/player';
import { graphqlUrl } from '../utils';
import { deleteGames, deleteInvitations, deletePlayers, deletePlayersGames } from '../utils/db';
import { createGameMutation, createInvitationMutation, getBoardQuery } from '../utils/gql-queries';
import { createDBPlayer } from '../utils/player-repository';
import { getJwtForPlayer } from '../utils/token-utils';

describe('get board', () => {
  let gqlClient,
    secondPlayer,
    firstPlayer,
    playerTwoPayload,
    gameId;

  beforeEach(async () => {
    await deleteInvitations();
    await deletePlayersGames();
    await deleteGames();
    await deletePlayers();

    const playerOnePayload = createRandomPlayerPayload();
    playerTwoPayload = createRandomPlayerPayload();

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

    const {createInvitation: invitation} = await gqlClient.request(createInvitationMutation, {
      inviteeUsername: secondPlayer.username,
      invitorColor: 'w'
    });

    const response = await gqlClient.request(createGameMutation, {
      invitationId: invitation.invitationId
    });

    gameId = response.createGame.gameId;
  });

  it('should be able to get a board', async () => {
    const response = await gqlClient.request(getBoardQuery, { gameId });

    expect(response.getBoard.errors).toBeUndefined();
    expect(response.getBoard.gameId).toStrictEqual(gameId);
    expect(response.getBoard.playerOne).toStrictEqual(firstPlayer.player_id);
    expect(response.getBoard.playerTwo).toStrictEqual(secondPlayer.player_id);
    expect(response.getBoard.opponentUsername).toStrictEqual(secondPlayer.username);
    expect(response.getBoard.turn).toStrictEqual(firstPlayer.player_id);
    expect(response.getBoard.moves).toBeDefined();
    expect(response.getBoard.positions).toBeDefined();
    expect(response.getBoard.fallenSoldiers).toBeDefined();
    expect(response.getBoard.fallenSoldiers.playerOnePieces).toStrictEqual([]);
    expect(response.getBoard.fallenSoldiers.playerTwoPieces).toStrictEqual([]);
  });

  it('should not reverse the board for playerOne', async () => {
    const response = await gqlClient.request(getBoardQuery, { gameId });
    const positions = response.getBoard.positions;

    expect(positions[0].color).toBe('b');
  });

  it('should reverse the board for playerTwo', async () => {
    const playerTwoJwt = await getJwtForPlayer(playerTwoPayload);

    gqlClient = new GraphQLClient(graphqlUrl, {
      headers: {
        authorization: playerTwoJwt
      }
    });

    const response = await gqlClient.request(getBoardQuery, { gameId });
    const positions = response.getBoard.positions;
    
    expect(positions[0].color).toBe('w');
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
