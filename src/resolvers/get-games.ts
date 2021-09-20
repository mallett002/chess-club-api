import { getGamesByPlayerId } from '../services/games';

export default (_, { playerId }, { dataSources }) => getGamesByPlayerId(playerId, dataSources.chessClubDatabase);
