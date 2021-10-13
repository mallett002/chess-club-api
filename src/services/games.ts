import {Chess} from 'chess.js';

import { getPubSub } from './pub-sub';
import { BOARD_UPDATED } from '../constants';
import { flattenPositions } from './board';
import { getChess } from './chess';
import { IGame } from '../interfaces/game';
import * as gamesRepository from '../repository/games';

const publishBoardUpdates = (board) => {
  const pubSub = getPubSub();

  pubSub.publish(BOARD_UPDATED, { boardUpdated: board });
};

/* 
  - Will eventually use player's JWT to determine who they are.
  - Will take in a username to determine who they are inviting.
  - Look up player by username and send invite.
*/
export const createGame = async ({ playerOne, playerTwo }) => {
  const chess = getChess(true);
  const fen = chess.fen();
  const turn = chess.turn();

  const [gameId] = await gamesRepository.insertNewGame(
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
    turn
  };

  publishBoardUpdates(board);

  return board;
};

export const updateGame = async (gameId, moveToCell) => {
  const game: IGame = await gamesRepository.getGameByGameId(gameId);
  const chess: Chess = getChess();

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
    turn: chess.turn()
  };

  publishBoardUpdates(newBoard);

  return newBoard;
};

export const getGamesByPlayerId = async (playerId: string) => {
  const games = await gamesRepository.selectGamesForPlayer(playerId);
  const chess = getChess(true);

  return games.map((game) => {
    chess.load(game.fen);

    const turn = chess.turn();

    return {
      ...game,
      turn
    };
  });
};

export const getBoardByGameId = async (gameId) => {
  const game = await gamesRepository.getGameByGameId(gameId);

  if (!game) {
    return null;
  }

  const chess = getChess();
  
  chess.load(game.fen);

  return {
    gameId,
    moves: chess.moves({ verbose: true }),
    playerOne: game.playerOne,
    playerTwo: game.playerTwo,
    positions: flattenPositions(chess.board()),
    turn: chess.turn()
  };
};
