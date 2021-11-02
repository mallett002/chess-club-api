import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';

import { PRIVATE_KEY } from './constants';
import {chessClubBaseUrl} from './index';

export const decodeToken = (bearerToken) => {
  const [, accessToken] = bearerToken.split(' ');

  return jwt.verify(accessToken, PRIVATE_KEY);
};

export const getJwtForPlayer = async (player) => {
  console.log('here..');
  try {
  const response = await fetch(`${chessClubBaseUrl}/login`, {
    body: JSON.stringify({
      username: player.username,
      password: player.password
    }),
    method: 'POST'
  });
  console.log({response});
  

  const json = await response.json();
  console.log({jsonIs: json});
  
  return json;} catch(error) {
    console.log({error});
    
  } 
  // return json.token;
};
