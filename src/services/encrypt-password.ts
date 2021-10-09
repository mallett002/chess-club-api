import bcrypt from 'bcrypt';

export const persistPlayer = async (username, password, db) => {
  let player;

  bcrypt.genSalt(10, async function (err, salt) {
    bcrypt.hash(password, salt, async function (err, hash) {
      if (err) {
        throw new Error('Something went wrong.');
      }

      player = await db.insertNewPlayer(username, hash);
    });
  });

  // TODO: FIGURE out why this is undefined.
  // Refactor & rename this file.
  console.log({playerInhere: player});
  

  return player;
};