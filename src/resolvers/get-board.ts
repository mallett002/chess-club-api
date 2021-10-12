import { getBoardByGameId, testGetBoardByGameId } from '../services/games';

export default (root, args, context) => testGetBoardByGameId(args.gameId);
