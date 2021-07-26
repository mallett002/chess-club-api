const games = new Map();

export const persistGame = (gameId, game) => games.set(gameId, game);

export const getGameByGameId = (gameId) => games.get(gameId);

export const deleteAllGames = () => games.clear();

export const selectGamesForPlayer = (playerId) => {
  let gamesForPlayer = [];

  games.forEach((game) => {
    if (game.players.includes(playerId)) {
      gamesForPlayer.push(game);
    }
  });

  return gamesForPlayer;
};
