import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';

import { TOKEN_PRIVATE_KEY } from './constants';
import {chessClubBaseUrl} from './index';

export const decodeToken = (bearerToken) => {
  const [, accessToken] = bearerToken.split(' ');

  return jwt.verify(accessToken, TOKEN_PRIVATE_KEY);
};

export const getJwtForPlayer = async (player) => {
  const response = await fetch(`${chessClubBaseUrl}/login`, {
    body: JSON.stringify({
      username: player.username,
      password: player.password
    }),
	  headers: {'Content-Type': 'application/json'},
    method: 'post'
  });

  const json:any = await response.json();
  
  return json.token;
};
