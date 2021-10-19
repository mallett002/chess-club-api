import jwt from 'jsonwebtoken';

import { PRIVATE_KEY } from '../../constants';
import { ITokenSet } from '../../interfaces/account';

export const getTokenSet = (username: string, playerId: string): ITokenSet => {
  const expiresIn = '1d';
  const payload = {
    sub: username,
    playerId: playerId,
    iat: Date.now()
  };

  console.log({payload});
  

  const signedToken = jwt.sign(payload, PRIVATE_KEY, {expiresIn});

  return {
    token: "Bearer " + signedToken,
    expires: expiresIn
  };
};
