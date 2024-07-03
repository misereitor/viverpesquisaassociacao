import { HttpError } from '../errorHandling/custonError';
import { ChangeStatus } from '../model/changeStatus';
import Company from '../model/company';
import { LogsCompany } from '../model/logs';
import CompanyRepository from '../repositiry/companyRepository';
import logsServices from './logsServices';

interface ICompanyServices {
  createCompany(company: Company, token: string): Promise<Company>;
  searchAll(): Promise<Company[]>;
  searchById(idCompany: number): Promise<Company>;
  searchByName(name: string): Promise<Company>;
  update(company: Company, token: string): Promise<Company>;
  changeStatus(idCompany: number, token: string): Promise<void>;
}

class CompanyServices implements ICompanyServices {
  public async createCompany(
    company: Company,
    token: string
  ): Promise<Company> {
    try {
      const companyExist = await CompanyRepository.searchByName(company.name);
      if (companyExist) {
        throw new HttpError(302, 'Categoria já existe');
      }
      const newCompany = await CompanyRepository.save(company);
      company.id = newCompany;
      await this.createLogs(company, company, 'create', token);
      return company;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      } else {
        throw new HttpError(500, (error as Error).message);
      }
    }
  }

  public async searchAll(): Promise<Company[]> {
    try {
      const allCategories = await CompanyRepository.searchAll();
      return allCategories;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      } else {
        throw new HttpError(500, (error as Error).message);
      }
    }
  }

  public async searchById(idCompany: number): Promise<Company> {
    try {
      const company = await CompanyRepository.searchById(idCompany);
      if (!company) {
        throw new HttpError(404, 'Categoria não encontrada');
      }
      return company;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      } else {
        throw new HttpError(500, (error as Error).message);
      }
    }
  }

  public async searchByName(name: string): Promise<Company> {
    try {
      const company = await CompanyRepository.searchByName(name);
      if (!company) {
        throw new HttpError(404, 'Categoria não encontrada');
      }
      return company;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      } else {
        throw new HttpError(500, (error as Error).message);
      }
    }
  }

  public async update(company: Company, token: string): Promise<Company> {
    try {
      const oldValue = await this.searchById(company.id);
      const newValue = await CompanyRepository.update(company);
      await this.createLogs(oldValue, newValue, 'update', token);
      return newValue;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      } else {
        throw new HttpError(500, (error as Error).message);
      }
    }
  }

  public async changeStatus(idCompany: number, token: string): Promise<void> {
    try {
      const oldValue = await this.searchById(idCompany);
      const changeStatusCategory: ChangeStatus = {
        id: idCompany,
        active: !oldValue.active
      };
      const newValue =
        await CompanyRepository.changeStatus(changeStatusCategory);
      await this.createLogs(oldValue, newValue, 'changeStatus', token);
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      } else {
        throw new HttpError(500, (error as Error).message);
      }
    }
  }

  private async createLogs(
    oldValue: Company,
    newValue: Company,
    action: string,
    token: string
  ) {
    try {
      const log: LogsCompany = {
        id: 0,
        company_id: newValue.id,
        action: action,
        old_value: oldValue,
        new_value: newValue,
        date: new Date(),
        user_id: 0
      };
      await logsServices.createLogCompany(log, token);
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      } else {
        throw new HttpError(500, (error as Error).message);
      }
    }
  }
}

export default new CompanyServices();
