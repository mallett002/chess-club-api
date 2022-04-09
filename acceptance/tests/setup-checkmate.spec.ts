import { GraphQLClient } from 'graphql-request';

import { createRandomPlayerPayload } from '../factories/player';
import { graphqlUrl } from '../utils';
import { deleteGames, deleteInvitations, deletePlayers, deletePlayersGames } from '../utils/db';
import { createGameMutation, createInvitationMutation, getBoardQuery, updateBoardMutation } from '../utils/gql-queries';
import { createDBPlayer } from '../utils/player-repository';
import { getJwtForPlayer } from '../utils/token-utils';

describe('create game', () => {
  let gqlClientOne,
    gqlClientTwo,
    secondPlayer,
    playerOneJwt,
    playerTwoJwt,
    gameId;

  beforeEach(async () => {
    await deleteInvitations();
    await deletePlayersGames();
    await deleteGames();
    await deletePlayers();

    const playerOnePayload = createRandomPlayerPayload({username: 'bob', password: 'aaaaa'});
    const playerTwoPayload = createRandomPlayerPayload({username: 'tom', password: 'aaaaa'});

    [, secondPlayer] = await Promise.all([
      createDBPlayer(playerOnePayload),
      createDBPlayer(playerTwoPayload)
    ]);

    playerOneJwt = await getJwtForPlayer(playerOnePayload);
    playerTwoJwt = await getJwtForPlayer(playerOnePayload);

    gqlClientOne = new GraphQLClient(graphqlUrl, {
      headers: {
        authorization: playerOneJwt
      }
    });
    gqlClientTwo = new GraphQLClient(graphqlUrl, {
      headers: {
        authorization: playerTwoJwt
      }
    });

    const {createInvitation} = await gqlClientOne.request(createInvitationMutation, {
      inviteeUsername: secondPlayer.username,
      invitorColor: 'w'
    });

    const createGameResponse = await gqlClientTwo.request(createGameMutation, {
      invitationId: createInvitation.invitationId
    });

    gameId = createGameResponse.createGame.gameId;
  });

  it('should set up checkmate', async () => {
    const movesToMake = ['e4', 'e5', 'Bc4', 'Bc5', 'Qh5', 'Nf6', 'Qxf7#'];

    for (let i = 0; i < movesToMake.length; i++) {
      const move = movesToMake[i];
      const client = i % 2 === 0 ? gqlClientOne : gqlClientTwo;

      await client.request(updateBoardMutation, {  
        gameId,
        cell: move
      });
    }
    
    const {getBoard: {status}} = await gqlClientOne.request(getBoardQuery, {gameId});

    expect(status).toStrictEqual('CHECKMATE');
  });
});
