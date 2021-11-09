import config from 'config';
import jwt from 'jsonwebtoken';

import { IToken } from '../../interfaces/account';

export const getToken = (username: string, playerId: string): IToken => {
  const expiresIn = '14d';
  const payload = {
    sub: username,
    playerId: playerId,
    iat: Date.now()
  };

  const signedToken = jwt.sign(payload, config.get('tokenPrivateKey'), {expiresIn});

  return {
    token: "Bearer " + signedToken,
  };
};

const getTokenFromHeaders = (token: string): string => {
  if (token) {
    const [, jwt] = token.split(' ');

    return jwt;
  }

  return '';
}

export const verifyToken = (context: IToken): string | jwt.JwtPayload | null => {
  const accessToken = getTokenFromHeaders(context.token);

  try {
    return jwt.verify(accessToken, config.get('tokenPrivateKey'));
  } catch {
    return null;   
  }
};
