import { Response, Request, Router } from 'express';
import UserAdmin, { AlterPasswordRequest } from '../model/userAdmin';
import authMiddlewareUserAdmin from '../middlewares/authMiddleware';
import UserAdminService from '../services/userAdminServices';
import { HttpError } from '../errorHandling/custonError';

const routerAdmin = Router();

routerAdmin.post(
  '/create',
  authMiddlewareUserAdmin,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const userAdmin: UserAdmin = req.body;
      const token = req.headers['authorization'];
      const createUserAdmin = await UserAdminService.createUserAdmin(
        userAdmin,
        String(token)
      );
      res.status(200).send(createUserAdmin);
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.code).json({ message: error.message });
      } else {
        res.status(400).json({ message: (error as Error).message });
      }
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
      } else {
        res.status(400).json({ message: (error as Error).message });
      }
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
      if (error instanceof HttpError) {
        res.status(error.code).json({ message: error.message });
      } else {
        res.status(400).json({ message: (error as Error).message });
      }
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
      if (error instanceof HttpError) {
        res.status(error.code).json({ message: error.message });
      } else {
        res.status(400).json({ message: (error as Error).message });
      }
    }
  }
);

routerAdmin.put(
  '/update',
  authMiddlewareUserAdmin,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const userAdmin: UserAdmin = req.body;
      const token = req.headers['authorization'];
      const usersAdmin = await UserAdminService.update(
        userAdmin,
        String(token)
      );
      res.status(200).send(usersAdmin);
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.code).json({ message: error.message });
      } else {
        res.status(400).json({ message: (error as Error).message });
      }
    }
  }
);

routerAdmin.put(
  '/alterpassword',
  authMiddlewareUserAdmin,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const newPassword: AlterPasswordRequest = req.body;
      const token = req.headers['authorization'];
      await UserAdminService.alterPassword(newPassword, String(token));
      res.status(200).send();
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.code).json({ message: error.message });
      } else {
        res.status(400).json({ message: (error as Error).message });
      }
    }
  }
);

routerAdmin.delete(
  '/changestatus/:id',
  authMiddlewareUserAdmin,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const idUserAdmin = req.params;
      const token = req.headers['authorization'];
      const usersAdmin = await UserAdminService.changeStatus(
        Number(idUserAdmin.id),
        String(token)
      );
      res.status(200).send(usersAdmin);
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.code).json({ message: error.message });
      } else {
        res.status(400).json({ message: (error as Error).message });
      }
    }
  }
);

export { routerAdmin };
