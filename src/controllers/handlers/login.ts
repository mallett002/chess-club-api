import { IAuthenticatedPlayer } from "../../interfaces/player";
import authenticateUser from "../../services/accounts/authenticate";

export default async (req, res): Promise<IAuthenticatedPlayer> => {
  const {username, password} = req.body;

  const authPlayer: IAuthenticatedPlayer = await authenticateUser(username, password);

  if (!authPlayer) {
    return res.status(401).json({
      success: false,
       message: 'Username or password is incorrect.'
    });
  }

  return res.json(authPlayer);
};
