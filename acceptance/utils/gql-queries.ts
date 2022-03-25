import { gql } from 'graphql-request';

export const createGameMutation = gql`
  mutation createGame($invitationId: ID!) {
      createGame(invitationId: $invitationId) {
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
  mutation createInvitation($inviteeUsername: String!, $invitorColor: InvitorColor!) {
  createInvitation(inviteeUsername: $inviteeUsername, invitorColor: $invitorColor) {
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

export const deleteInvitationMutation = gql`
  mutation deleteInvitation($invitationId: ID!) {
    deleteInvitation(invitationId: $invitationId)
  }
`;

export const loadGameMutation = gql`
  mutation loadGame($playerOne: ID!, $playerTwo: ID!, $fen: String!) {
        loadGame(playerOne: $playerOne, playerTwo: $playerTwo, fen: $fen) {
          gameId
        }
      }
  `;

export const getGamesQuery = gql`
  query GetGames($playerId: ID!){
    getGames(playerId: $playerId) {
      gameId
      playerOne
      playerTwo
      turn
      opponentUsername
    }
}`;

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
    fallenSoldiers {
      playerOnePieces
      playerTwoPieces
    }
    playerOne
    playerTwo
    opponentUsername
    positions {
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
        fallenSoldiers {
          playerOnePieces
          playerTwoPieces
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