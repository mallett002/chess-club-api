import { gql } from 'apollo-server';

export const typeDefs = gql`
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

  type Subscription {
    boardUpdated(gameId: ID!): Board!
  }

  type Mutation {
    updateBoard(gameId: ID!, cell: String!): Board!
    createGame(playerOne: ID!, playerTwo: ID!): Board!
  }

  type Query {
    getGames(playerId: ID!): [Board]!
  }
`;
