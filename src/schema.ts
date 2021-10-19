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

  type Board {
    gameId: ID!
    moves: [Move]
    playerOne: String!
    playerTwo: String!
    positions: [Cell]!
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
    // Todo: remove these:
    // token: String
    // expires: String
  }

  type Subscription {
    boardUpdated(gameId: ID!): Board!
  }

  type Mutation {
    updateBoard(gameId: ID!, cell: String!): Board!
    createGame(playerOne: ID!, playerTwo: ID!): Board!
    createPlayer(username: String!, password: String!): Player!
  }

  type Query {
    getBoard(gameId: ID!): Board
    getGames(playerId: ID!): [Game]!
  }
`);
