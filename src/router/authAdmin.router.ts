import { Request, Response, Router } from 'express';
import { LoginAdmin } from '../model/userAdmin';
import loginAdminServices from '../services/loginAdminServices';

const routerAuthAdmin = Router();

routerAuthAdmin.post(
  '/login',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const login: LoginAdmin = req.body;
      const token: string = await loginAdminServices.login(login);
      res.status(200).json(token);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
);

export { routerAuthAdmin };
