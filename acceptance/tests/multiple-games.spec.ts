import { GraphQLClient } from 'graphql-request';
import Chance from 'chance';

import { createRandomPlayerPayload } from '../factories/player';
import { graphqlUrl } from '../utils';
import { deleteGames, deleteInvitations, deletePlayers, deletePlayersGames } from '../utils/db';
import { createDBPlayer } from '../utils/player-repository';
import { getJwtForPlayer } from '../utils/token-utils';
import { createGameMutation, createInvitationMutation, getBoardQuery, updateBoardMutation } from '../utils/gql-queries';

const chance = new Chance();

describe('multiple games', () => {
  const createRandomGame = async () => {
    const playerOnePayload = createRandomPlayerPayload();
    const playerTwoPayload = createRandomPlayerPayload();

    const [firstPlayer, secondPlayer] = await Promise.all([
      createDBPlayer(playerOnePayload),
      createDBPlayer(playerTwoPayload)
    ]);

    const userJwt = await getJwtForPlayer(playerOnePayload);

    const gqlClient = new GraphQLClient(graphqlUrl, {
      headers: {
        authorization: userJwt
      }
    });

    const {createInvitation: invitation} = await gqlClient.request(createInvitationMutation, {
      inviteeUsername: secondPlayer.username
    });

    const {createGame} = await gqlClient.request(createGameMutation, {
      invitationId: invitation.invitationId,
      inviteeColor: chance.pickone(['w', 'b'])
    });

    return {gqlClient, gameId: createGame.gameId};
  };

  const playRandomGame = async (client, gameId) => {
    const moveCount = chance.natural({
      max: 5,
      min: 3
    });

    for (let i = 0; i < moveCount; i++) {
      const getBoardResponse = await client.request(getBoardQuery, { gameId });

      const board = getBoardResponse.getBoard;

      const turns = ['w', 'b'];
      const expectedTurn = turns.find((turn) => turn !== board.turn);
      const randomMove = chance.pickone(board.moves);
      const response = await client.request(updateBoardMutation, {
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
    await deleteInvitations();
    await deletePlayersGames();
    await deleteGames();
    await deletePlayers();
  });

  it('should be able to handle multiple games being played at the same time', async () => {
    const {gqlClient: clientOne, gameId: gameIdOne} = await createRandomGame();
    const {gqlClient: clientTwo, gameId: gameIdTwo} = await createRandomGame();
    const {gqlClient: clientThree, gameId: gameIdThree} = await createRandomGame();
    const {gqlClient: clientFour, gameId: gameIdFour} = await createRandomGame();
    const {gqlClient: clientFive, gameId: gameIdFive} = await createRandomGame();
    const {gqlClient: clientSix, gameId: gameIdSix} = await createRandomGame();
    const {gqlClient: clientSeven, gameId: gameIdSeven} = await createRandomGame();

    await Promise.all([
      playRandomGame(clientOne, gameIdOne),
      playRandomGame(clientTwo, gameIdTwo),
      playRandomGame(clientThree, gameIdThree),
      playRandomGame(clientFour, gameIdFour),
      playRandomGame(clientFive, gameIdFive),
      playRandomGame(clientSix, gameIdSix),
      playRandomGame(clientSeven, gameIdSeven),
    ]);
  });
});
