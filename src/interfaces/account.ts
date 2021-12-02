import * as jwt from 'jsonwebtoken';

export interface IToken {
  token: string
}

declare module 'jsonwebtoken' {
  export interface PlayerJwtPayload extends jwt.JwtPayload {
    playerId: string
  } 
}
