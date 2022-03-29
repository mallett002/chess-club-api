import { getPgTestClient } from "../test-setup";

export const selectPlayerByUsername = async (username) => {
  const pgTestClient = await getPgTestClient();

  const query = {
    text: 'select * from chess_club.tbl_player WHERE username = $1',
    values: [username]
  };
  const result = await pgTestClient.query(query);
  
  return result.rows[0];
};

export const deletePlayersGames = async () => {
  const pgTestClient = await getPgTestClient();

  await pgTestClient.query('DELETE FROM chess_club.tbl_players_games;');
  const result = await pgTestClient.query(
    'select * from chess_club.tbl_players_games where player_game_id is not null limit 1;'
  );
  
  expect(result.rows).toStrictEqual([]);
};

export const deletePlayers = async () => {
  const pgTestClient = await getPgTestClient();

  await pgTestClient.query('DELETE FROM chess_club.tbl_player;');

  const foundPlayer = await pgTestClient.query('select * from chess_club.tbl_player LIMIT 1');

  expect(foundPlayer.rows).toStrictEqual([]);
};

export const deleteGames = async () => {
  const pgTestClient = await getPgTestClient();

  await pgTestClient.query('DELETE FROM chess_club.tbl_game;');

  const foundGame = await pgTestClient.query('select * from chess_club.tbl_game where game_id is not null limit 1;');

  expect(foundGame.rows).toStrictEqual([]);
};

export const deleteInvitations = async () => {
  const pgTestClient = await getPgTestClient();

  await pgTestClient.query('DELETE FROM chess_club.tbl_invitation;');

  const foundInvitation = await pgTestClient.query('select * from chess_club.tbl_invitation where invitation_id is not null limit 1;');

  expect(foundInvitation.rows).toStrictEqual([]);
};

export const deleteFallenSoldiers = async () => {
  const pgTestClient = await getPgTestClient();

  await pgTestClient.query('DELETE FROM chess_club.tbl_captured_piece;');

  const found = await pgTestClient.query('select * from chess_club.tbl_captured_piece where captured_piece_id is not null limit 1;');

  expect(found.rows).toStrictEqual([]);
};

export const selectInvitations = async () => {
  const pgTestClient = await getPgTestClient();

  await pgTestClient.query('SELECT * FROM chess_club.tbl_invitation;');

  const result = await pgTestClient.query('select * from chess_club.tbl_invitation where invitation_id is not null limit 1;');

  return result.rows;
};

export const selectInvitation = async (invitationId) => {
  const pgTestClient = await getPgTestClient();
  const query = {
    text: 'select * from chess_club.tbl_invitation WHERE invitation_id = $1',
    values: [invitationId]
  };
  const result = await pgTestClient.query(query);

  const foundInvite =  result.rows[0];

  if (!foundInvite) {
    return null;
  }

  return foundInvite;
};
