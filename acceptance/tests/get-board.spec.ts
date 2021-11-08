import { gql, GraphQLClient } from 'graphql-request';

import { createRandomPlayerPayload } from '../factories/player';
import { graphqlUrl } from '../utils';
import { deleteGames, deletePlayers, deletePlayersGames, selectPlayerByUsername } from '../utils/db';
import { createDBPlayer } from '../utils/player-repository';
import { getJwtForPlayer } from '../utils/token-utils';

describe('get board', () => {
  const getBoardQuery = gql`
    query GetBoard($gameId: ID!){
      getBoard(gameId: $gameId) {
        gameId
        moves {
          color
          from
          to
          flags
          piece
          san
        }
        playerOne
        playerTwo
        positions{
          type
          color
          label
        }
        turn
      }
  }`;
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

  let gqlClient,
    playerOne,
    playerTwo,
    gameId;

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

  it('should be able to get a board', async () => {
    const response = await gqlClient.request(getBoardQuery, { gameId });

    expect(response.getBoard.errors).toBeUndefined();
    expect(response.getBoard.gameId).toStrictEqual(gameId);
    expect(response.getBoard.turn).toStrictEqual('w');
    expect(response.getBoard.moves).toBeDefined();
    expect(response.getBoard.positions).toBeDefined();
  });


  it('should throw an auth erorr if not authenticated', async () => {
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
