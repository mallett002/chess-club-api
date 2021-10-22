import { getGamesByPlayerId } from '../services/games';

export default (_, { playerId }) => getGamesByPlayerId(playerId);
