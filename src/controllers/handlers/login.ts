import { ITokenSet } from "../../interfaces/account";
import authenticateUser from "../../services/accounts/authenticate";

export default async (req, res) => {
  const {username, password} = req.body;

  const tokens: ITokenSet = await authenticateUser(username, password);

  if (!tokens) {
    return res.status(401).json({
      success: false,
       message: 'Username or password is incorrect.'
    });
  }

  return res.json(tokens);
};
