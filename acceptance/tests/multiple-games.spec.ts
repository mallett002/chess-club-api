import { gql, GraphQLClient } from 'graphql-request';
import Chance from 'chance';

import { createRandomPlayerPayload } from '../factories/player';
import { graphqlUrl } from '../utils';
import { deleteGames, deletePlayers, deletePlayersGames, selectPlayerByUsername } from '../utils/db';
import { createDBPlayer } from '../utils/player-repository';
import { getJwtForPlayer } from '../utils/token-utils';

const chance = new Chance();

describe('multiple games', () => {
  const updateBoardMutation = gql`
    mutation updateBoard($gameId: ID!, $cell: String!) {
          updateBoard(gameId: $gameId, cell: $cell) {
            gameId
            playerOne
            playerTwo
            turn
            moves {
              color
              from
              to
              flags
              piece
              san
            }
            positions {
              type
              color
              label
            }
          }
        }
  `;
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

  let clientOne,
    clientTwo,
    clientThree;

  const createRandomGame = async (client) => {
    const playerOnePayload = createRandomPlayerPayload();
    const playerTwoPayload = createRandomPlayerPayload();

    const [playerOne, playerTwo] = await Promise.all([
      createDBPlayer(playerOnePayload),
      createDBPlayer(playerTwoPayload)
    ]);

    const userJwt = await getJwtForPlayer(playerOnePayload);

    const gqlClient = new GraphQLClient(graphqlUrl, {
      headers: {
        authorization: userJwt
      }
    });

    return gqlClient.request(createGameMutation, {
      playerOne: playerOne.player_id,
      playerTwo: playerTwo.player_id
    });
  };

  const playRandomGame = async (gameId) => {
    const gameId = createGameResponse.createGame.gameId;

    gameIds.push(gameId);

    const moveCount = chance.natural({
      max: 5,
      min: 3
    });

    for (let i = 0; i < moveCount; i++) {
      const getBoardResponse = await gqlClient.request(getBoardQuery, { gameId });

      const board = getBoardResponse.getBoard;

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
  };

  beforeEach(async () => {
    await deletePlayersGames();
    await deleteGames();
    await deletePlayers();
  });

  it('should be able to handle multiple games being played at the same time', async () => {
    const gameOne = await createRandomGame();
    const gameTwo = await createRandomGame();
    const gameThree = await createRandomGame();

    await Promise.all([
      playRandomGame(gameOne.createGame.gameId),
      playRandomGame(gameTwo.createGame.gameId),
      playRandomGame(gameThree.createGame.gameId)
    ]);
  });
});
