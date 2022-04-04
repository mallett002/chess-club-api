CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE PIECE AS ENUM ('p', 'r', 'n', 'b', 'q', 'k');

CREATE TABLE chess_club.tbl_captured_piece (
  captured_piece_id     UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id               UUID NOT NULL REFERENCES chess_club.tbl_game (game_id) ON DELETE CASCADE,
  name                  PIECE NOT NULL,
  color                 GAME_COLOR NOT NULL
);
