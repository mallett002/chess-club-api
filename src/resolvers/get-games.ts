import { getGamesByPlayerId } from '../services/games';

export default (parent, { playerId }, context) => getGamesByPlayerId(playerId);
