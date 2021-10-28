const { Client } = require('pg');

let pgTestClient;

export const getPgTestClient = async () => {
  if (!pgTestClient) {
    pgTestClient = new Client({
      user: 'chess_club_api',
      host: 'localhost',
      database: 'chess-club-api',
      password: 'chess_club_api_ps',
      port: 5432,
    });
    
    await pgTestClient.connect();
  }

  return pgTestClient;
};

beforeAll(async() => {
  await getPgTestClient();
});

afterAll(() => {
  pgTestClient.end();
});

module.exports = {
  getPgTestClient
};
