import { SQLDataSource } from 'datasource-sql';

interface IGame {
  gameId: string
  fen: string
  playerOne: string
  playerTwo: string
}

const mapGameDtoToDomain = (gameDto) => ({
  gameId: gameDto.game_id,
  fen: gameDto.fen,
  playerOne: gameDto.player_one,
  playerTwo: gameDto.player_two
});

class ChessClubDatabase extends SQLDataSource {

  async getGameByGameId(gameId): Promise<IGame> {
    const [game] = await this.knex('chess_club.tbl_game').where('game_id', gameId);

    return mapGameDtoToDomain(game);
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

  async updateGame(gameId, fen): Promise<string> {
    return await this.knex('chess_club.tbl_game')
      .where({ 'game_id': gameId })
      .update({ fen }, [fen])
      .returning('game_id');
  }

  async selectGamesForPlayer(playerId) {
    const games = await this.knex('chess_club.tbl_game')
      .where({ player_one: playerId })
      .orWhere({ player_two: playerId});

      return games.map(mapGameDtoToDomain);
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
