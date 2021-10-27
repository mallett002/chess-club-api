import jwt from 'jsonwebtoken';

// TODO: PULL THIS IN FROM AN ENV VAR
import { PRIVATE_KEY } from './constants';

export const decodeToken = (bearerToken) => {
  const [, accessToken] = bearerToken.split(' ');

  return jwt.verify(accessToken, PRIVATE_KEY);
};
