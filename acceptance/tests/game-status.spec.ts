import { GraphQLClient } from 'graphql-request';
import Chance from 'chance';

import { createRandomPlayerPayload } from '../factories/player';
import { graphqlUrl } from '../utils';
import { deleteGames, deleteInvitations, deletePlayers, deletePlayersGames } from '../utils/db';
import { createGameMutation, createInvitationMutation, getBoardQuery, loadGameMutation, updateBoardMutation } from '../utils/gql-queries';
import { createDBPlayer } from '../utils/player-repository';
import { getJwtForPlayer } from '../utils/token-utils';

const chance = new Chance();

describe('game status', () => {
  let gqlClient,
    firstPlayer,
    secondPlayer,
    gameId;

  beforeEach(async () => {
    await deleteInvitations();
    await deletePlayersGames();
    await deleteGames();
    await deletePlayers();

    const playerOnePayload = createRandomPlayerPayload();
    const playerTwoPayload = createRandomPlayerPayload();

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
      inviteeUsername: secondPlayer.username
    });

    const createGameResponse = await gqlClient.request(createGameMutation, {
      invitationId: invitation.invitationId,
      inviteeColor: chance.pickone(['w', 'b'])
    });

    gameId = createGameResponse.createGame.gameId;
  });

  it('should handle when not in check', async () => {
    await gqlClient.request(updateBoardMutation, { gameId, cell: 'c3' });

    const { getBoard } = await gqlClient.request(getBoardQuery, { gameId });

    expect(getBoard.errors).toBeUndefined();
    expect(getBoard.status).toStrictEqual('PLAY');
  });

  it('should be able to put a player in check', async () => {
    await gqlClient.request(updateBoardMutation, { gameId, cell: 'c3' });
    await gqlClient.request(updateBoardMutation, { gameId, cell: 'd6' });
    await gqlClient.request(updateBoardMutation, { gameId, cell: 'Qa4+' });

    const { getBoard } = await gqlClient.request(getBoardQuery, { gameId });

    expect(getBoard.errors).toBeUndefined();
    expect(getBoard.status).toStrictEqual('CHECK');
  });

  it('should be able to put a player in checkmate', async () => {
    await gqlClient.request(updateBoardMutation, { gameId, cell: 'g4' });
    await gqlClient.request(updateBoardMutation, { gameId, cell: 'e5' });
    await gqlClient.request(updateBoardMutation, { gameId, cell: 'f3' });
    await gqlClient.request(updateBoardMutation, { gameId, cell: 'Qh4#' });

    const { getBoard } = await gqlClient.request(getBoardQuery, { gameId });

    expect(getBoard.errors).toBeUndefined();
    expect(getBoard.status).toStrictEqual('CHECKMATE');
  });

  it('should be able to handle a draw', async () => {
    const drawGameFen = "k7/8/n7/8/8/8/8/7K b - - 0 1";
    const { loadGame: { gameId: loadedGameId } } = await gqlClient.request(loadGameMutation, {
      playerOne: firstPlayer.player_id,
      playerTwo: secondPlayer.player_id,
      fen: drawGameFen
    });

    const { getBoard } = await gqlClient.request(getBoardQuery, { gameId: loadedGameId });

    expect(getBoard.errors).toBeUndefined();
    expect(getBoard.status).toStrictEqual('DRAW');
  });

  it('should be able to handle a stalemate', async () => {
    const drawGameFen = "4k3/4P3/4K3/8/8/8/8/8 b - - 0 78";
    const { loadGame: { gameId: loadedGameId } } = await gqlClient.request(loadGameMutation, {
      playerOne: firstPlayer.player_id,
      playerTwo: secondPlayer.player_id,
      fen: drawGameFen
    });

    const { getBoard } = await gqlClient.request(getBoardQuery, { gameId: loadedGameId });

    expect(getBoard.errors).toBeUndefined();
    expect(getBoard.status).toStrictEqual('STALEMATE');
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
