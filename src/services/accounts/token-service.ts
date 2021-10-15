import jwt from 'jsonwebtoken';

import { ITokenSet } from '../../interfaces/account';

const PRIV_KEY = 'some-private-key';

export const getToken = (username: string): ITokenSet => {
  const expiresIn = '1d';
  
  const payload = {
    sub: username,
    iat: Date.now()
  };

  // Todo: determine which sign algorithm to use (RS256?)
  const signedToken = jwt.sign( payload, PRIV_KEY, {expiresIn});

  return {
    token: "Bearer " + signedToken,
    expires: expiresIn
  };
};
