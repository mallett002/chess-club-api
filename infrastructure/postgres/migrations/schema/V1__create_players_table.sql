CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE chess_club.tbl_players (
  player_id         UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
  username          VARCHAR(30) NOT NULL
);
