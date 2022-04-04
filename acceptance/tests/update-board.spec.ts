import { GraphQLClient } from 'graphql-request';
import Chance from 'chance';

import { createRandomPlayerPayload } from '../factories/player';
import { graphqlUrl } from '../utils';
import { deleteFallenSoldiers, deleteGames, deleteInvitations, deletePlayers, deletePlayersGames } from '../utils/db';
import { createDBPlayer } from '../utils/player-repository';
import { getJwtForPlayer } from '../utils/token-utils';
import { createGameMutation, createInvitationMutation, getBoardQuery, updateBoardMutation } from '../utils/gql-queries';

const chance = new Chance();

function sortPiecesByPower(pieces) {
  const powerByPieces = { p: 1, n: 2, b: 3, r: 4, q: 5 };

  return pieces.sort((a, b) => powerByPieces[a] - powerByPieces[b]);
};

function getExpectedTurn(firstPlayerIsPlayerOne, isPlayerOneTurn, firstPlayerId, secondPlayerId) {
  if (firstPlayerIsPlayerOne) {
    if (isPlayerOneTurn) {
      return firstPlayerId;
    }

    return secondPlayerId;
  }

  if (isPlayerOneTurn) {
    return secondPlayerId;
  }

  return firstPlayerId;
}

describe('update board', () => {
  let gqlClientOne,
    gqlClientTwo,
    firstPlayer,
    secondPlayer,
    board,
    firstPlayerIsPlayerOne,
    gameId;

  beforeEach(async () => {
    await deleteInvitations();
    await deletePlayersGames();
    await deleteGames();
    await deletePlayers();
    await deleteFallenSoldiers();

    const playerOnePayload = createRandomPlayerPayload();
    const playerTwoPayload = createRandomPlayerPayload();

    [firstPlayer, secondPlayer] = await Promise.all([
      createDBPlayer(playerOnePayload),
      createDBPlayer(playerTwoPayload)
    ]);

    gqlClientOne = new GraphQLClient(graphqlUrl, {
      headers: {
        authorization: await getJwtForPlayer(playerOnePayload)
      }
    });

    gqlClientTwo = new GraphQLClient(graphqlUrl, {
      headers: {
        authorization: await getJwtForPlayer(playerTwoPayload)
      }
    });

    const invitorColor = chance.pickone(['w', 'b']);
    firstPlayerIsPlayerOne = invitorColor === 'w';

    const { createInvitation: invitation } = await gqlClientOne.request(createInvitationMutation, {
      inviteeUsername: secondPlayer.username,
      invitorColor
    });

    const createGameResponse = await gqlClientTwo.request(createGameMutation, {
      invitationId: invitation.invitationId
    });

    gameId = createGameResponse.createGame.gameId;
  });

  it('should be able to update the board various times, taking turns', async () => {
    const moveCount = chance.natural({
      max: 10,
      min: 3
    });

    for (let i = 0; i < moveCount; i++) {
      const isPlayerOneTurn = i % 2 === 0;
      const client = isPlayerOneTurn ? gqlClientOne : gqlClientTwo;
      const getBoardResponse = await client.request(getBoardQuery, { gameId });

      board = getBoardResponse.getBoard;

      const randomMove = chance.pickone(board.moves);
      const response = await client.request(updateBoardMutation, {
        gameId,
        cell: randomMove.san
      });
      const expectedTurn = getExpectedTurn(
        firstPlayerIsPlayerOne,
        isPlayerOneTurn,
        firstPlayer.player_id,
        secondPlayer.player_id
      );

      expect(response.updateBoard.errors).toBeUndefined();
      expect(response.updateBoard.gameId).toStrictEqual(gameId);
      expect(response.updateBoard.turn).toStrictEqual(expectedTurn);
      expect(response.updateBoard.moves).toBeDefined();
      expect(response.updateBoard.positions).toBeDefined();
    }
  });

  it('should throw an auth error if not authenticated', async () => {
    gqlClientOne = new GraphQLClient(graphqlUrl);

    const randomMove = chance.pickone(board.moves);

    try {
      await gqlClientOne.request(updateBoardMutation, {
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
      await gqlClientOne.request(updateBoardMutation, { gameId });
      throw new Error('Should have failed.');
    } catch (error) {
      expect(error.response.errors[0].extensions.code).toStrictEqual('BAD_USER_INPUT');
      expect(error.message).toContain('Variable \"$cell\" of required type \"String!\" was not provided.');
    }
  });

  it('should create fallen soldiers when pieces are taken', async () => {
    const piecesTaken = {
      w: [],
      b: []
    };

    const moveCount = 25;

    for (let i = 0; i < moveCount; i++) {
      const isPlayerOneTurn = i % 2 === 0;
      const client = isPlayerOneTurn ? gqlClientOne : gqlClientTwo;
      const {getBoard: board} = await client.request(getBoardQuery, { gameId });

      let randomMove;

      randomMove = board.moves.find((move) => move.captured);

      if (randomMove && randomMove.captured) {
        const whitePieceTaken = isPlayerOneTurn && !firstPlayerIsPlayerOne || !isPlayerOneTurn && firstPlayerIsPlayerOne;
        const blackPieceTaken = isPlayerOneTurn && firstPlayerIsPlayerOne || !isPlayerOneTurn && !firstPlayerIsPlayerOne;

        if (blackPieceTaken) {
          piecesTaken.b.push(randomMove.captured.toLowerCase())
        } else if (whitePieceTaken) {
          piecesTaken.w.push(randomMove.captured.toLowerCase());
        } else {
          throw Error('Not sure how we got here....');
        }
      } else {
        randomMove = board.moves.find((move) => !move.captured);
      }

      if (!randomMove) {
        throw Error('No moves found for game.');
      }

      await client.request(updateBoardMutation, {
        gameId,
        cell: randomMove.san,
        captured: randomMove.captured && randomMove.captured
      });
    }

    const getBoardResponse = await gqlClientOne.request(getBoardQuery, { gameId });
    const { playerOnePieces, playerTwoPieces } = getBoardResponse.getBoard.fallenSoldiers;

    expect(playerOnePieces).toStrictEqual(sortPiecesByPower(piecesTaken.w));
    expect(playerTwoPieces).toStrictEqual(sortPiecesByPower(piecesTaken.b));
  });
});
