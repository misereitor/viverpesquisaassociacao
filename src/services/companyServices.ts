import { HttpError } from '../errorHandling/custonError';
import { ChangeStatus } from '../model/changeStatus';
import Company from '../model/company';
import CompanyRepository from '../repositiry/companyRepository';

interface ICompanyServices {
  createCompany(company: Company): Promise<Company>;
  searchAll(): Promise<Company[]>;
  searchById(idCompany: number): Promise<Company>;
  searchByName(name: string): Promise<Company>;
  update(company: Company): Promise<Company>;
  changeStatus(idCompany: number): Promise<void>;
}

class CompanyServices implements ICompanyServices {
  public async createCompany(company: Company): Promise<Company> {
    try {
      const companyExist = await CompanyRepository.searchByName(company.name);
      if (companyExist) {
        throw new HttpError(302, 'Categoria já existe');
      }
      const newCompany = await CompanyRepository.save(company);
      company.id = newCompany;
      return company;
    } catch (error) {
      throw new HttpError(500, String(error));
    }
  }

  public async searchAll(): Promise<Company[]> {
    try {
      const allCategories = await CompanyRepository.searchAll();
      return allCategories;
    } catch (error) {
      throw new HttpError(500, String(error));
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
      throw new HttpError(500, String(error));
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
      throw new HttpError(500, String(error));
    }
  }

  public async update(company: Company): Promise<Company> {
    try {
      await this.searchById(company.id);
      const companyUpdate = CompanyRepository.update(company);
      return companyUpdate;
    } catch (error) {
      throw new HttpError(500, String(error));
    }
  }

  public async changeStatus(idCompany: number): Promise<void> {
    try {
      const company = await this.searchById(idCompany);
      const changeStatusCategory: ChangeStatus = {
        id: idCompany,
        active: !company.active
      };
      await CompanyRepository.changeStatus(changeStatusCategory);
    } catch (error) {
      throw new HttpError(500, String(error));
    }
  }
}

export default new CompanyServices();
