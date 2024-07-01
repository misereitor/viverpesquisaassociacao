import Category from './category';
import Company from './company';

export default interface AssCompanyAndCategory {
  id: number;
  company_id: number;
  category_id: number;
}

export interface AssCompanyAndCategoryInDB {
  category_id: number;
  category_name: string;
  company_name: string;
  company_id: number;
  company_associate: boolean;
  active: boolean;
}

export interface ResponseAssCompanyAndCategory {
  category: Category;
  companyAssociate: Company[];
}
