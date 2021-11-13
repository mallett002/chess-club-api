import { gql, GraphQLClient } from 'graphql-request';

import { createRandomPlayerPayload } from '../factories/player';
import { graphqlUrl } from '../utils';
import { deleteGames, deletePlayers, deletePlayersGames, selectPlayerByUsername } from '../utils/db';
import { createDBPlayer } from '../utils/player-repository';
import { getJwtForPlayer } from '../utils/token-utils';

describe('end game', () => {
  const createGameMutation = gql`
    mutation createGame($playerOne: ID!, $playerTwo: ID!) {
          createGame(playerOne: $playerOne, playerTwo: $playerTwo) {
            gameId
            playerOne
            playerTwo
            turn
          }
        }
  `;
  const endGameMutation = gql`
    mutation endGame($gameId: ID!) {
      endGame(gameId: $gameId)
    }
  `;
  const getBoardQuery = gql`
    query GetBoard($gameId: ID!){
      getBoard(gameId: $gameId) {
        gameId
      }
  }`;

  let gqlClient,
    gameId,
    playerOne,
    playerTwo;

  beforeEach(async () => {
    await deletePlayersGames();
    await deleteGames();
    await deletePlayers();

    const playerOnePayload = createRandomPlayerPayload();
    const playerTwoPayload = createRandomPlayerPayload();

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

    const response = await gqlClient.request(createGameMutation, {
      playerOne: playerOne.player_id,
      playerTwo: playerTwo.player_id
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
});
