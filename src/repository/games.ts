const games = new Map();

export const insertNewGame = (gameId, game) => games.set(gameId, game);

export const getGameByGameId = (gameId) => games.get(gameId);

export const deleteAllGames = () => games.clear();

export const updateGame = (gameId, payload) => {
  games.set(gameId, payload);

  return games.get(gameId);
};

export const selectGamesForPlayer = (playerId) => {
  let gamesForPlayer = [];

  games.forEach((game) => {

    if (game.playerOne === playerId || game.playerTwo === playerId) {
      gamesForPlayer.push(game);
    }
  });

  return gamesForPlayer;
};
