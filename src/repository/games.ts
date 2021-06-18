const games = new Map();

export const persistGame = (gameId, fen) => games.set(gameId, fen);

export const gameGameByGameId = (gameId) => games.get(gameId);

export const deleteAllGames = () => games.clear();
