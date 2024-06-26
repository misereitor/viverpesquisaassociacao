import { Response, Request, Router } from 'express';
import UserAdmin, { AlterPasswordRequest } from '../model/userAdmin';
import authMiddlewareUserAdmin from '../middlewares/authMiddleware';
import UserAdminService from '../services/userAdminServices';

const routerAdmin = Router();

routerAdmin.post(
  '/createuseradmin',
  authMiddlewareUserAdmin,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const userAdmin: UserAdmin = req.body;
      const createUserAdmin = await UserAdminService.createUserAdmin(userAdmin);
      res.status(200).send(createUserAdmin);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
);

routerAdmin.get(
  '/searchall',
  authMiddlewareUserAdmin,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const usersAdmin = await UserAdminService.searchAll();
      res.status(200).send(usersAdmin);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
);

routerAdmin.get(
  '/searchbyid/:id',
  authMiddlewareUserAdmin,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const idUserAdmin = req.params;
      const usersAdmin = await UserAdminService.searchById(
        Number(idUserAdmin.id)
      );
      res.status(200).send(usersAdmin);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
);

routerAdmin.get(
  '/searchbyusername/:username',
  authMiddlewareUserAdmin,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const userNameAdmin = req.params;
      const usersAdmin = await UserAdminService.searchByUserName(
        userNameAdmin.username
      );
      res.status(200).send(usersAdmin);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
);

routerAdmin.put(
  '/update',
  authMiddlewareUserAdmin,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const userAdmin: UserAdmin = req.body;
      const usersAdmin = await UserAdminService.update(userAdmin);
      res.status(200).send(usersAdmin);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
);

routerAdmin.put(
  '/alterpassword',
  authMiddlewareUserAdmin,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const newPassword: AlterPasswordRequest = req.body;
      await UserAdminService.alterPassword(newPassword);
      res.status(200).send();
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
);

routerAdmin.delete(
  '/delete/:id',
  authMiddlewareUserAdmin,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const idUserAdmin = req.params;
      const usersAdmin = await UserAdminService.delete(Number(idUserAdmin.id));
      res.status(200).send(usersAdmin);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
);

export { routerAdmin };
