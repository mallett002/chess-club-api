import { getPgTestClient } from "../test-setup";
import { encryptPassword } from "./password";

interface IDBPlayer {
  username: string
  password: string
}

export const createDBPlayer = async (player: IDBPlayer) => {
  const pgTestClient = await getPgTestClient();
  const encryptedPassword = encryptPassword(player.password);
  const text = 'INSERT INTO insert into chess_club.tbl_player(name, email) VALUES($1, $2) RETURNING *';
  const values = [player.username, encryptedPassword];

  try {
    const result = await pgTestClient.query(text, values);

    return result.rows[0];
  } catch (err) {
    console.log(err.stack)
  }
};
