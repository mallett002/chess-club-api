import { gql, GraphQLClient } from 'graphql-request';

import { createRandomPlayerPayload } from '../factories/player';
import { graphqlUrl } from '../utils';
import { deleteGames, deletePlayers, deletePlayersGames, selectPlayerByUsername } from '../utils/db';
import { createDBPlayer } from '../utils/player-repository';
import { getJwtForPlayer } from '../utils/token-utils';

describe('game status', () => {
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
        status
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
const loadGameMutation = gql`
  mutation loadGame($playerOne: ID!, $playerTwo: ID!, $fen: String!) {
        loadGame(playerOne: $playerOne, playerTwo: $playerTwo, fen: $fen) {
          gameId
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

    const createGameResponse = await gqlClient.request(createGameMutation, {
      playerOne: playerOne.player_id,
      playerTwo: playerTwo.player_id
    });

    gameId = createGameResponse.createGame.gameId;
  });

  it('should handle when not in check', async () => {
    await gqlClient.request(updateBoardMutation, { gameId, cell: 'c3' });

    const {getBoard} = await gqlClient.request(getBoardQuery, { gameId });

    expect(getBoard.errors).toBeUndefined();
    expect(getBoard.status).toStrictEqual('PLAY');
  });

  it('should be able to put a player in check', async () => {
    await gqlClient.request(updateBoardMutation, { gameId, cell: 'c3' });
    await gqlClient.request(updateBoardMutation, { gameId, cell: 'd6' });
    await gqlClient.request(updateBoardMutation, { gameId, cell: 'Qa4+' });

    const {getBoard} = await gqlClient.request(getBoardQuery, { gameId });

    expect(getBoard.errors).toBeUndefined();
    expect(getBoard.status).toStrictEqual('CHECK');
  });

  it('should be able to put a player in checkmate', async () => {
    await gqlClient.request(updateBoardMutation, { gameId, cell: 'g4' });
    await gqlClient.request(updateBoardMutation, { gameId, cell: 'e5' });
    await gqlClient.request(updateBoardMutation, { gameId, cell: 'f3' });
    await gqlClient.request(updateBoardMutation, { gameId, cell: 'Qh4#' });

    const {getBoard} = await gqlClient.request(getBoardQuery, { gameId });

    expect(getBoard.errors).toBeUndefined();
    expect(getBoard.status).toStrictEqual('CHECKMATE');
  });

  it('should be able to handle a draw', async () => {
    const drawGameFen = "4k3/4P3/4K3/8/8/8/8/8 b - - 0 78";
    const {loadGame: {gameId: loadedGameId}} = await gqlClient.request(loadGameMutation, {
      playerOne: playerOne.player_id,
      playerTwo: playerTwo.player_id,
      fen: drawGameFen 
    });

    const {getBoard} = await gqlClient.request(getBoardQuery, { gameId: loadedGameId });

    expect(getBoard.errors).toBeUndefined();
    expect(getBoard.status).toStrictEqual('DRAW');
  });

  

  /*
    Threefold repetition won't work with the current implementation since I'm creating a new chess
    instance on each board update. This could be added once I start recording moves. I can just check
    if the game has 3 matching records for the FEN.
  */
  // it('should be able to handle threefold repetition', async () => {
  //   await gqlClient.request(updateBoardMutation, { gameId, cell: 'Nf3' });
  //   await gqlClient.request(updateBoardMutation, { gameId, cell: 'Nf6' });
  //   await gqlClient.request(updateBoardMutation, { gameId, cell: 'Ng1' });
  //   await gqlClient.request(updateBoardMutation, { gameId, cell: 'Ng8' });
  //   await gqlClient.request(updateBoardMutation, { gameId, cell: 'Nf3' });
  //   await gqlClient.request(updateBoardMutation, { gameId, cell: 'Nf6' });
  //   await gqlClient.request(updateBoardMutation, { gameId, cell: 'Ng1' });
  //   await gqlClient.request(updateBoardMutation, { gameId, cell: 'Ng8' });

  //   const {getBoard} = await gqlClient.request(getBoardQuery, { gameId });

  //   expect(getBoard.errors).toBeUndefined();
  //   expect(getBoard.status.inCheck).toStrictEqual(false);
  //   expect(getBoard.status.inThreefoldRepetition).toStrictEqual(true);
  // });
});
