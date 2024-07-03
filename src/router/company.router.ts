import { Request, Response, Router } from 'express';
import authMiddlewareUserAdmin from '../middlewares/authMiddleware';
import CompanyServices from '../services/companyServices';
import Company from '../model/company';
import { HttpError } from '../errorHandling/custonError';

const routerCompany = Router();

routerCompany.post(
  '/create',
  authMiddlewareUserAdmin,
  async (req: Request, res: Response) => {
    try {
      const company: Company = req.body;
      const token = req.headers['authorization'];
      const createCompany = await CompanyServices.createCompany(
        company,
        String(token)
      );
      res.status(200).send(createCompany);
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.code).json({ message: error.message });
      } else {
        res.status(400).json({ message: (error as Error).message });
      }
    }
  }
);

routerCompany.get(
  '/searchall',
  authMiddlewareUserAdmin,
  async (req: Request, res: Response) => {
    try {
      const createCompany = await CompanyServices.searchAll();
      res.status(200).send(createCompany);
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.code).json({ message: error.message });
      } else {
        res.status(400).json({ message: (error as Error).message });
      }
    }
  }
);

routerCompany.get(
  '/searchbyid/:id',
  authMiddlewareUserAdmin,
  async (req: Request, res: Response) => {
    try {
      const idCompany = req.params;
      const createCompany = await CompanyServices.searchById(
        Number(idCompany.id)
      );
      res.status(200).send(createCompany);
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.code).json({ message: error.message });
      } else {
        res.status(400).json({ message: (error as Error).message });
      }
    }
  }
);

routerCompany.get(
  '/searchbyname/:name',
  authMiddlewareUserAdmin,
  async (req: Request, res: Response) => {
    try {
      const nameCompany = req.params;
      const createCompany = await CompanyServices.searchByName(
        nameCompany.name
      );
      res.status(200).send(createCompany);
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.code).json({ message: error.message });
      } else {
        res.status(400).json({ message: (error as Error).message });
      }
    }
  }
);

routerCompany.put(
  '/update',
  authMiddlewareUserAdmin,
  async (req: Request, res: Response) => {
    try {
      const company: Company = req.body;
      const token = req.headers['authorization'];
      const createCompany = await CompanyServices.update(
        company,
        String(token)
      );
      res.status(200).send(createCompany);
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.code).json({ message: error.message });
      } else {
        res.status(400).json({ message: (error as Error).message });
      }
    }
  }
);

routerCompany.delete(
  '/changestatus/:id',
  authMiddlewareUserAdmin,
  async (req: Request, res: Response) => {
    try {
      const idCompany = req.params;
      const token = req.headers['authorization'];
      const createCompany = await CompanyServices.changeStatus(
        Number(idCompany.id),
        String(token)
      );
      res.status(200).send(createCompany);
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.code).json({ message: error.message });
      } else {
        res.status(400).json({ message: (error as Error).message });
      }
    }
  }
);

export { routerCompany };
