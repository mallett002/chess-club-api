import { getBoardByGameId } from '../services/games';

export default (__, args) => getBoardByGameId(args.gameId);
