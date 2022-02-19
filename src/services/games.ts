import {Chess} from 'chess.js';

import { getPubSub } from './pub-sub';
import { BOARD_UPDATED } from '../constants';
import { flattenPositions, mapChessStatusToGameStatus } from './board';
import { IGame } from '../interfaces/game';
import * as gamesRepository from '../repository/games';
import * as invitationRepository from '../repository/invitation';
import { IBoard } from '../interfaces/board';
import { IDBInvitation } from '../interfaces/invitation';

const publishBoardUpdates = (board): void => {
  const pubSub = getPubSub();

  pubSub.publish(BOARD_UPDATED, { boardUpdated: board });
};

/* 
  - Will eventually use player's JWT to determine who they are.
  - Will take in a username to determine who they are inviting.
  - Look up player by username and send invite.
*/
export const createGame = async (invitationId: string): Promise<IBoard> => {
  const invitation: IDBInvitation = await invitationRepository.selectInvitationById(invitationId);

  if (!invitation) {
    throw new Error('Invitation does not exist.');
  }

  const playerOneId = invitation.invitee_color === 'w' ? invitation.invitee_id : invitation.invitor_id;
  const playerTwoId = invitation.invitee_color === 'b' ? invitation.invitee_id : invitation.invitor_id;

  const chess = new Chess();
  const fen = chess.fen();
  const turn = chess.turn();

  const gameId = await gamesRepository.insertNewGame(
    fen,
    playerOneId,
    playerTwoId,
  );

  if (gameId) {
    await invitationRepository.deleteInvitationById(invitationId);
  } else {
    throw new Error('Something went wrong creating the game');
  }

  const board = {
    gameId,
    moves: chess.moves({ verbose: true }),
    playerOne: playerOneId,
    playerTwo: playerTwoId,
    positions: flattenPositions(chess.board()),
    status: mapChessStatusToGameStatus(chess),
    turn
  };

  publishBoardUpdates(board);

  return board;
};

export const updateGame = async (gameId, moveToCell): Promise<IBoard> => {
  const game: IGame = await gamesRepository.getGameByGameId(gameId);
  const chess: Chess = new Chess();

  chess.load(game.fen);

  const move = chess.move(moveToCell);
  
  if (!move) {
    throw Error('Not a valid move');
  }

  await gamesRepository.updateGame(gameId, chess.fen());

  const newBoard = {
    gameId,
    moves: chess.moves({ verbose: true }),
    playerOne: game.playerOne,
    playerTwo: game.playerTwo,
    positions: flattenPositions(chess.board()),
    status: mapChessStatusToGameStatus(chess),
    turn: chess.turn()
  };

  publishBoardUpdates(newBoard);

  return newBoard;
};

export const getGamesByPlayerId = async (playerId: string): Promise<IGame[]> => {
  const games = await gamesRepository.selectGamesForPlayer(playerId);

  return games.map((game) => {
    const chess = new Chess();

    chess.load(game.fen);

    const turn = chess.turn();

    return {
      ...game,
      turn
    };
  });
};

export const getBoardByGameId = async (gameId: string): Promise<IBoard> => {
  const game: IGame = await gamesRepository.getGameByGameId(gameId);

  if (!game) {
    return null;
  }

  const chess = new Chess();

  chess.load(game.fen);
  
  return {
    gameId,
    moves: chess.moves({ verbose: true }),
    playerOne: game.playerOne,
    playerTwo: game.playerTwo,
    positions: flattenPositions(chess.board()),
    status: mapChessStatusToGameStatus(chess),
    turn: chess.turn()
  };
};

export const loadGame = async (playerOne, playerTwo, fen) => {
  const chess = new Chess();

  chess.load(fen);

  const gameId: string = await gamesRepository.insertNewGame(
    fen,
    playerOne,
    playerTwo,
  );

  const board = {
    gameId,
    moves: chess.moves({ verbose: true }),
    playerOne,
    playerTwo,
    positions: flattenPositions(chess.board()),
    status: mapChessStatusToGameStatus(chess),
    turn: chess.turn()
  };

  publishBoardUpdates(board);

  return board;
};

export const deleteGame = async (gameId: string): Promise<string> => gamesRepository.deleteGameDataByGameId(gameId);
