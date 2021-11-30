CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE chess_club.tbl_invitation (
  invitation_id         UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
  invitor_id            UUID NOT NULL REFERENCES chess_club.tbl_player (player_id) ON DELETE CASCADE,
  invitee_id            UUID NOT NULL REFERENCES chess_club.tbl_player (player_id) ON DELETE CASCADE
);
