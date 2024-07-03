import { HttpError } from '../errorHandling/custonError';
import AssCompanyAndCategory, {
  AssCompanyAndCategoryInDB,
  ResponseAssCompanyAndCategory
} from '../model/AssociationCompanyAndCategory';
import { LogsCompanyCategory } from '../model/logs';
import associationCompanyAndCategoryRepository from '../repositiry/associationCompanyAndCategoryRepository';
import categoryServices from './categoryServices';
import companyServices from './companyServices';
import logsServices from './logsServices';

interface IAssociationCompanyAndCategoryServices {
  create(association: AssCompanyAndCategory, token: string): Promise<void>;
  searchAll(): Promise<ResponseAssCompanyAndCategory[]>;
  searchByIdCategory(
    idCategory: number
  ): Promise<ResponseAssCompanyAndCategory>;
  searchByIdCompany(idCompany: number): Promise<ResponseAssCompanyAndCategory>;
  delete(association: AssCompanyAndCategory, token: string): Promise<void>;
}

class AssociationCompanyAndCategoryServices
  implements IAssociationCompanyAndCategoryServices
{
  public async create(
    association: AssCompanyAndCategory,
    token: string
  ): Promise<void> {
    try {
      const exist = await this.searchByIdCompanyAndCategory(association, token);
      if (exist) throw new HttpError(403, 'Associação já existe');
      const associate =
        await associationCompanyAndCategoryRepository.create(association);
      association.id = associate;
      await this.createLogs(association, 'create', token);
    } catch (error) {
      if (error instanceof HttpError) {
        throw error; // Preserve original HttpError
      } else {
        throw new HttpError(500, (error as Error).message); // Convert other errors to HttpError
      }
    }
  }

  public async searchAll(): Promise<ResponseAssCompanyAndCategory[]> {
    try {
      const result = await associationCompanyAndCategoryRepository.searchAll();
      return this.converterAssData(result);
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      } else {
        throw new HttpError(500, (error as Error).message);
      }
    }
  }

  public async searchByIdCategory(
    idCategory: number
  ): Promise<ResponseAssCompanyAndCategory> {
    try {
      const result =
        await associationCompanyAndCategoryRepository.searchByIdCategory(
          idCategory
        );
      return this.converterAssData(result)[0];
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      } else {
        throw new HttpError(500, (error as Error).message);
      }
    }
  }

  public async searchByIdCompany(
    idCompany: number
  ): Promise<ResponseAssCompanyAndCategory> {
    try {
      const result =
        await associationCompanyAndCategoryRepository.searchByIdCompany(
          idCompany
        );
      return this.converterAssData(result)[0];
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      } else {
        throw new HttpError(500, (error as Error).message);
      }
    }
  }

  public async delete(
    association: AssCompanyAndCategory,
    token: string
  ): Promise<void> {
    try {
      const exist = await this.searchByIdCompanyAndCategory(association, token);
      if (!exist) throw new HttpError(404, 'Associação não esiste');
      await associationCompanyAndCategoryRepository.delete(association);
      await this.createLogs(association, 'delete', token);
    } catch (error) {
      throw new HttpError(500, String(Error));
    }
  }

  private async searchByIdCompanyAndCategory(
    association: AssCompanyAndCategory,
    token: string
  ): Promise<boolean> {
    try {
      const company = await companyServices.searchById(association.company_id);
      if (!company.associate) {
        company.associate = true;
        await companyServices.update(company, token);
      }
      await categoryServices.searchById(association.category_id);
      const search =
        await associationCompanyAndCategoryRepository.searchByIdCompanyAndCategory(
          association
        );
      if (search.length > 0) {
        return true;
      }
      return false;
    } catch (error) {
      throw new HttpError(500, String(Error));
    }
  }

  private converterAssData(
    assCompanyAndCategoryInDB: AssCompanyAndCategoryInDB[]
  ) {
    const categoryMap: Map<number, ResponseAssCompanyAndCategory> = new Map();

    assCompanyAndCategoryInDB.forEach((item) => {
      if (!categoryMap.has(item.category_id)) {
        categoryMap.set(item.category_id, {
          id: item.id,
          category: {
            id: item.category_id,
            name: item.category_name,
            active: item.active
          },
          companyAssociate: []
        });
      }

      const category = categoryMap.get(item.category_id);
      if (category) {
        category.companyAssociate.push({
          id: item.company_id,
          name: item.company_name,
          associate: item.company_associate,
          active: item.active
        });
      }
    });
    return Array.from(categoryMap.values());
  }

  private async createLogs(
    value: AssCompanyAndCategory,
    action: string,
    token: string
  ) {
    try {
      const log: LogsCompanyCategory = {
        id: 0,
        category_id: value.category_id,
        company_id: value.company_id,
        action: action,
        date: new Date(),
        user_id: 0
      };
      await logsServices.createLogCompany_Category(log, token);
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      } else {
        throw new HttpError(500, (error as Error).message);
      }
    }
  }
}

export default new AssociationCompanyAndCategoryServices();
