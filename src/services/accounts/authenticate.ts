/**** Log a user in ****/

import { IPlayer } from "../../interfaces/player";
import { selectPlayerByUsername } from "../../repository/player";
import { validatePassword } from "./password-helpers";

// User sends username & password
// Check if password matches for that user
// give them a jwt if it does
export default async (username, password) => {
  // Check if password matches for that user
    // Get user from the db
    console.log({username, password});
    
    const player = await selectPlayerByUsername(username);
    
    const isValidPassword = await validatePassword(password, player.hashed_password);
    
    if (!isValidPassword) {
      return null;
    }

    // Todo: give them a jwt
    return {
      accessToken: 'some jwt',
      expiresIn: 'some expiration',
      refreshToken: 'some refresh token'
    };
};