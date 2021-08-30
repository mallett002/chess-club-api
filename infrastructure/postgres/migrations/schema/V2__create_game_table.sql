CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE chess_club.tbl_game (
  game_id       UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
  fen           VARCHAR(100) NOT NULL,
  player_one    UUID NOT NULL REFERENCES chess_club.tbl_player (player_id),
  player_two    UUID NOT NULL REFERENCES chess_club.tbl_player (player_id)
);
