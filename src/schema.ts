import { buildSchema } from 'graphql';

export const typeDefs = buildSchema(`
  type Cell {
    type: String
    color: String
    label: String
  }

  type Move {
    color: String
    from: String
    to: String
    flags: String
    piece: String
    san: String
  }

  enum GameStatus {
    PLAY
    CHECK
    CHECKMATE
    DRAW
    STALEMATE
  }

  type Board {
    gameId: ID!
    moves: [Move]
    playerOne: String!
    playerTwo: String!
    positions: [Cell]!
    status: GameStatus!
    turn: String
  }

  type Game {
    fen: String!
    gameId: ID!
    playerOne: String!
    playerTwo: String!
    turn: String
  }

  type Player {
    playerId: ID!
    username: String!
  }

  type Subscription {
    boardUpdated(gameId: ID!): Board!
  }

  type Token {
    token: String!
  }

  type Mutation {
    updateBoard(gameId: ID!, cell: String!): Board!
    endGame(gameId: ID!): ID
    createGame(playerOne: ID!, playerTwo: ID!): Board!
    loadGame(playerOne: ID!, playerTwo: ID!, fen: String!): Board!
    createPlayer(username: String!, password: String!): Token!
  }

  type Query {
    getBoard(gameId: ID!): Board
    getGames(playerId: ID!): [Game]!
  }
`);
