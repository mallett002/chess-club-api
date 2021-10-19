import { ITokenSet } from "../../interfaces/account";
import { IPlayerDTO } from "../../interfaces/player";
import { selectPlayerByUsername } from "../../repository/player";
import { validatePassword } from "./password-helpers";
import { getTokenSet } from "./token-service";

export default async (username: string, password: string): Promise<ITokenSet | null> => {
    const player: IPlayerDTO = await selectPlayerByUsername(username);

    if (!player) {
      return null;
    }

    const isValidPassword: boolean = validatePassword(password, player.hashed_password);

    if (!isValidPassword) {
      return null;
    }

    return getTokenSet(username, player.player_id);
};