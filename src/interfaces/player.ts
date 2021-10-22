export interface IPlayer {
  playerId: string
  username: string
}

export interface IPlayerPayload {
  password: string
  username: string
}

export interface IPlayerDTO {
  hashed_password: string
  player_id: string
  username: string
}
