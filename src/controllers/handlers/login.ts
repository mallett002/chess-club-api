import { Request, Response, Send } from "express";
import { IToken } from "../../interfaces/account";
import authenticateUser from "../../services/accounts/authenticate";

export default async (req: Request, res: Response) => {
  const {username, password} = req.body;

  const token: IToken = await authenticateUser(username, password);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Username or password is incorrect.'
    });
  }

  return res.json(token);
};
