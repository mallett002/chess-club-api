const knex = require('knex');

let pgClient;

const knexConfig = {
  client: 'pg',
  connection: {
    "database": "chess-club-api",
    "password": "chess_club_api_ps",
    "user": "chess_club_api"
  }
};

const getPgTestClient = async () => {
  if (!pgClient) {
    pgClient = knex(knexConfig);
  }

  const records = await pgClient('chess_club.tbl_player');

  console.log({records});
  return pgClient;
};

beforeAll(async () => {
  await getPgTestClient();
});
