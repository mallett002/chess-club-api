import { getPgTestClient } from "../test-setup";

interface IDBPlayer {
  username: string
  password: string
}

export const createDBPlayer = async (player: IDBPlayer) => {
  const pgTestClient = await getPgTestClient();
  const hashedPassword = encryptPassword(player.password);
  const text = 'INSERT INTO insert into chess_club.tbl_player(name, email) VALUES($1, $2) RETURNING *';
  const values = [player.username, player.hashedPassword];

  try {
    const result = await pgTestClient.query(text, values);

    return result.rows[0];
  } catch (err) {
    console.log(err.stack)
  }
};
