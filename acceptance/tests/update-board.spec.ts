import { GraphQLClient } from 'graphql-request';
import Chance from 'chance';

import { createRandomPlayerPayload } from '../factories/player';
import { graphqlUrl } from '../utils';
import { deleteGames, deleteInvitations, deletePlayers, deletePlayersGames } from '../utils/db';
import { createDBPlayer } from '../utils/player-repository';
import { getJwtForPlayer } from '../utils/token-utils';
import { createGameMutation, createInvitationMutation, getBoardQuery, updateBoardMutation } from '../utils/gql-queries';

const chance = new Chance();

describe('update board', () => {
  let gqlClient,
    secondPlayer,
    board,
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
      inviteeUsername: secondPlayer.username,
      inviteeColor: chance.pickone('w', 'b')
    });

    const createGameResponse = await gqlClient.request(createGameMutation, {
      invitationId: invitation.invitationId,
      inviteeColor: chance.pickone(['w', 'b'])
    });

    gameId = createGameResponse.createGame.gameId;

    const getBoardResponse = await gqlClient.request(getBoardQuery, { gameId });

    board = getBoardResponse.getBoard;
  });

  it('should be able to update the board various times, taking turns', async () => {
    const moveCount = chance.natural({
      max: 10,
      min: 3
    });

    for (let i = 0; i < moveCount; i++) {
      const getBoardResponse = await gqlClient.request(getBoardQuery, { gameId });

      board = getBoardResponse.getBoard;

      const turns = ['w', 'b'];
      const expectedTurn = turns.find((turn) => turn !== board.turn);
      const randomMove = chance.pickone(board.moves);
      const response = await gqlClient.request(updateBoardMutation, {
        gameId,
        cell: randomMove.san
      });

      expect(response.updateBoard.errors).toBeUndefined();
      expect(response.updateBoard.gameId).toStrictEqual(gameId);
      expect(response.updateBoard.turn).toStrictEqual(expectedTurn);
      expect(response.updateBoard.moves).toBeDefined();
      expect(response.updateBoard.positions).toBeDefined();
    }
  });

  it('should throw an auth error if not authenticated', async () => {
    gqlClient = new GraphQLClient(graphqlUrl);

    const randomMove = chance.pickone(board.moves);

    try {
      await gqlClient.request(updateBoardMutation, {
        gameId,
        cell: randomMove.san
      });
      throw new Error('Should have failed.');
    } catch (error) {
      expect(error.response.errors[0].extensions.code).toStrictEqual('UNAUTHENTICATED');
      expect(error.message).toContain('You must be logged in.');
    }
  });

  it('should throw a validation error if the cell arg is missing', async () => {
    try {
      await gqlClient.request(updateBoardMutation, { gameId });
      throw new Error('Should have failed.');
    } catch (error) {
      expect(error.response.errors[0].extensions.code).toStrictEqual('BAD_USER_INPUT');
      expect(error.message).toContain('Variable \"$cell\" of required type \"String!\" was not provided.');
    }
  });
});
