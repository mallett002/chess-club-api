import knex from 'knex';

let client;

const knexConfig = {
  client: 'pg',
  connection: {
    "database": "chess-club-api",
    "password": "chess_club_api_ps",
    "user": "chess_club_api"
  }
};

export const getPgTestClient = () => {
  if (!client) {
    client = knex(knexConfig);
  }

  return client;
};

beforeAll(() => {
  getPgTestClient();
});
