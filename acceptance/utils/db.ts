import { getPgTestClient } from "../test-setup";

export const deletePlayers = async () => {
  const pgTestClient = await getPgTestClient();

  await Promise.all([
    pgTestClient.query('delete from chess_club.tbl_player where player_id is not null;'),
    pgTestClient.query('delete from chess_club.tbl_players_games where player_game_id is not null;')
  ]);

  const [foundPlayer, foundPlayersGames] = await Promise.all([
    pgTestClient.query('select * from chess_club.tbl_player LIMIT 1'),
    pgTestClient.query('select * from chess_club.tbl_players_games LIMIT 1')
  ]);

  expect(foundPlayer.rows).toStrictEqual([]);
  expect(foundPlayersGames.rows).toStrictEqual([]);
};

export const selectPlayerByUsername = async (username) => {
  const pgTestClient = await getPgTestClient();

  const query = {
    text: 'select * from chess_club.tbl_player WHERE username = $1',
    values: [username]
  };
  const reuslt = await pgTestClient.query(query);
  
  return reuslt.rows[0];
};
