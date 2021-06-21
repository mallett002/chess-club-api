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
    players: [String!]!
    positions: [Cell]!
    turn: String
  }

  type Subscription {
    boardUpdated: Board!
  }

  type Mutation {
    updateBoard(gameId: ID!, cell: String!): Board!
    createGame(playerOne: ID!, playerTwo: ID!): Board!
  }

  type Query {
    getGame: String
  }
`;
