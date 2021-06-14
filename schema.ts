import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Book {
    title: String
    author: String
  }

  type Subscription {
    # Will update Book whenever one is added, pushing "Book" to subscribers
    bookAdded: Book
  }

  type Mutation {
    addBook(author: String, title: String): Book
  }

  type Query {
    books: [Book]
  }
`;
