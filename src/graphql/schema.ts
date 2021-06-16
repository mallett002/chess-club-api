import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Cell {
    type: String
    color: String
  }

  type Row [Cell]

  type Move {
    color: String
    from: String
    to: String
    flags: String
    piece: String
    san: String
  }

  type Board {
    turn: String
    positions: [Row]!
    moves: [Move]!
  }

  type Subscription {
    # Will update Book whenever one is added, pushing "Book" to subscribers
    # bookAdded: Book
    # Clients will need to know when board is updated in real time
  }

  type Mutation {
    # addBook(author: String, title: String): Book
    updateBoard(Move): String
  }

  type Query {
    getBoard: Board
  }
`;
