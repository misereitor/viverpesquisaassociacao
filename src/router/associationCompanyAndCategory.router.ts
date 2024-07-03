import { Request, Response, Router } from 'express';
import authMiddlewareUserAdmin from '../middlewares/authMiddleware';
import AssociationCompanyAndCategoryServices from '../services/AssociationCompanyAndCategoryServices';
import AssCompanyAndCategory from '../model/AssociationCompanyAndCategory';
import { HttpError } from '../errorHandling/custonError';

const routerAssCategoryCompany = Router();

routerAssCategoryCompany.post(
  '/create',
  authMiddlewareUserAdmin,
  async (req: Request, res: Response) => {
    try {
      const associate: AssCompanyAndCategory = req.body;
      const token = req.headers['authorization'];
      const create = await AssociationCompanyAndCategoryServices.create(
        associate,
        String(token)
      );
      res.status(200).send(create);
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.code).json({ message: error.message });
      } else {
        res.status(400).json({ message: (error as Error).message });
      }
    }
  }
);

routerAssCategoryCompany.get(
  '/searchall',
  authMiddlewareUserAdmin,
  async (req: Request, res: Response) => {
    try {
      const searchAll = await AssociationCompanyAndCategoryServices.searchAll();
      res.status(200).send(searchAll);
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.code).json({ message: error.message });
      } else {
        res.status(400).json({ message: (error as Error).message });
      }
    }
  }
);

routerAssCategoryCompany.get(
  '/searchbyidcategory/:id',
  authMiddlewareUserAdmin,
  async (req: Request, res: Response) => {
    try {
      const idCategory = req.params;
      const create =
        await AssociationCompanyAndCategoryServices.searchByIdCategory(
          Number(idCategory.id)
        );
      res.status(200).send(create);
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.code).json({ message: error.message });
      } else {
        res.status(400).json({ message: (error as Error).message });
      }
    }
  }
);

routerAssCategoryCompany.get(
  '/searchbyidcompany/:id',
  authMiddlewareUserAdmin,
  async (req: Request, res: Response) => {
    try {
      const idCompany = req.params;
      const create =
        await AssociationCompanyAndCategoryServices.searchByIdCompany(
          Number(idCompany.id)
        );
      res.status(200).send(create);
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.code).json({ message: error.message });
      } else {
        res.status(400).json({ message: (error as Error).message });
      }
    }
  }
);

routerAssCategoryCompany.delete(
  '/delete',
  authMiddlewareUserAdmin,
  async (req: Request, res: Response) => {
    try {
      const associate: AssCompanyAndCategory = req.body;
      const token = req.headers['authorization'];
      const create = await AssociationCompanyAndCategoryServices.delete(
        associate,
        String(token)
      );
      res.status(200).send(create);
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.code).json({ message: error.message });
      } else {
        res.status(400).json({ message: (error as Error).message });
      }
    }
  }
);

export { routerAssCategoryCompany };
