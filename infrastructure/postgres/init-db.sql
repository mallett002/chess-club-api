-- Todo: create roles and chess_club_api database
-- flyway and chess_club_
CREATE ROLE flyway LOGIN PASSWORD 'flyway_ps' CREATEDB CREATEROLE
CREATE ROLE chess_club_api LOGIN PASSWORD 'membership_api_ps'

CREATE DATABASE "chess-club-api"

GRANT ALL ON DATABASE chess-club-api TO flyway
