CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE chess_club.tbl_player (
  player_id         UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
  username          VARCHAR(30) NOT NULL,
  hashed_password   VARCHAR(100) NOT NULL
);

-- For dummy data:
INSERT INTO chess_club.tbl_player (username, hashed_password)
VALUES ('willymally', '$2b$10$0rs91jYTUlukSyLnYQAg8OV/YHsXWAz.0ScqQOyYMbKm3oshuiO26');

INSERT INTO chess_club.tbl_player (username, hashed_password)
VALUES ('jeffyserb', '$2b$10$0rs91jYTUlukSyLnYQAg8OV/YHsXWAz.0ScqQOyYMbKm3oshuiO26');