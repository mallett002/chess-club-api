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

  type Header {
    gameId: String!
    playerOne: String!
    playerTwo: String!
  }

  type Board {
    gameHeader: Header
    moves: [Move]
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
    # updateBoard(Move): String
    createGame(playerOne: ID!, playerTwo: ID!): Board!
  }

  type Query {
    getGame: String
  }
`;
