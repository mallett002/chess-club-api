import jwt from 'jsonwebtoken';

import { PRIVATE_KEY } from '../../constants';
import { IToken } from '../../interfaces/account';

export const getToken = (username: string, playerId: string): IToken => {
  const expiresIn = '14d';
  const payload = {
    sub: username,
    playerId: playerId,
    iat: Date.now()
  };

  const signedToken = jwt.sign(payload, PRIVATE_KEY, {expiresIn});

  return {
    token: "Bearer " + signedToken,
  };
};

const getTokenFromHeaders = (token: string) => {
  if (token) {
    const [, jwt] = token.split(' ');

    return jwt;
  }

  return '';
}

export const verifyToken = (context) => {
  const accessToken = getTokenFromHeaders(context.token);

  try {
    return jwt.verify(accessToken, PRIVATE_KEY);
  } catch {
    return null;   
  }
};
