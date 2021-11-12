interface IGameStatus {
  inCheck: boolean
  inCheckmate: boolean
}

export interface IMove {
  color: string
  from: string
  to: string
  flags: string
  piece: string
  san: string
}

export interface IPosition {
  color: string
  label: string
  type: string  
}

export interface IBoard {
  gameId: string
  moves: IMove[]
  playerOne: string
  playerTwo: string
  positions: IPosition[]
  status: IGameStatus
  turn: string
}
