import jwt from 'jsonwebtoken';

import { PRIVATE_KEY } from './constants';

export const decodeToken = (bearerToken) => {
  const [, accessToken] = bearerToken.split(' ');

  return jwt.verify(accessToken, PRIVATE_KEY);
};
