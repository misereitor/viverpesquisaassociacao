import { Request, Response, Router } from 'express';
import { LoginAdmin } from '../model/userAdmin';
import loginAdminServices from '../services/loginAdminServices';
import { HttpError } from '../errorHandling/custonError';

const routerAuthAdmin = Router();

routerAuthAdmin.post(
  '/login',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const login: LoginAdmin = req.body;
      const token: string = await loginAdminServices.login(login);
      res.status(200).json(token);
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.code).json({ message: error.message });
      } else {
        res.status(400).json({ message: (error as Error).message });
      }
    }
  }
);

export { routerAuthAdmin };
