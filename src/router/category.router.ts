import { Request, Response, Router } from 'express';
import authMiddlewareUserAdmin from '../middlewares/authMiddleware';
import CategoryServices from '../services/categoryServices';
import Category from '../model/category';

const routerCategory = Router();

routerCategory.post(
  '/create',
  authMiddlewareUserAdmin,
  async (req: Request, res: Response) => {
    try {
      const category: Category = req.body;
      const createCategory = await CategoryServices.createCompany(category);
      res.status(200).send(createCategory);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
);

routerCategory.get(
  '/searchall',
  authMiddlewareUserAdmin,
  async (req: Request, res: Response) => {
    try {
      const createCategory = await CategoryServices.searchAll();
      res.status(200).send(createCategory);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
);

routerCategory.get(
  '/searchbyid/:id',
  authMiddlewareUserAdmin,
  async (req: Request, res: Response) => {
    try {
      const idCategory = req.params;
      const createCategory = await CategoryServices.searchById(
        Number(idCategory.id)
      );
      res.status(200).send(createCategory);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
);

routerCategory.get(
  '/searchbyname/:name',
  authMiddlewareUserAdmin,
  async (req: Request, res: Response) => {
    try {
      const nameCategory = req.params;
      const createCategory = await CategoryServices.searchByName(
        nameCategory.name
      );
      res.status(200).send(createCategory);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
);

routerCategory.put(
  '/update',
  authMiddlewareUserAdmin,
  async (req: Request, res: Response) => {
    try {
      const category: Category = req.body;
      const createCategory = await CategoryServices.update(category);
      res.status(200).send(createCategory);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
);

routerCategory.delete(
  '/changestatus/:id',
  authMiddlewareUserAdmin,
  async (req: Request, res: Response) => {
    try {
      const idCategory = req.params;
      const createCategory = await CategoryServices.changeStatus(
        Number(idCategory.id)
      );
      res.status(200).send(createCategory);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
);

export { routerCategory };
