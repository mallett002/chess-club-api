import { getGamesByPlayerId } from '../services/games';

export default (parent, { playerId }, { dataSources }) => getGamesByPlayerId(playerId, dataSources.chessClubDatabase);
