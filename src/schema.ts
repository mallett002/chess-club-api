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

  type PlayerInvite {
    playerId: ID!
    username: String!
  }

  type Invitation {
    invitationId: ID!
    invitor: PlayerInvite!
    invitee: PlayerInvite!
  }

  type OutboundInvitation {
    invitationId: ID!
    invitee: String!
  }

  type InboundInvitation {
    invitationId: ID!
    invitor: String!
  }

  type GameInvitations {
    invitations: [OutboundInvitation]
    inboundGameRequests: [InboundInvitation]
  }

  type Mutation {
    updateBoard(gameId: ID!, cell: String!): Board!
    endGame(gameId: ID!): ID
    createGame(invitationId: ID!, inviteeColor: String!): Board!
    loadGame(playerOne: ID!, playerTwo: ID!, fen: String!): Board!
    createPlayer(username: String!, password: String!): Token!
    createInvitation(inviteeUsername: String!): Invitation!
  }

  type Query {
    getBoard(gameId: ID!): Board
    getGames(playerId: ID!): [Game]!
    getInvitations: GameInvitations!
  }
`);
