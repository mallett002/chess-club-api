CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE GAME_COLOR AS ENUM ('w', 'b');

CREATE TABLE chess_club.tbl_players_games (
  player_game_id        UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id             UUID NOT NULL REFERENCES chess_club.tbl_player (player_id) ON DELETE CASCADE,
  player_color          GAME_COLOR NOT NULL,
  game_id               UUID NOT NULL REFERENCES chess_club.tbl_game (game_id) ON DELETE CASCADE
);
