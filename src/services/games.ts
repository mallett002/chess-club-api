import {Chess} from 'chess.js';

import { getPubSub } from './pub-sub';
import { BOARD_UPDATED } from '../constants';
import { flattenPositions, mapChessStatusToGameStatus } from './board';
import { IGameDomain, IGameDTO } from '../interfaces/game';
import { IPlayerDTO } from '../interfaces/player';
import * as gamesRepository from '../repository/games';
import * as invitationRepository from '../repository/invitation';
import { IBoard, IColor, IFallenSoldiers, IPiece } from '../interfaces/board';
import { IDBInvitation } from '../interfaces/invitation';
import { selectPlayerByPlayerId } from '../repository/player';

const publishBoardUpdates = (board): void => {
  const pubSub = getPubSub();

  pubSub.publish(BOARD_UPDATED, { boardUpdated: board });
};

const createBoardPositions = (positions, playerId, playerOneId) => {
  if (playerId === playerOneId) {
    return flattenPositions(positions);
  }

  const flattened = flattenPositions(positions);

  return flattened.reverse();
};

async function getFallenSoldiers(gameId: string): Promise<IFallenSoldiers> {
  return gamesRepository.selectFallenSoldiersForGame(gameId);
}

async function updateFallenSoldiers(piece: IPiece, isPlayerOne: boolean, gameId: string): Promise<string> {
  if (piece) {
    const color: IColor = isPlayerOne ? IColor.b : IColor.w; // playerOne moved, and took player2's "b" piece
    const [pieceId] = await gamesRepository.insertFallenSoldier(piece, gameId, color);

    return pieceId;
  }

  return null;
}

export const createGame = async (invitationId: string, playerId: string): Promise<IBoard> => {
  const invitation: IDBInvitation = await invitationRepository.selectInvitationById(invitationId);

  if (!invitation) {
    throw new Error('Invitation does not exist.');
  }

  const playerOneId = invitation.invitor_color === 'w' ? invitation.invitor_id : invitation.invitee_id;
  const playerTwoId = invitation.invitor_color === 'b' ? invitation.invitor_id : invitation.invitee_id;

  const chess = new Chess();
  const fen = chess.fen();

  const game: IGameDTO = await gamesRepository.insertNewGame(
    fen,
    playerOneId,
    playerTwoId,
  );

  if (game) {
    await invitationRepository.deleteInvitationById(invitationId);
  } else {
    throw new Error('Something went wrong creating the game');
  }

  const chessTurn = chess.turn();
  const turn = chessTurn === 'w' ? game.playerOne : game.playerTwo;
  const opponentPlayerId = game.playerOne === playerId ? game.playerTwo : game.playerOne;
  const opponent: IPlayerDTO = await selectPlayerByPlayerId(opponentPlayerId);

  const board = {
    gameId: game.gameId,
    moves: chess.moves({ verbose: true }),
    fallenSoldiers: await getFallenSoldiers(game.gameId),
    opponentUsername: opponent.username,
    playerOne: playerOneId,
    playerTwo: playerTwoId,
    positions: createBoardPositions(chess.board(), playerId, playerOneId),
    status: mapChessStatusToGameStatus(chess),
    turn
  };

  publishBoardUpdates(board);

  return board;
};

export const updateGame = async (gameId, moveToCell, captured, playerId): Promise<IBoard> => {
  const game: IGameDTO = await gamesRepository.getGameByGameId(gameId);
  const chess: Chess = new Chess();

  chess.load(game.fen);

  const isPlayerOne = game.playerOne === playerId;
  const chessTurn = chess.turn();
  const turn = chessTurn === 'w' ? game.playerOne : game.playerTwo;
  const opponentPlayerId = isPlayerOne ? game.playerTwo : game.playerOne;
  const opponent: IPlayerDTO = await selectPlayerByPlayerId(opponentPlayerId);
  const move = chess.move(moveToCell);
  await updateFallenSoldiers(captured, isPlayerOne, gameId);
  const fallenSoldiers: IFallenSoldiers = await getFallenSoldiers(gameId);

  if (!move) {
    throw Error('Not a valid move');
  }

  await gamesRepository.updateGame(gameId, chess.fen());

  const newBoard = {
    gameId,
    moves: chess.moves({ verbose: true }),
    fallenSoldiers,
    opponentUsername: opponent.username,
    playerOne: game.playerOne,
    playerTwo: game.playerTwo,
    positions: createBoardPositions(chess.board(), playerId, game.playerOne),
    status: mapChessStatusToGameStatus(chess),
    turn
  };

  publishBoardUpdates(newBoard);

  return newBoard;
};

export const getGamesByPlayerId = async (playerId: string): Promise<IGameDomain[]> => {
  const games = await gamesRepository.selectGamesForPlayer(playerId);

  return Promise.all(games.map(async (game) => {
    const chess = new Chess();

    chess.load(game.fen);

    const chessTurn = chess.turn();
    const turn = chessTurn === 'w' ? game.playerOne : game.playerTwo;
    const opponentPlayerId = game.playerOne === playerId ? game.playerTwo : game.playerOne;
    const opponent: IPlayerDTO = await selectPlayerByPlayerId(opponentPlayerId);

    return {
      ...game,
      opponentUsername: opponent.username,
      turn
    };
  }));
};

export const getBoardByGameId = async (gameId: string, playerId: string): Promise<IBoard> => {
  const game: IGameDTO = await gamesRepository.getGameByGameId(gameId);

  if (!game) {
    return null;
  }

  const chess = new Chess();

  chess.load(game.fen);

  const chessTurn = chess.turn();
  const turn = chessTurn === 'w' ? game.playerOne : game.playerTwo;
  const opponentPlayerId = game.playerOne === playerId ? game.playerTwo : game.playerOne;
  const opponent: IPlayerDTO = await selectPlayerByPlayerId(opponentPlayerId);

  return {
    gameId,
    moves: chess.moves({ verbose: true }),
    fallenSoldiers: await getFallenSoldiers(gameId),
    playerOne: game.playerOne,
    playerTwo: game.playerTwo,
    positions: createBoardPositions(chess.board(), playerId, game.playerOne),
    opponentUsername: opponent.username,
    status: mapChessStatusToGameStatus(chess),
    turn
  };
};

export const loadGame = async (playerOne, playerTwo, fen, playerId): Promise<IBoard> => {
  const chess = new Chess();

  chess.load(fen);

  const game: IGameDTO = await gamesRepository.insertNewGame(
    fen,
    playerOne,
    playerTwo,
  );

  const chessTurn = chess.turn();
  const turn = chessTurn === 'w' ? game.playerOne : game.playerTwo;
  const opponentPlayerId = game.playerOne === playerId ? game.playerTwo : game.playerOne;
  const opponent: IPlayerDTO = await selectPlayerByPlayerId(opponentPlayerId);

  const board = {
    gameId: game.gameId,
    moves: chess.moves({ verbose: true }),
    fallenSoldiers: await getFallenSoldiers(game.gameId),
    playerOne,
    playerTwo,
    positions: createBoardPositions(chess.board(), playerId, playerOne),
    opponentUsername: opponent.username,
    status: mapChessStatusToGameStatus(chess),
    turn
  };

  publishBoardUpdates(board);

  return board;
};

export const deleteGame = async (gameId: string): Promise<string> => gamesRepository.deleteGameDataByGameId(gameId);
