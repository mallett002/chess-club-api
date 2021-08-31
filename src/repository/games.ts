import { SQLDataSource } from 'datasource-sql';

class ChessClubDatabase extends SQLDataSource {
  // getPlayers() {
  //   return this.knex
  //     .select('*')
  //     .from('chess_club.tbl_player');
  // }

  insertNewGame = async (fen: string, playerOne: string, playerTwo: string) => {
    const [gameId] = await Promise.all([
      this.knex('chess_club.tbl_game').insert({
        fen,
        player_one: playerOne,
        player_two: playerTwo
      }).returning('game_id'),
      await this.knex('chess_club.tbl_players_games').insert({
        player_id: playerOne,
        player_color: 'w'
      }),
      await this.knex('chess_club.tbl_players_games').insert({
        player_id: playerTwo,
        player_color: 'b'
      })
    ]);
  
    return gameId;
  }
}

export default ChessClubDatabase;

// const games = new Map();

// export const insertNewGame = (gameId, game) => games.set(gameId, game);

// export const getGameByGameId = (gameId) => games.get(gameId);

// export const deleteAllGames = () => games.clear();

// export const updateGame = (gameId, payload) => {
//   games.set(gameId, payload);

//   return games.get(gameId);
// };

// export const selectGamesForPlayer = (playerId) => {
//   let gamesForPlayer = [];

//   games.forEach((game) => {

//     if (game.playerOne === playerId || game.playerTwo === playerId) {
//       gamesForPlayer.push(game);
//     }
//   });

//   return gamesForPlayer;
// };
