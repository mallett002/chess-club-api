import { ITokenSet } from "./account";

export interface IPlayer {
  playerId: string
  username: string
}

export interface IPlayerPayload {
  password: string
  username: string
}

export interface IPlayerDTO extends IPlayer {
  hashed_password: string
}
