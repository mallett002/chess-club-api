CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE COLOR AS ENUM ('w', 'b');

CREATE TABLE chess_club.tbl_players_games (
  player_game_id        UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id             UUID NOT NULL REFERENCES chess_club.tbl_player (player_id),
  player_color          COLOR NOT NULL
);
