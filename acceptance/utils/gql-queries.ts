import { gql } from 'graphql-request';

export const createGameMutation = gql`
  mutation createGame($invitationId: ID!, $inviteeColor: String!) {
      createGame(invitationId: $invitationId, inviteeColor: $inviteeColor) {
        gameId
        playerOne
        playerTwo
        turn
      }
    }
`;

export const createPlayerMutation = gql`
  mutation CreatePlayer($username: String!, $password: String!){
    createPlayer(username: $username, password: $password) {
      token
    }
  }
`;

export const createInvitationMutation = gql`
  mutation createInvitation($inviteeUsername: String!, $inviteeColor: InviteeColor!) {
  createInvitation(inviteeUsername: $inviteeUsername, inviteeColor: $inviteeColor) {
    invitationId
    invitor {
      playerId
      username
    }
    invitee {
      playerId
      username
    }
  }
}
`;

export const loadGameMutation = gql`
  mutation loadGame($playerOne: ID!, $playerTwo: ID!, $fen: String!) {
        loadGame(playerOne: $playerOne, playerTwo: $playerTwo, fen: $fen) {
          gameId
        }
      }
  `;

export const getBoardQuery = gql`
  query GetBoard($gameId: ID!){
  getBoard(gameId: $gameId) {
    gameId
    moves {
      color
      from
      to
      flags
      piece
      san
    }
    playerOne
    playerTwo
    positions{
      type
      color
      label
    }
    status
    turn
  }
}`;

export const getInvitationsQuery = gql`
  query GetInvitations {
  getInvitations {
    invitations {
      invitationId
      invitee
    }
    inboundGameRequests {
      invitationId
      invitor
    }
  }
}`;

export const updateBoardMutation = gql`
  mutation updateBoard($gameId: ID!, $cell: String!) {
      updateBoard(gameId: $gameId, cell: $cell) {
        gameId
        playerOne
        playerTwo
        turn
        moves {
          color
          from
          to
          flags
          piece
          san
        }
        positions {
          type
          color
          label
        }
      }
    }
`;

export const endGameMutation = gql`
  mutation endGame($gameId: ID!) {
    endGame(gameId: $gameId)
  }
`;