export enum IGameStatus {
  CHECK = 'CHECK',
  CHECKMATE = 'CHECKMATE',
  DRAW = 'DRAW',
  PLAY = 'PLAY',
  STALEMATE = 'STALEMATE'
}

export enum IPiece {
  p = 'p',
  r = 'r',
  n = 'n',
  b = 'b',
  q = 'q',
  k = 'k'
}

export enum IColor {
  w = 'w',
  b = 'b',
}

export interface IMove {
  captured: string
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

export interface IFallenSoldiers {
  playerOnePieces: IPiece[]
  playerTwoPieces: IPiece[]
}

export interface IBoard {
  gameId: string
  moves: IMove[]
  fallenSoldiers: IFallenSoldiers
  playerOne: string
  playerTwo: string
  positions: IPosition[]
  opponentUsername: string
  status: IGameStatus
  turn: string
}
