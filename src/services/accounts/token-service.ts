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
