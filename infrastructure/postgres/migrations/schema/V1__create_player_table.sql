CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE chess_club.tbl_player (
  player_id         UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
  username          VARCHAR(30) NOT NULL
);

-- For dummy data:
INSERT INTO chess_club.tbl_player (username)
VALUES ('willymally');

INSERT INTO chess_club.tbl_player (username)
VALUES ('jeffyserb');