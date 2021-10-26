import { getPgTestClient } from "../test-setup";

export const deletePlayers = async () => {
  const pgTestClient = await getPgTestClient();

  await Promise.all([
    pgTestClient.query('delete from chess_club.tbl_player where player_id is not null;'),
    pgTestClient.query('delete from chess_club.tbl_players_games where player_game_id is not null;')
  ]);
};
