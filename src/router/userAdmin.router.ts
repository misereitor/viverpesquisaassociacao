import { Response, Request, Router } from 'express';
import UserAdmin, {
  AlterPasswordRequest,
  IdUserAdminRequest,
  UserNameAdminRequest
} from '../model/userAdmin';
import authMiddlewareUserAdmin from '../middlewares/authMiddleware';
import UserAdminService from '../services/userAdminServices';
import { HttpError } from '../errorHandling/custonError';

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
      if (error instanceof HttpError) {
        res.status(error.code).json({ message: error.message });
        return;
      }
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
      if (error instanceof HttpError) {
        res.status(error.code).json({ message: error.message });
        return;
      }
      res.status(400).json({ message: (error as Error).message });
    }
  }
);

routerAdmin.get(
  '/searchbyid',
  authMiddlewareUserAdmin,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const idUserAdmin: IdUserAdminRequest = req.body;
      const usersAdmin = await UserAdminService.searchById(idUserAdmin.id);
      res.status(200).send(usersAdmin);
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.code).json({ message: error.message });
        return;
      }
      res.status(400).json({ message: (error as Error).message });
    }
  }
);

routerAdmin.get(
  '/searchbyusername',
  authMiddlewareUserAdmin,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const userNameAdmin: UserNameAdminRequest = req.body;
      const usersAdmin = await UserAdminService.searchByUserName(
        userNameAdmin.username
      );
      res.status(200).send(usersAdmin);
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.code).json({ message: error.message });
        return;
      }
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
      if (error instanceof HttpError) {
        res.status(error.code).json({ message: error.message });
        return;
      }
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
      if (error instanceof HttpError) {
        res.status(error.code).json({ message: error.message });
        return;
      }
      res.status(400).json({ message: (error as Error).message });
    }
  }
);

routerAdmin.delete(
  '/delete',
  authMiddlewareUserAdmin,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const idUserAdmin: IdUserAdminRequest = req.body;
      const usersAdmin = await UserAdminService.delete(idUserAdmin.id);
      res.status(200).send(usersAdmin);
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.code).json({ message: error.message });
        return;
      }
      res.status(400).json({ message: (error as Error).message });
    }
  }
);

export { routerAdmin };
