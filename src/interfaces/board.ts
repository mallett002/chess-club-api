export enum IGameStatus {
  CHECK = 'CHECK',
  CHECKMATE = 'CHECKMATE',
  DRAW = 'DRAW',
  PLAY = 'PLAY',
  STALEMATE = 'STALEMATE'
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
  opponentUsername: string
  status: IGameStatus
  turn: string
}
