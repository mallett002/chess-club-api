import config from 'config';
import knex from 'knex';

let client;

const knexConfig = {
  client: 'pg',
  connection: config.get('chess_club_db')
};

export const getPgClient = () => {
  if (!client) {
    client = knex(knexConfig);
  }

  return client;
};
