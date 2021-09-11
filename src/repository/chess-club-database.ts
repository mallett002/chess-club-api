import { SQLDataSource } from 'datasource-sql';

class ChessClubDatabase extends SQLDataSource {

  async getGameByGameId(gameId) {
    // const [game] = 
    await this.knex('chess_club.tbl_game').where('game_id', gameId);

    // return {
    //   gameId: game.game_id,
    //   fen: game.fen,
    //   playerOne: game.player_one,
    //   playerTwo: game.player_two
    // };
  }

  async insertNewGame(fen: string, playerOne: string, playerTwo: string): Promise<string> {
    const [gameId]: string[] = await Promise.all([
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

  async updateGame(gameId, fen) {
    await this.knex('chess_club.tbl_game')
      .where({'game_id': gameId})
      .update({fen}, [fen])
      .returning('game_id');
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
