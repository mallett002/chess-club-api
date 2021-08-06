import { getBoardByGameId } from '../services/games';

export default (root, args, context) => getBoardByGameId(args.gameId);