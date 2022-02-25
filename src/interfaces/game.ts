export interface IGameDTO {
  fen: string
  gameId: string
  playerOne: string
  playerTwo: string
}

export interface IGameDomain {
  fen: string
  gameId: string
  playerOne: string
  playerTwo: string
  opponentUsername: string
  turn: string // this is an ID
}
