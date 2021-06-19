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

  # type Subscription {
    # Will update Book whenever one is added, pushing "Book" to subscribers
    # bookAdded: Book
    # Clients will need to know when board is updated in real time
  # }

  type Mutation {
    # addBook(author: String, title: String): Book
    # Takes in a gameId and a cell to move to and returns the board
    updateBoard(gameId: ID!, cell: String!): Board!
    # Take in 2 players and return the board
    createGame(playerOne: ID!, playerTwo: ID!): Board!
  }

  type Query {
    getGame: String
  }
`;
