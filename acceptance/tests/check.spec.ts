import { gql, GraphQLClient } from 'graphql-request';
import Chance from 'chance';

import { createRandomPlayerPayload } from '../factories/player';
import { graphqlUrl } from '../utils';
import { deleteGames, deletePlayers, deletePlayersGames, selectPlayerByUsername } from '../utils/db';
import { createDBPlayer } from '../utils/player-repository';
import { getJwtForPlayer } from '../utils/token-utils';

const chance = new Chance();

describe('get board', () => {
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

  let gqlClient,
    playerOne,
    playerTwo,
    board,
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

    const createGameResponse = await gqlClient.request(createGameMutation, {
      playerOne: playerOne.player_id,
      playerTwo: playerTwo.player_id
    });

    gameId = createGameResponse.createGame.gameId;
  });

  // const status = {
  //   isCheck: true,
  //   checkMate: false,
  //   stalemate: false,
  //   threeFoldRep: false,
  //   draw: false
  // }

  it('should be able to put a player in check', async () => {
    await gqlClient.request(updateBoardMutation, { gameId, cell: 'c3' });
    await gqlClient.request(updateBoardMutation, { gameId, cell: 'd6' });
    await gqlClient.request(updateBoardMutation, { gameId, cell: 'a4' });

    const {getBoard} = await gqlClient.request(getBoardQuery, { gameId });

    expect(getBoard.errors).toBeUndefined();
    expect(getBoard.status.isCheck).toStrictEqual(true);
    expect(getBoard.status.isCheckMate).toStrictEqual(false);
  });

});
