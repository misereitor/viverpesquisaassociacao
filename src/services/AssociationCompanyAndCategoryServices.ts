import { HttpError } from '../errorHandling/custonError';
import AssCompanyAndCategory, {
  AssCompanyAndCategoryInDB,
  ResponseAssCompanyAndCategory
} from '../model/AssociationCompanyAndCategory';
import associationCompanyAndCategoryRepository from '../repositiry/associationCompanyAndCategoryRepository';

interface IAssociationCompanyAndCategoryServices {
  create(association: AssCompanyAndCategory): Promise<void>;
  searchAll(): Promise<ResponseAssCompanyAndCategory[]>;
  searchByIdCategory(
    idCategory: number
  ): Promise<ResponseAssCompanyAndCategory>;
  searchByIdCompany(idCompany: number): Promise<ResponseAssCompanyAndCategory>;
  delete(association: AssCompanyAndCategory): Promise<void>;
}

class AssociationCompanyAndCategoryServices
  implements IAssociationCompanyAndCategoryServices
{
  public async create(association: AssCompanyAndCategory): Promise<void> {
    try {
      const exist = await this.searchByIdCompanyAndCategory(association);
      if (exist) throw new HttpError(403, 'Associação já existe');
      await associationCompanyAndCategoryRepository.create(association);
    } catch (error) {
      throw new HttpError(500, String(error));
    }
  }

  public async searchAll(): Promise<ResponseAssCompanyAndCategory[]> {
    try {
      const result = await associationCompanyAndCategoryRepository.searchAll();
      return this.converterAssData(result);
    } catch (error) {
      throw new HttpError(500, String(error));
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
      throw new HttpError(500, String(error));
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
      throw new HttpError(500, String(error));
    }
  }

  public async delete(association: AssCompanyAndCategory): Promise<void> {
    try {
      const exist = await this.searchByIdCompanyAndCategory(association);
      if (!exist) throw new HttpError(404, 'Associação não esiste');
      await associationCompanyAndCategoryRepository.delete(association);
    } catch (error) {
      throw new HttpError(500, String(Error));
    }
  }

  private async searchByIdCompanyAndCategory(
    association: AssCompanyAndCategory
  ): Promise<boolean> {
    try {
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
}

export default new AssociationCompanyAndCategoryServices();
