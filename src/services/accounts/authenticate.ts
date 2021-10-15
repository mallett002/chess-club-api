import { ITokenSet } from "../../interfaces/account";
import { IPlayer } from "../../interfaces/player";
import { selectPlayerByUsername } from "../../repository/player";
import { validatePassword } from "./password-helpers";
import { getToken } from "./token-service";

export default async (username, password): Promise<ITokenSet | null> => {
    const player = await selectPlayerByUsername(username);

    if (!player) {
      return null;
    }
    
    const isValidPassword = await validatePassword(password, player.hashed_password);
    
    if (!isValidPassword) {
      return null;
    }

    const tokens = getToken(username);

    return tokens;
};